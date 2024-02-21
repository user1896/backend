const multer = require('multer'); // "multer" is a file-handling package

// A mime type indicates the nature and format of a document
// The MIME_TYPES constant will allow us to translate a mime type into a file extension.
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// The "diskStorage()" method sets up the destination path and filename for incoming files
const storage = multer.diskStorage({

	// The destination function tells multer Where to save the files.
  destination: (req, file, callback) => {
		// the first argument is to handle errors, and the second argument sets the destination in the "images" folder
    callback(null, 'images');
		// Now we must have a folder in our backend called "images"
  },

	// filename is used to determine what the file should be named inside the folder
  filename: (req, file, callback) => {
		// replacing any spaces with underscores
    const name = file.originalname.split(' ').join('_');

		// we extract the file extension, for ex: if ("file.mimetype" == "image/jpg") then the extension is "jpg".
    const extension = MIME_TYPES[file.mimetype];

		// lastly we put the finale name in the callback, which is 'the name without spaces' + 'the date now' + 'the extension'.
    callback(null, name + Date.now() + '.' + extension);
  }
});

// We pass the "storage" constant to "multer" to configur it, then we export it.
module.exports = multer({storage: storage}).single('image');
// Multer's "single()" method creates middleware which captures single files of the type passed as an argument
// so in our example: single('image') will be handling uploads of single "image" files.

// Now everytime this exported middleware is called (for example in the POST route) he will capture single "image" files
// and store them in the folder "images"