const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
		// we can use the browser's DevTools Network tab to check that, once logged in, every request coming from the front-end 
		// contains an "Authorization" header, with the keyword "Bearer" and a long encoded string, which is the token.
		// So "req.headers.authorization" contains the string "Bearer ourToken", so we split this string when there is a space
		// to separate the two words, then we take req.headers.authorization.split(' ')[1] which contains our token
		// (index 0 contains the first word which is "Bearer", and the index 1 contains the second word which is our token)
		
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
		// jwt.verify() will decode the token, which means return the object we set as a first parameter when we encoded the token
		// when the user logged in (first parameter in jwt.sign()). To decode we have to provide the string we used to encode it,
		// which is the second parameter in sign(), we used: 'RANDOM_TOKEN_SECRET'
		
    const userId = decodedToken.userId;
		// when we encoded it we set the user's id as a parameter of the object we want to encode (first parameter of sign())
		// jwt.sign({ userId: user._id },...,...) so now we extract this userId
		
    if (req.body.userId && req.body.userId !== userId) {
			// First thing is that we see if the request contains a user ID, because not all requests from the front-end will
			// send the userId in the body parameter in fetch(), only when we need to know that it's the right user, like deleting
			// or updating an item.
			// Then we compare it to the one extracted from the token (&& req.body.userId !== userId). 
			// If they are not the same, throw an error.
      throw 'Invalid user ID';
    } else {
			// else the userId is valid, so we move to the next middleware (for example user can delete his items from the store)
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};