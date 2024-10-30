const { Kafka } = require("kafkajs")
const mongoose = require("mongoose")

// Kafka Configuration
const kafka = new Kafka({
    clientId: "ms-submissions",
    brokers: ["kafka-broker:9092"],
    retries: 10,
});

// Create a Kafka producer instance
const producer = kafka.producer();
// Create a Kafka consumer instance
const consumer = kafka.consumer({ groupId: "ms-submissions" });

const main = async () => {

    // Set the mongoose DB
    await mongoose.connect("mongodb://root:omada3@mongodb-submissions:27017/Submissions?authSource=admin");

    // Set the attributes
    const SubmissionSchema = new mongoose.Schema({
        submission_id: String,
        email: String,
        users_code: Object,
        users_input: Object,
        state: String,
        creation_date: Date,
        last_update_date: Date,
        error: String
    })

    const Submission = mongoose.model("Submission", SubmissionSchema)

    await producer.connect()
    await consumer.connect()

    // Subscribed topics
    await consumer.subscribe({
        topics: [
            "create-submission-req", // create a new submission
            // "update-submission-req", // update an existing submission
            "get-submissions-req", // for the frontend submission list
            "get-submission-req", // provide submission information
            // "get-user-submissions-req", // for the frontend submission list
            "execution-accepted", // enough credits so problem can go to solver
            "execution-started", // problem has entered the solver
            "execution-ended", // problem has exited the solver
            "delete-submission-req" // delete a submission
        ],
        fromBeginning: false
    })

    // Start listening for topics/messages
    await consumer.run({
        eachMessage: async ({ message, topic }) => {

            // Create a new submission
            if (topic === "create-submission-req") {
                const submission_info = JSON.parse(message.value.toString());

                const users_code = submission_info.users_code
                const users_input =  submission_info.users_input
                const metadata = submission_info.metadata

                try {
                    // Delete pre-existing same submissions
                    const deletedSubmissions = await Submission.deleteMany({
                        email: metadata.email,
                        submission_id: metadata.submission_id,
                    });
                    console.log("Number of pre-existing submissions deleted in SubmissionSchema:", deletedSubmissions.deletedCount);
                } catch (error) {
                    console.error("Error while deleting submissions in SubmissionSchema:", error);
                }

                const newSubmission = new Submission({
                    // Set submission attributes
                    submission_id: metadata.submission_id,
                    email: metadata.email,
                    users_code: users_code,
                    users_input: users_input,
                    state: "Ready",

                    // Set the timestamp information
                    creation_date: new Date().toISOString(),
                    last_update_date: new Date().toISOString(),
                });

                await newSubmission.save();
            }

            // // Update an existing submission
            // else if (topic === "update-submission-req") {
            //     const submission_info = JSON.parse(message.value.toString());
            //
            //     // Find requested submission and update its attributes
            //     await Submission.findOneAndUpdate(
            //         { email: submission_info.email, submission_id: submission_info.submission_id },
            //         {
            //             // Set new attributes
            //             users_code: submission_info.users_code,
            //             users_input: submission_info.users_input,
            //             update_date: new Date().toISOString()
            //         }
            //     );
            // }

            // Return all submissions, on topic: get-submissions-res
            else if (topic === "get-submissions-req") {
                const submissions_info = await Submission.find({});

                await producer.send({
                    topic: "get-submissions-res",
                    messages: [
                        {
                            key: "sumbissions",
                            value: JSON.stringify(submissions_info)
                        }
                    ]
                })
            }

            // Gather details and produce message of a requested submission's information, on topic: get-submission-res
            else if (topic === "get-submission-req") {
                const email = message.key.toString();
                const submission_id = message.value.toString();
                const submission_info = await Submission.findOne({email: email, submission_id: submission_id});

                await producer.send({
                    topic: "get-submission-res",
                    messages: [
                        {key: email, value: JSON.stringify(submission_info)}
                    ]
                });
            }

            // // Return all submissions under the same email/user, on topic: get-user-submissions-res
            // else if (topic === "get-user-submissions-req") {
            //     const email = message.value.toString();
            //     const user_submissions = await Submission.find({ email: email });
            //
            //     await producer.send({
            //         topic: "get-user-submissions-res",
            //         messages: [
            //             {key: email, value: JSON.stringify({'email': email, 'submissions': user_submissions})}
            //         ]
            //     })
            // }

            // If submission has execution rights alert the solver ms, on topic: solver-req
            else if (topic === "execution-accepted") {
                const email = message.key.toString();
                const submission_id = message.value.toString()

                const submission_info = await Submission.findOne({ email: email, submission_id: submission_id });

                // Produce message of submission info
                await producer.send({
                    topic: "solver-req",
                    messages: [
                        {value: JSON.stringify(submission_info)}
                    ]
                })
                console.log("sent to solver");

                // Update submission state to Waiting
                await Submission.findOneAndUpdate(
                     { email: email, submission_id: submission_id },
                     {
                         state: "Waiting..."
                     }
                 );
            }

            // Update submission state to Running
            else if (topic === "execution-started") {
                const submission_info = JSON.parse(message.value.toString())

                await Submission.findOneAndUpdate(
                    { email: submission_info.email, submission_id: submission_info.submission_id },
                    {
                        state: "Running..."
                    }
                );
            }

            // Update submission state to Complete
            else if (topic === "execution-ended") {
                const submission_info = JSON.parse(message.value.toString())

                await Submission.findOneAndUpdate(
                    { email: submission_info.email, submission_id: submission_info.submission_id },
                    {
                        state: "Completed"
                    }
                );
            }

            // Find requested submission and delete
            else if (topic === "delete-submission-req") {
                const submission_info = JSON.parse(message.value.toString());

                await Submission.findOneAndDelete(
                    { email: submission_info.email, submission_id: submission_info.submission_id },
                );
            }
        }
    });

    // Notify on running ms
    console.log("MS submissions is running");
};

main();