// TO START: node server.js
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') }); // because .env is in root, and server.js is not.

const express = require('express');
const mysql = require('mysql');
const cors = require('cors'); // When your React app running on http://localhost:1234 tries to make a request to your Node.js server running on http://localhost:3001, the browser blocks the request due to CORS policy.
const PORT = process.env.REACT_APP_PORT || 3001;

// SQL Tables / Endpoints
const students = 'students';
const professors = 'professors';
const courses = 'courses';

// Initializes your Express application.
const appExp = express(); 

// Enable CORS for all routes
appExp.use(cors()); 

const pool = mysql.createPool({
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DATABASE
});

// Define API Endpoints
appExp.get(`/api/${students}`, (req, res) => {
  pool.query(`SELECT * FROM ${students}`, (error, results) => {
    if (error) {
      throw error;
    }
    res.json(results);
  });
});

appExp.get(`/api/${professors}`, (req, res) => {
  pool.query(`SELECT * FROM ${professors}`, (error, results) => {
    if (error) {
      throw error;
    }
    res.json(results);
  });
});

appExp.get(`/api/${courses}`, (req, res) => {
  pool.query(`SELECT * FROM ${courses}`, (error, results) => {
    if (error) {
      throw error;
    }
    res.json(results);
  });
});

//Start the Server for specified PORT
appExp.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
