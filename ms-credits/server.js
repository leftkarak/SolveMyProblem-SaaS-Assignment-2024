const { Kafka } = require("kafkajs")
const mongoose = require("mongoose")

// Kafka Configuration
const kafka = new Kafka({
    clientId: "ms-credits",
    brokers: ["kafka-broker:9092"],
    retries: 10,
});

// Create a Kafka producer instance
const producer = kafka.producer();
// Create a Kafka consumer instance
const consumer = kafka.consumer({ groupId: "ms-credits" });


const main = async () => {

    // Set the mongoose DB
    await mongoose.connect("mongodb://root:omada3@mongodb-credits:27017/Credits?authSource=admin");

    // Set the attributes
    const CreditsSchema = new mongoose.Schema({
        dummy_id: String, // dummy attribute to retrieve easier the credits attribute
        credits: Number
    })

    const Credits = mongoose.model("Credits", CreditsSchema)

    await producer.connect()
    await consumer.connect()

    // Subscribed topics
    await consumer.subscribe({
        topics: [
            "get-credits-req", // return the total amount of credits
            "add-credits-req", // user bought more credits
            "execution-req" // check if there are enough credits
        ],
        fromBeginning: false
    })

    // Initialize table
    const newCredits = new Credits({
        dummy_id: "id",
        credits: 0
    });

    await newCredits.save();

    // Start listening for topics/messages
    await consumer.run({
        eachMessage: async ({ message, topic }) => {

            // Return total credits, on topic: get-credits-res
            if (topic === "get-credits-req") {
                const result = await Credits.findOne({ dummy_id: "id" }, "credits");

                await producer.send({
                    topic: "get-credits-res",
                    messages: [
                        {key: "credits", value: JSON.stringify(result.credits)}
                    ]
                });
            }

            // Increase global credits
            else if (topic === "add-credits-req") {
                const extra_credits = Number(message.value.toString());

                await Credits.updateOne(
                    { dummy_id: "id"},
                    { $inc: { credits: extra_credits  } }
                );
            }

            // Check if credits are enough for execution and respond, on topic: execution-accepted
            else if (topic === "execution-req") {
                const email = message.key.toString();
                const submission_id = message.value.toString()

                const credits = await Credits.findOne({dummy_id: "id"});

                if (credits.credits > 0) {
                    await producer.send({
                        topic: "execution-accepted",
                        messages: [
                            {
                                key: email,
                                value: submission_id
                            }
                        ]
                    })

                    await Credits.findOneAndUpdate(
                        {dummy_id: "id"},
                        { $inc: { credits: -1 }}
                    );
                }

                else {
                    await producer.send({
                        topic: "execution-denied",
                        messages: [{ value: null }]
                    })
                }
            }
        }
    });

    // Notify on running ms
    console.log("MS credits is running");
};

main();