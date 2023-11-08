// TO START: node server.js
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') }); // because .env is in root, and server.js is not.
const express = require('express');
const mysql = require('mysql');
const cors = require('cors'); // When your React app running on http://localhost:1234 tries to make a request to your Node.js server running on http://localhost:3001, the browser blocks the request due to CORS policy.
const bodyParser = require('body-parser');
const PORT = process.env.REACT_APP_PORT || 3001;

// Initializes your Express application.
const appExp = express();

// Enable CORS for all routes
appExp.use(cors());

// Use body-parser middleware to parse JSON requests
appExp.use(bodyParser.json());

const pool = mysql.createPool({
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DATABASE
});

// DEFINE API ENDPOINTS // --------------------------------------------------------------------------------------------------
appExp.get('/api/users', (req, res) => {
  pool.query('SELECT * FROM users', (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results);
  });
});

appExp.post('/api/users', (req, res) => {
  const { firstName, lastName, email, password, type } = req.body; // Destructure the parameters from the request body
  const INSERT_USER_QUERY = 'INSERT INTO users (firstName, lastName, email, password, type) VALUES (?, ?, ?, ?, ?)';

  // Validate data & handle errors

  pool.query(INSERT_USER_QUERY, [firstName, lastName, email, password, type], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
    // Handle successful query execution with 'results' object
    return res.status(201).json({ message: 'User added successfully' });
  });
});

appExp.patch('/api/users/:id', (req, res) => {
  const id = req.params.id;
  const { firstName, lastName, email, type, status } = req.body; // Destructure the updated user data from the request body
  const UPDATE_USER_QUERY = 'UPDATE users SET firstName=?, lastName=?, email=?, type=?, status=? WHERE id=?';

  // Validate data & handle errors

  pool.query(UPDATE_USER_QUERY, [firstName, lastName, email, type, status, id], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
    // Handle successful query execution with 'results' object
    return res.status(200).json({ message: 'User updated successfully' });
  });
});

appExp.delete('/api/users/:id', (req, res) => {
  const id = req.params.id;
  const DELETE_USER_QUERY = 'DELETE FROM users WHERE id=?';

  // Validate data & handle errors

  pool.query(DELETE_USER_QUERY, [id], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
    // Handle successful query execution with 'results' object
    return res.status(200).json({ message: 'User deleted successfully' });
  });
});

appExp.get('/api/contacts', (req, res) => {
  pool.query('SELECT * FROM contacts', (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results);
  });
});

appExp.get('/api/companies', (req, res) => {
  pool.query('SELECT * FROM companies', (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results);
  });
});


//Start the Server for specified PORT
appExp.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
