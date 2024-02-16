const express = require('express');
const mongoose = require('mongoose');
const stuffRoutes = require('./routes/stuff');
const userRoutes = require('./routes/user');

const app = express();
// connect mangoose to Atlas
// mongodb+srv://abderazak15:<password>@cluster0.fpoa31a.mongodb.net/?retryWrites=true&w=majority
// mongoose.connect('mongodb+srv://abderazak15:Magnum-4546@cluster0.fpoa31a.mongodb.net/?retryWrites=true&w=majority')
// connect mangoose localy
mongoose.connect('mongodb://127.0.0.1:27017/myapp') // database name is "myapp", it will be created if it does not exist
	.then(()=>{
		console.log('Successfully connected to Mongodb Atlas!')
	})
	.catch((error)=>{
		console.log('Unable to connect to Mongodb Atlas!')
		console.error(error)
	})

// A middleware that intercepts all incoming POST requests that has Content-Type "application/json" and parses there JSON body
app.use(express.json());
// without Express we will have to use the module "body-parser" in order to parse the body of a "post request" as JSON.

// CORS
app.use((req, res, next) => {
	// CORS stands for "cross-origin resource sharing"
	// This is a standard that allows us to relax default security rules that prevent HTTP calls between servers. 
	// We want two origins (ex: localhost:3000 and localhost:4200), to communicate with each other.

	// This will allow requests from all origins to access the API
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use('/api/stuff', stuffRoutes); // once we have a request to the api route '/api/stuff', "stuffRoutes" will handle it.
app.use('/api/auth', userRoutes); // once we have a request to the api route '/api/auth', "userRoutes" will handle it.

app.use((req, res) => {
  res.json({ message: 'everything is working fine' }); 
});

module.exports = app;