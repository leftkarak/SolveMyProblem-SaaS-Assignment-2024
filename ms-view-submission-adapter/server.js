const { Kafka } = require("kafkajs");
const express = require("express");
const app = express();

// Kafka Configuration
const kafka = new Kafka({
    clientId: "ms-view-submission-adapter",
    brokers: ["kafka-broker:9092"],
    retries: 10,
});

// Create a Kafka producer instance
const producer = kafka.producer();
// Create a Kafka consumer instance
const consumer = kafka.consumer({ groupId: "ms-view-submission-adapter" });


// Storing submission as obj globally (key: email, val: submission)
const Submission = { submission: undefined };

const main = async () => {
    await producer.connect();
    await consumer.connect();

    // Subscribed topics
    await consumer.subscribe({
        topics: [
            "get-submission-res"  // get one submission's details
        ],
        fromBeginning: true
    });

    // Start listening for topics/messages
    await consumer.run({
        eachMessage: async ({topic, message}) => {

            // Get submission
            if (topic === "get-submission-res") {
                const submission = JSON.parse(message.value.toString());

                // Λύνουμε το Promise αν υπάρχει
                if (Submission.resolve) {
                    Submission.resolve(submission);
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


    // GET request to build a submission's page, to provide details we must access the DB, on topic: get-submission-req
    app.get('/submission/:email/:submission_id', async (req, res) => {
        const email = req.params.email
        const submission_id = req.params.submission_id

        // Δημιουργούμε ένα νέο Promise που θα λυθεί όταν λάβουμε την απάντηση
        const submissionPromise = new Promise((resolve, reject) => {
            // Αποθηκεύουμε τη συνάρτηση resolve σε μια μεταβλητή
            Submission.resolve = resolve;

            // Προσθέτουμε έναν timeout σε περίπτωση που δεν λάβουμε απάντηση
            setTimeout(() => {
                reject(new Error('Timeout waiting for submission'));
            }, 10000); // 10 δευτερόλεπτα
        });

        await producer.send({
            topic: "get-submission-req",
            messages: [
                {key: email, value: submission_id}
            ]
        });

        try {
            // Περιμένουμε το Promise να λυθεί
            const submission = await submissionPromise;

            res.send({submission});
        } catch (error) {
            res.status(500).send({error: error.message});
        } finally {
            // Καθαρίζουμε τη μεταβλητή
            delete Submission.resolve;
        }
    })

    // Start API server on API port (4008)
    app.listen(4012, () => {
        // Notify on running ms
        console.log("MS view-submission ADAPTER is running");
    });
}

main();