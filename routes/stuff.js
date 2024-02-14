const express = require('express');
const Thing = require('../models/thing'); // Import our Mongoose model (Schema)

// creating an Express router, instead of registering the routes directly to the app ("app.get", "app.post", etc...).
const router = express.Router();
// Now we'll register them to the Express router and then register that router to the app.

// A POST route that allows the frontend to send data to the backend (ex: users put objects for sell)
router.post('/', (req, res, next) => {
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
	thing.save().then( // the "save()" method saves the object into the database and returns a promise
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
router.get('/', (req, res, next) => {
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
router.get('/:id', (req, res, next) => {
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
router.put('/:id', (req, res, next) => {
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
router.delete('/:id', (req, res, next) => {
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

module.exports = router;