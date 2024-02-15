const express = require('express');
const Thing = require('../models/thing'); // Import our Mongoose model (Schema)
const stuffCtrl = require('../controllers/stuff');

// creating an Express router, instead of registering the routes directly to the app ("app.get", "app.post", etc...).
const router = express.Router();
// Now we'll register them to the Express router and then register that router to the app.

// A POST route that allows the frontend to send data to the backend (ex: users put objects for sell)
router.post('/', stuffCtrl.createThing);

// a "get" API route to "get" data
router.get('/', stuffCtrl.getAllStuff);

// a "get" API route to retrieve only a specific "thing"
router.get('/:id', stuffCtrl.getOneThing);

// a "put" API route to Update an Existing "Thing"
router.put('/:id', stuffCtrl.modifyThing);

// a "delete" API route to delete a "Thing"
router.delete('/:id', stuffCtrl.deleteThing);

module.exports = router;