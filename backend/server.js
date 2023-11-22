// TO START: node server.js
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });  // .env backend
const express = require('express');
const mysql = require('mysql');
const cors = require('cors'); // When your React app running on http://localhost:1234 tries to make a request to your Node.js server running on http://localhost:3001, the browser blocks the request due to CORS policy.
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const PORT = process.env.PORT || 5000;

// Initializes your Express application
const appExp = express();

// Enable CORS for all routes
appExp.use(cors());

// Use body-parser middleware to parse JSON requests
appExp.use(bodyParser.json());

/* LOCAL EVERYTHING ⌛⌛DEVELOPMENT ENVIRONMENT⌛⌛*/ 
const pool = mysql.createPool({
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DATABASE
});

/* LOCAL BACKEND - CLOUD SQL*/ 
// const pool = mysql.createPool({
//   host: process.env.GOOGLE_SQL_DB_HOST_LOCAL_BACKEND,
//   user: process.env.GOOGLE_SQL_USER,
//   password: process.env.GOOGLE_SQL_PASSWORD,
//   database: process.env.GOOGLE_SQL_DATABASE,
// });


/* CLOUD BACKEND && CLOUD SQL 🚩🚩USE THESE ONLY WHEN UPDATING CLOUD ENGINE🚩🚩 */ 
// const pool = mysql.createPool({
//   user: process.env.GOOGLE_SQL_USER,
//   password: process.env.GOOGLE_SQL_PASSWORD,
//   database: process.env.GOOGLE_SQL_DATABASE,
//   socketPath: process.env.GOOGLE_SQL_DB_HOST
// });

// DEFINE API ENDPOINTS // --------------------------------------------------------------------------------------------------
// SignUp
appExp.post('/api/signup', async (req, res) => {
  const { firstName, lastName, email, password} = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const INSERT_USER_QUERY = 'INSERT INTO users (firstName, lastName, email, password, type, status) VALUES (?, ?, ?, ?, ? ,?)';

  pool.query(INSERT_USER_QUERY, [firstName, lastName, email, hashedPassword, 'usuario', 'active'], (error, results) => {
    if (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: '❌ Email already registered' });
      }
      console.error("SignUp Error", error);
      return res.status(500).json({ error: '❌ SignUp Error: Internal server error' });
    }
    const user = {};
    return res.status(201).json({ 
      message: 'User registered successfully', 
      user: { firstName: firstName, lastName: lastName, email: email , password: undefined }  
    });
  });
});

// Login
appExp.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  const FIND_USER_QUERY = 'SELECT * FROM users WHERE email = ?';

  pool.query(FIND_USER_QUERY, [email], async (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: '❌ Login Error: Internal server error' });
    }
    if (results.length === 0) {
      return res.status(401).json({ error: '❌ Login Error: User not found' });
    }

    const user = results[0];
    console.log("Usuario: ",user)

    // Check passwords
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      return res.status(200).json({ message: '👍 Logged in successfully', user: { ...user, password: undefined } });
    } else {
      return res.status(401).json({ error: '❌ Invalid credentials' });
    }
  });
});


appExp.get('/api/users', (req, res) => {
  pool.query('SELECT * FROM users', (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results);
  });
});

appExp.post('/api/users', async (req, res) => {
  const { firstName, lastName, email, password, type } = req.body; // Destructure from the request body
  const hashedPassword = await bcrypt.hash("app_generated", 10);
  const INSERT_USER_QUERY = 'INSERT INTO users (firstName, lastName, email, password, type) VALUES (?, ?, ?, ?, ?)';

  // Validate data & handle errors

  pool.query(INSERT_USER_QUERY, [firstName, lastName, email, hashedPassword, type], (error, results) => {
    logDbConnectionStatus(error)
    if (error) {
      console.error('users_Post:', error);
      return res.status(500).json({ error: 'users_Post: Internal server error' });
    }
    console.log("users Post Results: ", results)
    console.log("Result id: ",results.insertId)
    return res.status(201).json({ message: 'users_Post: success', id: results.insertId});
  });
});

