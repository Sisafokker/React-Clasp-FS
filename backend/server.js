// TO START: node server.js
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') }); // because .env is in root, and server.js is not.
const express = require('express');
const mysql = require('mysql');
const cors = require('cors'); // When your React app running on http://localhost:1234 tries to make a request to your Node.js server running on http://localhost:3001, the browser blocks the request due to CORS policy.
const bodyParser = require('body-parser'); 
const PORT = process.env.REACT_APP_PORT || 3001;

// SQL Tables / Endpoints
const students = 'students';
const professors = 'professors';
const courses = 'courses';

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

// Define API Endpoints
appExp.get(`/api/${students}`, (req, res) => {
  pool.query(`SELECT * FROM ${students}`, (error, results) => {
    if (error) {
      throw error;
    }
    res.json(results);
  });
});

appExp.post(`/api/${students}`, (req, res) => {
  const { students_firstName, students_lastName, students_email } = req.body; // Destructure the parameters from the request body
  const INSERT_STUDENT_QUERY = 'INSERT INTO students (students_firstName, students_lastName, students_email) VALUES (?, ?, ?)';

  // Validate data & handle errors

  pool.query(INSERT_STUDENT_QUERY, [students_firstName, students_lastName, students_email], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
    // Handle successful query execution with 'results' object
    return res.status(201).json({ message: 'Student added successfully' });
  });
});

appExp.patch(`/api/${students}/:id`, (req, res) => {
  const id = req.params.id;
  const { students_firstName, students_lastName, students_email } = req.body; // Destructure the updated user data from the request body
  const UPDATE_STUDENT_QUERY = 'UPDATE students SET students_firstName=?, students_lastName=?, students_email=? WHERE students_id=?';

  // Validate data & handle errors

  pool.query(UPDATE_STUDENT_QUERY, [students_firstName, students_lastName, students_email, id], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
    // Handle successful query execution with 'results' object
    return res.status(200).json({ message: 'Student updated successfully' });
  });
});

appExp.delete(`/api/${students}/:id`, (req, res) => {
  const id = req.params.id;
  const DELETE_STUDENT_QUERY = 'DELETE FROM students WHERE students_id=?';

  // Validate data & handle errors

  pool.query(DELETE_STUDENT_QUERY, [id], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
    // Handle successful query execution with 'results' object
    return res.status(200).json({ message: 'Student deleted successfully' });
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
