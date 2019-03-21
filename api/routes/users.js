
const router = require('express').Router();
// calling data from user userDb.js
const userDB = require('../../data/helpers/userDb');


// Middleware to check name status
function checkUserNameCase(req, res, next) {
  req.body.name = req.body.name.toUpperCase(); // set username input to uppercase
  next();
}

// endpoints for users

// POST ==== Crud 
// checks for name
router.post('/', checkUserNameCase, async (req, res) => {
  let { body: user } = req;

  if (!user.name) { // user did not provide a user name
    return res.status(400).json({ errorMessage: 'Please provide a user name.'});
  }
  try {
    user = await userDB.insert(user);  // create new user if input is correct
    res.status(201).json(user); // created user
  } catch (error) { // catch all error message
    res.status(500).json({errorMessage: 'Could not save user to database.'});
  }
});


// GET === cRud
router.get('/', async (req, res) => {
  try {
    const users = await userDB.get(); // get user from database
    res.status(200).json(users); // OK
  } catch (error) { // catch all error
    res.status(500).json({ errorMessage: 'User info cannot be retrieved from database.'});
  }
});

// GET user by ID
router.get('/:id', async (req, res) => {
  const { params: { id } } = req;
  try {
    const user = await userDB.getById(id);
    // if user exists give OK, else send error
    Boolean(user) ? res.status(200).json({ user, posts: await userDB.getUserPosts(id) })
      : res.status(404).json({ errormessage: 'User with this ID does not exist.' });
  } catch (error) { // catch all error
    res.status(500).json({ errorMessage: 'User info cannot be retrieved from database.'});
  }
});

// PUT ==== crUd
router.put('/:id', checkUserNameCase, async (req, res) => {
  const {  // request data set to object/variable
    body: user,
    params: { id }
  } = req;
  if (!user.name) { // no user name provided, send error
    return res.status(400).json({ errorMessage: 'Please provide a user name.'});
  }
  try {
    const count = await userDB.update(id, user);
    // send not found error if user ID does not exist
    Boolean(count) ? res.status(200).json(await userDB.getById(id)) : 
      res.status(404).json({ errorMessage: 'User with this ID does not exist.' });
  } catch (error) { // catch all error
    res.status(500).json({ errorMessage: 'Could not modify user info.'});
  }
});

// DELETE ==== cruD
router.delete('/:id', async (req, res) => {
  const { params: { id } } = req;
  try {
    const count = await userDB.remove(id);
    Boolean(count) // send OK if deletion is success, send not found if user with ID does not exist
      ? res.status(200).json({ message: 'User deleted.', id })
      : res.status(404).json({ errorMessage: 'User with this ID does not exist.' });
  } catch (error) {
    res.status(500).json({ errorMessage: 'User could not be deleted.' });
  }
});

module.exports = router;