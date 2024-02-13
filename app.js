const express = require('express');
const mongoose = require('mongoose');
const Thing = require('./models/thing'); // Import our Mongoose model (Schema)

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

// A POST route that allows the frontend to send data to the backend (ex: users put objects for sell)
app.post('/api/stuff', (req, res, next) => {
	// we recieve the data in req.body
	const thing = new Thing({
		// Using the "new" keyword with a Mongoose model creates a new "_id" field by default
    title: req.body.title,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    price: req.body.price,
    userId: req.body.userId
  });
	// after receiving data we must send back a response, or the request will hang.
	thing.save().then( // the "save()" method saves the object into the data base and returns a promise
		() => {
			// sending a response when the data is created successfully
			res.status(201).json({ // 201 code is for successful resource creation.
				message: 'Post saved successfully!'
			});
		}
	).catch(
		(error) => {
			// sending a response when we have an error
			res.status(400).json({
				error: error
			});
		}
	);
});

// a "get" API route to "get" data
app.get('/api/stuff', (req, res, next) => {
	Thing.find().then(
    (things) => {
      res.status(200).json(things); // We return two things:
			// the code 200 which means that the request has succeeded.
			// and a json object containing the things we retrieved from the database.
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
	// The user accessed this route to get data from the backend, so we could have used "app.get" instead of "app.use".
});

// a "get" API route to retrieve only a specific "thing"
app.get('/api/stuff/:id', (req, res, next) => {
  Thing.findOne({
    _id: req.params.id
  }).then(
    (thing) => {
      res.status(200).json(thing);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
});

// a "put" API route to Update an Existing "Thing"
app.put('/api/stuff/:id', (req, res, next) => {
  const thing = new Thing({
    _id: req.params.id, // the "_id" field can't be modified once the object is created (immutable field), so we provide 
		// the "_id" of the object we want to update when creating the new object.
    title: req.body.title,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    price: req.body.price,
    userId: req.body.userId
  });
	// "Thing.updateOne" takes an object with the "_id" parameter of the object we want to updaet as a first parameter, and it
	// takes the new object as a second parameter that will replace the existing object, then it returns a Promise.
  Thing.updateOne({_id: req.params.id}, thing).then(
    () => {
      res.status(201).json({
        message: 'Thing updated successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
});

// a "delete" API route to delete a "Thing"
app.delete('/api/stuff/:id', (req, res, next) => {
  Thing.deleteOne({_id: req.params.id}).then(
    () => {
      res.status(200).json({
        message: 'Deleted!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
});

module.exports = app;