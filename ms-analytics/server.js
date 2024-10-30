const { Kafka } = require("kafkajs")
const mongoose = require("mongoose")

// Kafka Configuration
const kafka = new Kafka({
    clientId: "ms-analytics",
    brokers: ["kafka-broker:9092"],
    retries: 10,
});

// Create a Kafka producer instance
const producer = kafka.producer();
// Create a Kafka consumer instance
const consumer = kafka.consumer({ groupId: "ms-" });

const main = async () => {

    // Set the mongoose DB
    await mongoose.connect("mongodb://root:omada3@mongodb-analytics:27017/Analytics?authSource=admin");

    // Set the attributes
    const AnalyticsSchema = new mongoose.Schema({
        email: String,
        execution_date: Date,
        execution_duration: Number,
    })

    const Analytics = mongoose.model("Analytics", AnalyticsSchema)

    await producer.connect()
    await consumer.connect()

    // Subscribed topics
    await consumer.subscribe({
        topics: [
            "output-res", // get execution information
            "get-analytics-req" // return information if asked
        ],
        fromBeginning: false
    })

    await consumer.run({
        eachMessage: async ({ message, topic }) => {

            // Add execution information to table
            if (topic === "output-res") {
                const execution_info = JSON.parse(message.value.toString());

                const newAnalytics = new Analytics({
                    email: execution_info.email,
                    execution_date: execution_info.execution_date,
                    execution_duration: execution_info.execution_duration
                });

                await newAnalytics.save();
            }

            // Return all execution information, on topic: get-analytics-res
            else if (topic === "get-analytics-req") {
                const analytics = await Analytics.find({});

                producer.send({
                    topic: "get-analytics-res",
                    messages: [
                        { value: JSON.stringify(analytics) }
                    ]
                });
            }
        }
    });

    // Notify on running ms
    console.log("MS analytics is running");

};

main();