const express = require('express');
const mongoose = require('mongoose');

const app = express();
// mongodb+srv://abderazak15:<password>@cluster0.fpoa31a.mongodb.net/?retryWrites=true&w=majority
mongoose.connect('mongodb+srv://abderazak15:Magnum-4546@cluster0.fpoa31a.mongodb.net/?retryWrites=true&w=majority')
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

// A POST route that allows the frontend to send data to the backend (ex: users put objects for sell)
app.post('/api/stuff', (req, res, next) => {
  console.log(req.body); // log the data that was sent (we can save it in a database for example)
	// after receiving data we must send back a response, or the request will hang.
  res.status(201).json({ // 201 code is for successful resource creation.
    message: 'Thing created successfully!'
  });
});

// creating an API for when the frontend accesses the route "localhost:3000/api/stuff"
app.use('/api/stuff', (req, res, next) => {
  const stuff = [
    {
      _id: 'oeihfzeoi',
      title: 'My first thing',
      description: 'All of the info about my first thing',
      imageUrl: '',
      price: 4900,
      userId: 'qsomihvqios',
    },
    {
      _id: 'oeihfzeomoihi',
      title: 'My second thing',
      description: 'All of the info about my second thing',
      imageUrl: '',
      price: 2900,
      userId: 'qsomihvqios',
    },
  ];
  res.status(200).json(stuff); // the code 200 means we recieved the data successfully.
	// whenever someone accesses this API he gets a response with the array "stuff" as json.
	// The user accessed this route to get data from the backend, so we could have used "app.get" instead of "app.use".
});

// A "get request" wants to get data from the api (ex: the API reads from the database then returns a response to the frontend)
// A "post request" wants to post something (ex: the frontend sends data and we put it in the database)

/* 
app.use("route", callback) intercepts every request that comes to that route
app.get("route", callback) intercepts only "get request"
app.post("route", callback) intercepts only "post request"

We should always put "app.post" above "app.use" in the code when they have the same route, because the server executes 
middlewares from top to bottom, so "app.use" will intercept all requests to that route.

We won't have this problem of "app.use" intercepting requests in a certain route, if this route has only "app.get" and 
"app.post" middlewares, so here both get requests and post requests get handdled properly by their respective middlewares.
*/
module.exports = app;