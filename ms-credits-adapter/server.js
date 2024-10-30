const { Kafka } = require("kafkajs");
const express = require("express");
const app = express();

// Kafka Configuration
const kafka = new Kafka({
    clientId: "ms-credits-adapter",
    brokers: ["kafka-broker:9092"],
    retries: 10,
});

// Create a Kafka producer instance
const producer = kafka.producer();
// Create a Kafka consumer instance
const consumer = kafka.consumer({ groupId: "ms-credits-adapter" });


// Credits must be global to be accessed everywhere
let Credits = { credits: undefined };

const main = async () => {
    await producer.connect();
    await consumer.connect();

    // Subscribed topic
    await consumer.subscribe({
        topics: [
            "get-credits-res" // get amount of credits
        ],
        fromBeginning: true
    });


    // Start listening for topics/messages
    await consumer.run({
        eachMessage: async ({ topic, message }) => {

            // Get the amount of credits in DB
            if (topic === "get-credits-res") {
                const credits = JSON.parse(message.value.toString());

                // Λύνουμε το Promise αν υπάρχει
                if (Credits.resolve) {
                    Credits.resolve(credits);
                }            }
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


    // GET request to build credits page, to provide amount of credits we must access the DB, on topic: get-credits-req
    app.get('/credits', async (req, res) => {

        // Δημιουργούμε ένα νέο Promise που θα λυθεί όταν λάβουμε την απάντηση
        const creditsPromise = new Promise((resolve, reject) => {
            // Αποθηκεύουμε τη συνάρτηση resolve σε μια μεταβλητή
            Credits.resolve = resolve;

            // Προσθέτουμε έναν timeout σε περίπτωση που δεν λάβουμε απάντηση
            setTimeout(() => {
                reject(new Error('Timeout waiting for submissions'));
            }, 10000); // 10 δευτερόλεπτα
        });

        await producer.send({
            topic: "get-credits-req",
            messages: [{value: null}]
        });

        try {
            // Περιμένουμε το Promise να λυθεί
            const credits = await creditsPromise;
            res.send({ credits });
        } catch (error) {
            res.status(500).send({ error: error.message });
        } finally {
            // Καθαρίζουμε τη μεταβλητή
            delete Credits.resolve;
        }
    });


    // POST request send if user bought credits, to update credits in the DB, on topic: add-credits-req
    app.post('/buy-credits', (req, res) => {

        producer.send({
            topic: "add-credits-req",
            messages: [
                {
                    key: "credits",
                    value: req.body.credits.toString()
                }
            ]
        });

        // Return status as response if everything OK
        res.sendStatus(200);
    });


    // Start API server on API port (4007)
    app.listen(4007, () => {
        // Notify on running ms
        console.log("MS credits ADAPTER is running");
    });
}

main();