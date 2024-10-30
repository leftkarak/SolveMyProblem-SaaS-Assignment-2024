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
