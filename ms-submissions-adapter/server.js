const { Kafka } = require("kafkajs");
const express = require("express");
const multer = require("multer");
const app = express();

// Kafka Configuration
const kafka = new Kafka({
    clientId: "ms-submissions-adapter",
    brokers: ["kafka-broker:9092"],
    retries: 10,
});

// Create a Kafka producer instance
const producer = kafka.producer();
// Create a Kafka consumer instance
const consumer = kafka.consumer({ groupId: "ms-submissions-adapter" });

// Multer Configuration
const storage = multer.memoryStorage();  // Store files in memory
const upload = multer({ storage: storage });


// Storing submission as obj globally (key: email, val: submission)
let Accepted = { accept: undefined };

const main = async () => {
    await producer.connect();
    await consumer.connect();

    // Subscribed topics
    await consumer.subscribe({
        topics: [
            "execution-accepted", // execution accepted
            "execution-denied" // execution denied
        ],
        fromBeginning: true
    });

    // Start listening for topics/messages
    await consumer.run({
        eachMessage: async ({ topic, message }) => {

            // Notify if credits are enough
            if (topic === "execution-accepted") {
                const accept = "true";

                // Λύνουμε το Promise αν υπάρχει
                if (Accepted.resolve) {
                    Accepted.resolve(accept);
                }
            }

            // Notify if credits are not enough
            else if (topic === "execution-denied") {
                const accept = "false";

                // Λύνουμε το Promise αν υπάρχει
                if (Accepted.resolve) {
                    Accepted.resolve(accept);
                }
            }
        }
    })


    /* In order our code to work as an API, between the frontend and backend microservices, on http://localhost:4007/,
     we must utilize CORS */
    /* Wikipedia: Cross-origin resource sharing (CORS) is a mechanism to safely bypass the Same-origin policy, that is, it allows a
     web page to access restricted resources from a server on a domain different than the domain that served the web page */
    app.use((req, res, next) => {
        res.set({
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type"
        });

        next();
    }, express.json());


    // POST request send if user creates new submission, to update the DB, on topic: create-submission-req
    app.post('/create-submission',
        // Get the python and json files
        upload.fields([
            { name: 'pyFile', maxCount: 1 },
            { name: 'jsonFile', maxCount: 1 }]),

        async (req, res) => {
            try {

                const pyFile = req.files.pyFile[0].buffer.toString('utf-8');
                const jsonFile = req.files.jsonFile[0].buffer.toString('utf-8');
                // All the user's and submission's information
                const metadata = JSON.parse(req.body.metadata);

                // Create the message
                const message = {
                    users_code: pyFile,
                    users_input: jsonFile,
                    metadata: metadata
                }

                await producer.send({
                    topic: "create-submission-req",
                    messages: [
                        { value: JSON.stringify(message) }
                    ]
                })

                // Return status as response if everything OK
                res.sendStatus(200);

            } catch (error) {
                console.error(" Error processing submission in submission ADAPTER: ", error);
                res.status(500).json({error: " Failed to process submission in submission ADAPTER."});
            }
        }
    );


    // // POST request send if user edits a submission, to update the DB, on topic: update-submission-req
    // app.post('/update-submission', (req, res) => {
    //
    //     /* Don't change message the next microservice
    //     (ms-submissions) will extract information */
    //     producer.send({
    //         topic: "update-submission-req",
    //         messages: [
    //             {
    //                 value: JSON.stringify(req.body)
    //             }
    //         ]
    //     })
    //
    //     // Return status as response if everything OK
    //     res.sendStatus(200);
    // });


    // POST request send if user deletes a submission, to update the DB, on topic: delete-submission-req
    app.post('/delete-submission', async (req, res) => {

        // Create the message
        const message = {
            email: req.body.email,
            submission_id: req.body.submission_id,
        }

        await producer.send({
            topic: "delete-submission-req",
            messages: [
                { value: JSON.stringify(message) }
            ]
        })

        // Return status as response if everything OK
        res.sendStatus(200);
    });


    // POST request send if user tries to execute a submission, check if credits are enough, on topic: execution-req
    app.post('/execute-submission', async (req, res) => {

        // Δημιουργούμε ένα νέο Promise που θα λυθεί όταν λάβουμε την απάντηση
        const acceptPromise = new Promise((resolve, reject) => {
            // Αποθηκεύουμε τη συνάρτηση resolve σε μια μεταβλητή
            Accepted.resolve = resolve;

            // Προσθέτουμε έναν timeout σε περίπτωση που δεν λάβουμε απάντηση
            setTimeout(() => {
                reject(new Error('Timeout waiting for submissions'));
            }, 10000); // 10 δευτερόλεπτα
        });

        /* Declare key and value of message,
        the next microservice (ms-credits)
        will check if there are enough credits */
        await producer.send({
            topic: "execution-req",
            messages: [
                {
                    key: req.body.email.toString(),
                    value: req.body.submission_id.toString()
                }
            ]
        })

        try {
            // Περιμένουμε το Promise να λυθεί
            const accept = await acceptPromise;
            res.send({ accept });

        } catch (error) {
            res.status(500).send({ error: error.message });
        } finally {
            // Καθαρίζουμε τη μεταβλητή
            delete Accepted.resolve;
        }
    })


    // Start API server on API port (4008)
    app.listen(4008, () => {
        // Notify on running ms
        console.log("MS submissions ADAPTER is running");
    });
}

main();