const express = require('express');
const {
  find,
  findById,
  insert,
  update,
  remove,
  resetDB, // ONLY TESTS USE THIS ONE
} = require('./users/model');

const server = express();

server.use(express.json()); // this allows parsing of JSON request bodies

// set up endpoints
server.get('/api/users', async (req, res) => {
  try {
    const users = await find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get users' });
  }
});

server.get('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const user = await findById(id);
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: 'User does not exist.' });
      }
    } catch (err) {
      res.status(500).json({ message: 'Failed to get user' });
    }
  });  

server.post('/api/users', async (req, res) => {
    const newUser = req.body;
    if (!newUser.name || !newUser.bio) {
      res.status(400).json({ message: 'Please provide name and bio for the user.' });
    } else {
      try {
        const user = await insert(newUser);
        res.status(201).json(user);
      } catch (err) {
        res.status(500).json({ message: 'Failed to create new user' });
      }
    }
  });
  
  server.put('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const changes = req.body;
    if (!changes.name || !changes.bio) {
      res.status(400).json({ message: 'Please provide name and bio for the user.' });
    } else {
      try {
        const user = await update(id, changes);
        if (user) {
          res.json(user);
        } else {
          res.status(404).json({ message: 'User does not exist.' });
        }
      } catch (err) {
        res.status(500).json({ message: 'Failed to update user' });
      }
    }
  });  

server.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const deleted = await remove(id);
      if (deleted) {
        res.json(deleted);
      } else {
        res.status(404).json({ message: 'User does not exist.' });
      }
    } catch (err) {
      res.status(500).json({ message: 'Failed to delete user' });
    }
  });
  

module.exports = server;
