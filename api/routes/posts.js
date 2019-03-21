const router = require('express').Router();
const postDB = require('../../data/helpers/postDb');
const userDB = require('../../data/helpers/userDb');

// POST === Crud === check if post contains contents
router.post('/', async (req, res) => {
  let { body: post } = req;
  if (post.text === null) { // send error if provided post doesn't have any contents
    return res.status(400).json({ errorMessage: 'Text is required for post.'});
  }
  try {
    const user = await userDB.getById(id);
    Boolean(user) ? res.status(201).json(await postDB.insert(post)) : 
      // send not found error if the user ID is not in database
      res.status(404).json({ errorMessage: 'User with this ID does not exist.' });
  } catch (error) { // catch all error
    res.status(500).json({ errorMessage: 'User info cannot be retrieved from database' });
  }
});

// GET === cRud
router.get('/', async (req, res) => {
  try {
    const posts = await postDB.get();
    res.status(200).json(posts);  // send OK if post exists
  } catch (error) { // if post doesn't exist
    res.status(500).json({errorMessage: 'Post info could not be retrieved'});
  }
});

router.get('/:id', async (req, res) => {
  const { params: { id } } = req;
  try {
    const post = await postDB.getById(id);
    Boolean(post) ? res.status(200).json(post) : // send not found error and message if post does not exist
        res.status(404).json({ errorMessage: 'Post with this ID does not exist.' });
  } catch (error) {  // catch all error
    res.status(500).json({ errorMessage: 'Post info could not be retrieved' });
  }
});

// PUT === crUd
router.put('/:id', async (req, res) => {
  const {  // requested object
    body: post,
    params: { id } // has parameter of id
  } 
  = req; // 

  if (post.text === null) {
    return res.status(400).json({errorMessage: 'Post requires text.'});
  }
  try {
    const user = await userDB.getById(id);
    // if you get an error, come back and look at this because you don't know if this will work because you never use these
    // see if post exists via ID, if it does retrieve post by ID
    Boolean(user) ? user.id === id ? Boolean(await postDB.update(id, post)) ? res.status(200).json(await postDB.getById(id))
        : res.status(404).json({ errorMessage: 'Post with this ID does not exist.' })
        : res.status(404).json({ errorMessage: 'User with this ID does not exist.' })
        : res.status(401).json({ errorMessage: 'You do not have permission to edit this post.' })
       
  } catch (error) { // catch all error
    res.status(500).json({ errorMessage: 'This post could not be edited'});
  }
});

// DELETE === cruD
router.delete('/:id', async (req, res) => {
  const { params: { id } } = req;
  try {
    const count = await postDB.remove(id); // remove by ID
    // delete if post exists
    Boolean(count) ? res.status(200).json({ message: 'Post has been deleted.' })
    // send not found error if post does not exist
      : res.status(404).json({ message: 'Post with this ID does not exist.' });
  } catch (error) { // catch all error for db issue
    res.status(500).json({
      error: `The post could not be removed; ${error}`
    });
  }
});

module.exports = router;