appExp.patch('/api/users/:id', (req, res) => {
  const id = req.params.id;
  const { firstName, lastName, email, type, status } = req.body;
  const UPDATE_USER_QUERY = 'UPDATE users SET firstName=?, lastName=?, email=?, type=?, status=? WHERE id=?';

  // Validate data & handle errors

  pool.query(UPDATE_USER_QUERY, [firstName, lastName, email, type, status, id], (error, results) => {
    logDbConnectionStatus(error)
    if (error) {
      console.error('users_Patch:', error);
      return res.status(500).json({ error: 'users_Patch: Internal server error' });
    }
    return res.status(200).json({ message: 'users_Patch: success!' });
  });
});

appExp.delete('/api/users/:id', (req, res) => {
  const id = req.params.id;
  const DELETE_USER_QUERY = 'DELETE FROM users WHERE id=?';

  // Validate data & handle errors

  pool.query(DELETE_USER_QUERY, [id], (error, results) => {
    logDbConnectionStatus(error)
    if (error) {
      console.error('users_Delete:', error);
      return res.status(500).json({ error: 'users_Delete: Internal server error' });
    }
    return res.status(200).json({ message: 'users_Delete: success' });
  });
});

appExp.get('/api/contacts', (req, res) => {
  pool.query('SELECT * FROM contacts', (error, results) => {
    logDbConnectionStatus(error)
    if (error) {
      throw error;
    }
    res.status(200).json(results);
  });
});

appExp.get('/api/companies', (req, res) => {
  pool.query('SELECT * FROM companies', (error, results) => {
    logDbConnectionStatus(error)
    if (error) {
      throw error;
    }
    res.status(200).json(results);
  });
});


/*Intermediary Tables:
Many-To-Many: No need for a rowId. The combo of two foreign keys (companyId & userId) serves as a primary key. 
This composite key identifies each row and ensures that the same combo of company & user will not be added more than once.
In this scenario, you do not PATCH rows, you just delete it and set a new one with the new relationship.
*/

appExp.get('/api/intCompanyUser', (req, res) => {
  pool.query('SELECT * FROM intCompanyUser', (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results);
  });
});


appExp.post('/api/intCompanyUser', (req, res) => {
  console.log("Adding to intCompanyUser...")
  const { companyId , userId } = req.body; 
  if (!companyId || !userId) {
    return res.status(400).json({ error: 'intCompanyUser_Post: Missing companyId or userId' });
  }
  const INSERT_USER_QUERY = 'INSERT INTO intCompanyUser (companyId , userId ) VALUES (?, ?)';

  pool.query(INSERT_USER_QUERY, [companyId , userId], (error, results) => {
    logDbConnectionStatus(error)
    if (error) {
      console.error('intCompanyUser_Post:', error);
      return res.status(500).json({ error: 'intCompanyUser_Post: Internal server error' });
    }
    console.log('intCompanyUser_Post: success')
    return res.status(201).json({ message: 'intCompanyUser_Post: success' });
  });
});

appExp.delete('/api/intCompanyUser', (req, res) => {
  const { companyId, userId } = req.body;
  if (!companyId || !userId) {
      return res.status(400).json({ error: 'intCompanyUser_Delete: Missing companyId or userId' });
  }
  const DELETE_RELATIONSHIP_QUERY = 'DELETE FROM intCompanyUser WHERE companyId = ? AND userId = ?';

  pool.query(DELETE_RELATIONSHIP_QUERY, [companyId, userId], (error, results) => {
      if (error) {
          console.error('Deleted intCompanyUser:', error);
          return res.status(500).json({ error: 'intCompanyUser_Delete: Internal server error' });
      }
      return res.status(200).json({ message: 'intCompanyUser_Delete: Relationship deleted successfully' });
  });
});



//Start the Server for specified PORT
appExp.listen(PORT, () => {
  console.log(`Connection_AppEngine: 👍 - Server is running on port ${PORT}`);
});


// Helper to log SQL_DB connection status
function logDbConnectionStatus(error) {
  if (error) {
    console.log(`Connection_CloudSQL: ❌ - Error: ${error.message}`);
    console.log(`Connection_CloudSQL: ❌ - Using: ${process.env.GOOGLE_SQL_DB_HOST}`);
  } else {
    console.log('Connection_CloudSQL: 👍');
  }
}