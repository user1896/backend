const express = require('express');
const stuffCtrl = require('../controllers/stuff');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// creating an Express router, instead of registering the routes directly to the app ("app.get", "app.post", etc...).
const router = express.Router();
// Now we'll register them to the Express router and then register that router to the app.

// A POST route that allows the frontend to send data to the backend (ex: users put objects for sell)
router.post('/', auth, stuffCtrl.createThing);

// a POST end point that will handle stored images (it not configured yet)
// router.post('/', auth, multer, stuffCtrl.createThing);
// we passed "multer" as a second middleware. Our "multer" is configured to capture and store single file images in the 
// folder: "images". Lastly we passed the controller "stuffCtrl.createThing", so the image should be already stored in the
// folder "images" by then, the controler will store the path of the image to the database (before we stored its url).

// a "get" API route to "get" data
router.get('/', auth, stuffCtrl.getAllStuff);

// a "get" API route to retrieve only a specific "thing"
router.get('/:id', auth, stuffCtrl.getOneThing);

// a "put" API route to Update an Existing "Thing"
router.put('/:id', auth, stuffCtrl.modifyThing);

// a "delete" API route to delete a "Thing"
router.delete('/:id', auth, stuffCtrl.deleteThing);

module.exports = router;