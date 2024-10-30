const { Kafka } = require("kafkajs");
const express = require("express");
const app = express();

// Kafka Configuration
const kafka = new Kafka({
    clientId: "ms-submissions-list-adapter",
    brokers: ["kafka-broker:9092"],
    retries: 10,
});

// Create a Kafka producer instance
const producer = kafka.producer();
// Create a Kafka consumer instance
const consumer = kafka.consumer({ groupId: "ms-submissions-list-adapter" });


// Storing submissions as obj globally (key: email, val: submission)
let All_submissions = { submissions: undefined };
// let User_submissions = { submissions: undefined };

const main = async () => {
    await producer.connect();
    await consumer.connect();

    await consumer.subscribe({
        topics: [
            "get-submissions-res",   // get information of all submissions
            "get-user-submissions-res" // get one user's submission information
        ],
        fromBeginning: true
    });

    await consumer.run({
        eachMessage: async ({ topic, message }) => {

            // Get all submissions
            if (topic === "get-submissions-res") {

                const submissions = JSON.parse(message.value.toString());

                // Λύνουμε το Promise αν υπάρχει
                if (All_submissions.resolve) {
                    All_submissions.resolve(submissions);
                }
            }

            // // Get submissions of specified user
            // else if (topic === "get-user-submissions-res") {
            //     const email = message.key.toString();
            //     const submissions = message.value.toString();
            //     User_submissions[email] = JSON.parse(submissions);
            // }
        }
    });


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


    // GET request to build submissions' page, to provide information we must access the DB, on topic: get-submissions-req
    app.get('/submissions', async (req, res) => {

        // Δημιουργούμε ένα νέο Promise που θα λυθεί όταν λάβουμε την απάντηση
        const submissionsPromise = new Promise((resolve, reject) => {
            // Αποθηκεύουμε τη συνάρτηση resolve σε μια μεταβλητή
            All_submissions.resolve = resolve;

            // Προσθέτουμε έναν timeout σε περίπτωση που δεν λάβουμε απάντηση
            setTimeout(() => {
                reject(new Error('Timeout waiting for submissions'));
            }, 10000); // 10 δευτερόλεπτα
        });

        await producer.send({
            topic: "get-submissions-req",
            messages: [{ value: 'dummy' }]
        });

        try {
            // Περιμένουμε το Promise να λυθεί
            const submissions = await submissionsPromise;
            res.send({ submissions });
        } catch (error) {
            res.status(500).send({ error: error.message });
        } finally {
            // Καθαρίζουμε τη μεταβλητή
            delete All_submissions.resolve;
        }
    });


    // // GET request to build a user's submissions page, to provide information we must access the DB, on topic: get-user-submissions-req
    // app.get('/user-submissions/:email', async (req, res) => {
    //     const email = req.params.email
    //
    //     await producer.send({
    //         topic: `get-user-submissions-req`,
    //         messages: [
    //             {value: email}
    //         ]
    //     });
    //
    //     // If waiting to receive message of asynchronous operation has no answer, we resolve after ten 100ms timeouts
    //     const MAX_TRIES = 10;
    //
    //     for (let tries = 0; tries < MAX_TRIES; tries++) {
    //         // lauow if (All_submissions.submissions !== undefined) { break; }
    //
    //         await new Promise(resolve => setTimeout(resolve, 1000));
    //
    //     }
    //
    //     // Sent submissions' information as response
    //     res.send(User_submissions[email]);
    //
    //     // Clear global variable
    //     User_submissions[email] = undefined
    // });

    // Start API server on API port (4011)
    app.listen(4011, () => {
        // Notify on running ms
        console.log("MS submissions-list ADAPTER is running");
    });
}

main();