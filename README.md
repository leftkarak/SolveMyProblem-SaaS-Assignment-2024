This repository contains a university project. The [assigment](https://github.com/leftkarak/SolveMyProblem-SaaS-Assignment-2024/tree/main/Assigment) as given by our SaaS course professor.

A university (NTUA, School of ECE, Databases course) team project to create a Dockerized SaaS platform that provides users with an online environment to upload, execute, and view results from their code and data inputs. Tools for deployment, development, documentation, and testing include Docker, Kafka, Node.js, Express, Visual Paradigm, and JMeter. Note: project still contains some minor bugs.

--------------------------------------------------------------------------------------------------------------------------

# NTUA ECE SAAS 2024 PROJECT
  
## TEAM (03)
  
![Image Description](frontend/public/css/540076-200.png)

  A Software as a Service (SaaS) project that enables users to solve complex problems by running their code and inputs on our solver. Users can purchase credits to access solver resources and store their problem   code, input, and results online.

  ### Features
  
- Purchase Credits for Problem Solving
- Submit Problems for Solution
- Display List of Submitted/Solved Problems
- Display Statistics of Submitted/Solved Problems

  ### Dependencies
  
- kafkajs (npm install kafkajs)
- mongoose (npm install mongoose)
- Express (npm install express)
- Express-Sessions (npm install express-session)
- Body-Parser (npm install body-parser)
- Multer (npm install multer). For uploading files.

  ### DevDependencies

  - nodemon (npm install nodemon --save-dev)


  Setup Guide:

1. Install Docker:
   Docker is required for this project. If you don't have it installed, download and install Docker from here.

3. Installation Instructions:

 Clone the repository by running the following command in your terminal:

  #### Clone the repository
  ```bash
    git clone https://github.com/ntua/saas2024-03.git
  ```
  #### Navigate into the project directory
  ```bash
    cd saas2024-03
  ```
Then check the package.json file, if all dependencies and devdependencies above are included. If things are right continue.
  #### Build and start the docker containers (for Windows)
  ```bash
    docker compose up --wait
  ```
##### (for linux)
```bash
    sudo docker compose up --wait
```

3. Access the server:
#### After setting up the project, the server will be available at:
```bash
http://localhost:3000
```
4. Usage:

  You can upload code in Python (.py) format and input files in JSON (.json) format.
  To get started, visit the "Code and Input Example" directory where you can find example files to try yourself!

-------------------------------------------------------------------------------------------------------------------

The application pages highlighting all primary features of the service:

Login:
![login](https://github.com/user-attachments/assets/dfb0f23b-0e99-47bc-be8d-656cbf8c7008)

Main page (submission list):
![subs](https://github.com/user-attachments/assets/de395708-0100-434c-a7ab-eb149af3568e)

Show/Add credits amount:
![Credits](https://github.com/user-attachments/assets/7066762d-59b5-4f4f-a4f0-868e579b5f11)

Create submission:
![Create](https://github.com/user-attachments/assets/8c9e8553-d9b9-4a55-8192-2a1c51f38af5)

View submission details (in full screen or/and download them):
![view0](https://github.com/user-attachments/assets/eab37cb8-5514-4f9a-8436-845b9f400900)
![view1](https://github.com/user-attachments/assets/2750de73-a65c-4deb-aab3-979f5f9dab8a)
![view2](https://github.com/user-attachments/assets/ae603199-e4f7-4c51-a38a-d6c4389c19a1)

View results, after execution (in full screen or/and download them):
![results0](https://github.com/user-attachments/assets/4de38499-4153-4893-bafe-3963fbd3a81f)
![results1](https://github.com/user-attachments/assets/5a9e238a-ef52-485b-84f0-bd3cea0ebb65)

View analytical data and statistics from previous executions:
![analytics](https://github.com/user-attachments/assets/766938cc-6c69-4ec1-a90f-0a64e14d5a63)

And a screenshot of the containers running in Docker:
![Docker](https://github.com/user-attachments/assets/9cfcebc3-0286-47bc-a81c-b1b40ab2ab10)
