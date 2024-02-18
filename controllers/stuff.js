const Thing = require('../models/thing');

exports.createThing = (req, res, next) => {
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
};

exports.getAllStuff = (req, res, next) => {
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
}

exports.getOneThing = (req, res, next) => {
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
}

exports.modifyThing = (req, res, next) => {
  // first we search for "Thing" in the database, to see the "_id" of the user who created it.
  Thing.findOne({ _id: req.params.id })
    .then(
      (thing) => {
        // Sometimes when an object existed in the database and then get deleted, if we try to search for him we might get 
        // a result, but that result will be empty, so here we check if "thing" is empty or not.
        if (!thing) {
          return res.status(404).json({
            error: new Error('Objet not Fount !')
          });
        }

        // If the user requesting to update the object is the one who created the object?
        if (req.auth.userId !== thing.userId) {
          return res.status(401).json({
            error: new Error('Unaothorized request !')
          });
        }

        // We confirmed that "thing" is not empty, and "req" is from "thing"'s creator, so now we can update "thing" safely.
        const new_thing = new Thing({
          _id: req.params.id, // the "_id" field can't be modified once the object is created (immutable field), so we provide 
          // the "_id" of the object we want to update when creating the new object.
          title: req.body.title,
          description: req.body.description,
          imageUrl: req.body.imageUrl,
          price: req.body.price,
          userId: req.body.userId
        });
        // "Thing.updateOne" takes an object with the "_id" parameter of the object we want to updaet as a first parameter,and
        // it takes the new object as a second parameter that will replace the existing object, then it returns a Promise.
        Thing.updateOne({_id: req.params.id}, new_thing).then(
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
      }
  ).catch( // The method "findOne()" fails, so the object of "req.params.id" doesn't exist in the database
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
}

exports.deleteThing = (req, res, next) => {
  // first we search for "Thing" in the database, to see the "_id" of the user who created it.
  Thing.findOne({ _id: req.params.id })
    .then(
      (thing) => {
        // Sometimes when an object existed in the database and then get deleted, if we try to search for him we might get 
        // a result, but that result will be empty, so here we check if "thing" is empty or not.
        if (!thing) {
          return res.status(404).json({
            error: new Error('Objet not Fount !')
          });
        }

        // If the user requesting to delete the object is the one who created the object?
        if (req.auth.userId !== thing.userId) {
          return res.status(401).json({
            error: new Error('Unaothorized request !')
          });
        }

        // We confirmed that "thing" is not empty, and "req" is from "thing"'s creator, so now we can delete "thing" safely.
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
      }
  ).catch( // The method "findOne()" fails, so the object of "req.params.id" doesn't exist in the database
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};