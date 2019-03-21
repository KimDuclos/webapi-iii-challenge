// server requires express 
const express = require('express');
const server = express();

// server using json
server.use(express.json());

// server requires users.js and posts.js
const users = require('./routes/users');
const posts = require('./routes/posts');

// server uses data from users.js and posts.js
server.use('/api/users', users);
server.use('/api/posts', posts);

// server running on port 4000, calls api directory
server.get('/api', (req, res) => {
  res.status(200).json({ message: 'API running on Port 4000' });
});

module.exports = server;