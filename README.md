## File-Share

---

### **DEPLOYED VERSION**

**_Live demo: https://inshare-fileshare.herokuapp.com/_**

### NOW DATA TRANSFFER EASY

### **INTRODUCTION**

#### A file-sharing app is the kind of application program that enables and equips effective collaboration and file sharing within the organization. With file-sharing applications, you get to save, share, manage, and collaborate on business-critical files and documents in one place.

### **METHODOLOGY:**

#### We are designing and implementing a small model of file sharing system. This system uses client ¬ server architecture to make this thing happen and on top of client-server architecture we are using some concepts of file system to allocate some storage to users. Here mainly we have 4 tasks, these tasks are performed by the client and server to provide services to user.

#### Tasks are as follows:

1. Users can register to get the benefits of file sharing services offered by file sharing system.
2. Server will always do user authentication.
3. Users can upload files on the file sharing system (server).
4. User can download the file from the file sharing system (server).

### **Workflow of all the above tasks:**

#### In the workflow, we are going to explain briefly about all the steps our file sharing system will take in order to serve the requesting service.

#### 1. Registration Workflow:

- User sends registration request with register command, and gives username and password as the parameters of the register command, using file sharing client (client performs encryption on password before sending using the shared key between client and server) to file sharing system (file sharing server). For example “register rajni abc”.
- File sharing system (server) receives the registration request and makes an entry of this username in the database with the encrypted form of the password (for the security purpose), makes a directory named “userId” in the file system allocates some storage this user.

#### 2. User Authentication Workflow:

- Before allowing any user to use the services of the file sharing system, system (server) first validates that the user requesting for the service is a registered user (valid) or not. To do that server follows the following steps:

- Receives username and the password and performs a search in the user information database to find an entry of the user with the given username.

- If server finds an entry in the database for the requesting user it further proceeds for the the password verification otherwise it sends a message to user that says username is not valid.

#### 3. File Upload Workflow:

- User sends file upload request with upload command, and gives filename (file path) as the parameter of the upload command, using file sharing client to file sharing system (file sharing server).
- Server receives file upload request and checks that service requesting user has enough space available or not on the basis of the file size user wants to upload

- If server finds that user has enough available space it puts user’s file named “xyz.txt” in the user’s directory named as “userId” of this user. Otherwise server sends a message to user that you don’t have enough storage available to upload the file “xyz.txt”.

#### 4. File Download Workflow:

- User sends file download request with download command, and gives filename and a path where user wants to save file in its local machine as the parameters of the download command, using file sharing client to file sharing system (file sharing server). For example “download xyz.txt /home/rajni/”

- Server receives the download request from the user and checks in the user’s directory named as “userId” that the requesting file (“xyz.txt”) for downloading resides in the requesting user’s directory or not

- If server finds the requesting file in the user’s directory, it sends the file to the requesting client and then client saves the received file in the place specified by the user as the second parameter

### HOW TO USE:

- Sign up the user
- Login with user details
- Browse the require file to share
- Copy the link to share / User can directly share file link through mail to receiver
- File size should be less than 500mb

### DEPLOYMENT

The website is deployed with git into heroku. Below are the steps taken:

- git init
- git add -A
- git commit -m "Commit message"
- heroku login
- heroku create
- heroku config:set CONFIG_KEY=CONFIG_VALUE
- parcel build ./public/js/index.js --out-dir ./public/js --out-file bundle.js
- git push heroku master
- heroku open

### BUILD WITH :

- NodeJS - JS runtime environment
- Express - The web framework used
- Mongoose - Object Data Modeling (ODM) library
- MongoDB Atlas - Cloud database service
- HBS - High performance template engine
- JSON Web Token - Security token
- Postman - API testing
- Heroku - Cloud platform

### INSTALLATION:

You can fork the app or you can git-clone the app into your local machine. Once done that, please install all the dependencies by running

- $ npm i
- set your env variables
- $ npm run watch:js
- $ npm run build:js
- $ npm run dev (for development)
- $ npm run start:prod (for production)
- $ npm run debug (for debug)
- $ npm start
