const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.signup = (req, res, next) => {
	// the second argument in the hash() method below is a number called "salt", the higher the value, the longer the function 
	// will take, but the more secure the hash will be
  bcrypt.hash(req.body.password, 10).then(
    (hash) => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save().then(
        () => {
          res.status(201).json({
            message: 'User added successfully!'
          });
        }
      ).catch(
        (error) => {
          res.status(500).json({
            error: error
          });
        }
      );
    }
  );
};

exports.login = (req, res, next) => {
  // we search for the user in the database by his email
  User.findOne({ email: req.body.email }).then(
    (user) => {
      if (!user) {
        return res.status(401).json({
          error: new Error('User not found!')
        });
      }
      // if the user is found then we compare his hashed password in the database with the entered password
      bcrypt.compare(req.body.password, user.password).then( // first param of "compare" is string, and the second is a hash
        (isValid) => {
          // if password didn't match then we send a 401 status
          if (!isValid) {
            return res.status(401).json({
              error: new Error('Incorrect password!')
            });
          }
          // If we reach this, it means the password is correct, so now we encode a new token for the user
          const token = jwt.sign(
            { userId: user._id },
            'RANDOM_TOKEN_SECRET',
            { expiresIn: '24h' });
          // Now we send back the user id with the token we generated for him, and the status 200 (request was fulfilled)
          res.status(200).json({
            userId: user._id,
            token: token
          });
        }
      ).catch(
        (error) => {
          res.status(500).json({
            error: error
          });
        }
      );
    }
  ).catch(
    (error) => {
      res.status(500).json({
        error: error
      });
    }
  );
}