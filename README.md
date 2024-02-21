# a template for node js Express backend (post, get, put, and delete)

the first thing to do to start a new node project is:
* npm init
This will initialize an empty "package.json" and you will be asked for entries through the command line. Set the field "entry point" to "server.js"

now create the file "server.js", and if you create a server and listened to it in the port 3000, you can start the server by running the command:
* node server
and see the result in http://localhost:3000 
for the server to restart automaticaly we we change any file in our server we can use "nodemon"

If we want to use Express we have to install it in our project, so we open the cmd in our folder location and run:
* npm install express
we notice two things created: the folder "node_modules", and the file package-lock.json

If we want to push this to a github repository, don't forget to include the file ".gitignore" containing the line "node_modules" to avoid pushing this large folder to your remote repo.

To make sure that new data entered to Mangodb is unique we use the package:
* npm install mongoose-unique-validator

To encrypt the passwords we use the package "bcrypt"
* npm install bcrypt

To implement token based authentication install the package "JSON Web Tokens" (JWT):
* npm install jsonwebtoken

Implement file uploads to allow users to upload images of items they want to sell, we intall the package "multer"
* npm install multer