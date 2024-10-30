const { Kafka } = require("kafkajs");
const express = require("express");
const app = express();

// Kafka Configuration
const kafka = new Kafka({
    clientId: "ms-analytics-adapter",
    brokers: ["kafka-broker:9092"],
    retries: 10,
});

// Create a Kafka producer instance
const producer = kafka.producer();
// Create a Kafka consumer instance
const consumer = kafka.consumer({ groupId: "ms-submissions-adapter" });


// Storing logs globally
let Logs = { logs: undefined };

const main = async () => {
    await producer.connect();
    await consumer.connect();

    // Subscribed topic
    await consumer.subscribe({
        topics: [
            "get-analytics-res" // get submission logs to present analytics
        ],
        fromBeginning: true
    });

    // Start listening for topics/messages
    await consumer.run({
        eachMessage: async ({ topic, message }) => {

            // Get logs
            if (topic === "get-analytics-res") {
                const logs = JSON.parse(message.value.toString());

                // Λύνουμε το Promise αν υπάρχει
                if (Logs.resolve) {
                    Logs.resolve(logs);
                }
            }
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


    // GET request to build analytics page, to provide information we must access the DB, on topic: get-analytics-req
    app.get('/analytics', async (req, res) => {

        // Δημιουργούμε ένα νέο Promise που θα λυθεί όταν λάβουμε την απάντηση
        const logsPromise = new Promise((resolve, reject) => {
            // Αποθηκεύουμε τη συνάρτηση resolve σε μια μεταβλητή
            Logs.resolve = resolve;

            // Προσθέτουμε έναν timeout σε περίπτωση που δεν λάβουμε απάντηση
            setTimeout(() => {
                reject(new Error('Timeout waiting for submissions'));
            }, 10000); // 10 δευτερόλεπτα
        });

        await producer.send({
            topic: "get-analytics-req",
            messages: [{ value: "dummy" }]
        });

        try {
            // Περιμένουμε το Promise να λυθεί
            const logs = await logsPromise;
            res.send({ logs });
        } catch (error) {
            res.status(500).send({ error: error.message });
        } finally {
            // Καθαρίζουμε τη μεταβλητή
            delete Logs.resolve;
        }
    });


    // Start API server on API port (4010)
    app.listen(4010, () => {
        // Notify on running ms
        console.log("MS analytics ADAPTER is running");
    });
}

main();