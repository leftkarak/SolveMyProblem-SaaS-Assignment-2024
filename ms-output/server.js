const { Kafka } = require("kafkajs")
const mongoose = require("mongoose")

// Kafka Configuration
const kafka = new Kafka({
    clientId: "ms-output",
    brokers: ["kafka-broker:9092"],
    retries: 10,
});

// Create a Kafka producer instance
const producer = kafka.producer();
// Create a Kafka consumer instance
const consumer = kafka.consumer({ groupId: "ms-output" });

const main = async () => {

    // Set the mongoose DB
    await mongoose.connect("mongodb://root:omada3@mongodb-output:27017/Output?authSource=admin");

    // Set the attributes
    const OutputSchema = new mongoose.Schema({
        submission_id: String,
        email: String,
        execution_date: Date,
        execution_duration: Number,
        execution_output: Object,
        error: String
    })

    const Output = mongoose.model("Output", OutputSchema)

    await producer.connect()
    await consumer.connect()

    // Subscribed topics
    await consumer.subscribe({
        topics: [
            "create-submission-req", // create a new submission
            "output-res", // update results after execution
            "get-result-req", // show results
            "delete-submission-req", // delete a submission
        ],
        fromBeginning: false
    })

    // Start listening for topics/messages
    await consumer.run({
        eachMessage: async ({ message, topic }) => {

            // Create a new submission
            if (topic === "create-submission-req") {
                const submission_info = JSON.parse(message.value.toString());

                const metadata = submission_info.metadata

                try {
                    // Delete pre-existing same submissions
                    const deletedSubmissions = await Output.deleteMany({
                        email: metadata.email,
                        submission_id: metadata.submission_id,
                    });
                    console.log("Number of pre-existing submissions deleted in OutputSchema:", deletedSubmissions.deletedCount);
                } catch (error) {
                    console.error("Error while deleting submissions in OutputSchema:", error);
                }

                const newOutput = new Output({
                    submission_id: metadata.submission_id,
                    email: metadata.email,
                    execution_date: null,
                    execution_duration: null,
                    execution_output: null,
                });

                await newOutput.save();
            }

            // When execution is completed update the attributes of the submission
            else if (topic === "output-res") {
                const execution_info = JSON.parse(message.value.toString());

                await Output.findOneAndUpdate({ email: execution_info.email, submission_id: execution_info.submission_id },
                    {
                        execution_date: execution_info.execution_date,
                        execution_duration: execution_info.execution_duration,
                        execution_output: execution_info.execution_output,
                        error: execution_info.error
                    });

                const result = await Output.findOne({ email: execution_info.email, submission_id: execution_info.submission_id });

                // Notify the ms submissions to change the status
                await producer.send({
                    topic: "execution-ended",
                    messages: [
                        { key: execution_info.email, value: JSON.stringify(execution_info) }
                    ]
                })

                // // Εδώ βλέπουμε τα results όταν δεν αναποκρίνεται το frontend !!!
                // console.log("  !Stored execution_output from DB:", result.execution_output);
            }

            // Gather details and produce message of requested submission's result, on topic: get-result-res
            else if (topic === "get-result-req") {
                const email = message.key.toString();
                const submission_id = message.value.toString();
                const submission_info = await Output.findOne({email: email, submission_id: submission_id});

                await producer.send({
                    topic: "get-result-res",
                    messages: [
                        {key: email, value: JSON.stringify(submission_info)}
                    ]
                });
            }

            // Find requested submission and delete
            else if (topic === "delete-submission-req") {
                const submission_info = JSON.parse(message.value.toString());

                await Output.findOneAndDelete(
                    { email: submission_info.email, submission_id: submission_info.submission_id },
                );
            }
        }
    });

    // Notify on running ms
    console.log("MS output is running")
};

main();