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



The application pages highlighting all primary features of the service:

Login:
![login](https://github.com/user-attachments/assets/cf9213d9-baeb-44fb-bf10-9afc634cb48e)

Main page (submission list):
![subs](https://github.com/user-attachments/assets/55ac7947-a289-4bc2-962a-a10567a86488)


Show/Add credits amount:
![Credits](https://github.com/user-attachments/assets/31a6e544-53d4-4a1a-b982-28a29cfb5eff)

Create submission:
![Create](https://github.com/user-attachments/assets/acdc6702-7c80-4d1b-8204-d16d45482fee)

View submission details (in full screen or/and download them):
![view0](https://github.com/user-attachments/assets/f1d91279-6d6b-4584-a819-15b7823b7008)
![view1](https://github.com/user-attachments/assets/c297f733-e322-4feb-9665-b4131c926cc9)
![view2](https://github.com/user-attachments/assets/6cccb470-59d8-43d0-beec-a7b1d0e33346)

View results, after execution (in full screen or/and download them):
![results0](https://github.com/user-attachments/assets/14620fb8-67ff-4ba3-be87-dcfa32b49864)
![results1](https://github.com/user-attachments/assets/15f71564-0bcc-4b96-a8fc-6e97be00a46f)

View analytical data and statistics from previous executions:
![analytics](https://github.com/user-attachments/assets/d3ab48fc-19da-4b6c-97aa-9c0e41549fa6)
