const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;

const UserManager = require('./UserManager');
const CompanyManager = require('./CompanyManager'); 
const ContactManager = require('./ContactManager'); 
const IntermediaryManager = require('./IntermediaryManager'); 


const appExp = express();
appExp.use(cors());
appExp.use(bodyParser.json());

const userManager = new UserManager();
const companyManager = new CompanyManager();
const contactManager = new ContactManager();
const intermediaryManager = new IntermediaryManager();


// SignUp endpoint
appExp.post('/api/signup', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    await userManager.addUser(firstName, lastName, email, password);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ error: 'SignUp Error: ' + error.message });
  }
});

// Login endpoint
appExp.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userManager.validateLogin(email, password);
    res.status(200).json({ message: 'Logged in successfully', user });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(401).json({ error: 'Login Error: ' + error.message });
  }
});

// Get Users
appExp.get('/api/users', async (req, res) => {
  try {
    const values = await userManager.getUsers();
    res.status(200).json(values);
  } catch (error) {
    console.error('Get Users Error:', error);
    res.status(500).json({ error: 'Get Users Error: ' + error.message });
  }
});

// Add User
appExp.post('/api/users', async (req, res) => {
  const { firstName, lastName, email, password, type } = req.body;
  try {
    await userManager.addUser(firstName, lastName, email, password, type);
    res.status(201).json({ message: 'New user added successfully' });
  } catch (error) {
    console.error('Add User Error:', error);
    res.status(500).json({ error: 'Add User Error: ' + error.message });
  }
});

// Update User
appExp.patch('/api/users/:id', async (req, res) => {
  const id = req.params.id;
  const { firstName, lastName, email, type, status } = req.body;
  try {
    await userManager.updateUser(id, firstName, lastName, email, type, status);
    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Update User Error:', error);
    res.status(500).json({ error: 'Update User Error: ' + error.message });
  }
});

// Delete User
appExp.delete('/api/users/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await userManager.deleteUser(id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete User Error:', error);
    res.status(500).json({ error: 'Delete User Error: ' + error.message });
  }
});

// Get Companies
appExp.get('/api/companies', async (req, res) => {
  try {
    const values = await companyManager.getCompanies();
    res.status(200).json(values);
  } catch (error) {
    console.error('Get Companies Error:', error);
    res.status(500).json({ error: 'Get Companies Error: ' + error.message });
  }
});

// Get Contacts
appExp.get('/api/contacts', async (req, res) => {
  try {
    const values = await contactManager.getContacts();
    res.status(200).json(values);
  } catch (error) {
    console.error('Get Contacts Error:', error);
    res.status(500).json({ error: 'Get Contacts Error: ' + error.message });
  }
});

// Get IntCompanyUser
appExp.get('/api/intCompanyUser', async (req, res) => {
  try {
    const values = await intermediaryManager.getIntCompanyUser();
    res.status(200).json(values);
  } catch (error) {
    console.error('Get IntCompanyUser Error:', error);
    res.status(500).json({ error: 'Get IntCompanyUser Error: ' + error.message });
  }
});

// Add IntCompanyUser relation
appExp.post('/api/intCompanyUser', async (req, res) => {
  try {
    const { companyId, userId } = req.body;
    if (!companyId || !userId) {
      throw new Error('Missing companyId or userId');
    }
    await intermediaryManager.addIntCompanyUser(companyId, userId);
    console.log('intCompanyUser_Post: success');
    res.status(201).json({ message: 'intCompanyUser_Post: success' });
  } catch (error) {
    console.error('Add IntCompanyUser Error:', error);
    res.status(500).json({ error: 'Add IntCompanyUser Error: ' + error.message });
  }
});

// Delete IntCompanyUser relation
appExp.delete('/api/intCompanyUser', async (req, res) => {
  try {
    const { companyId, userId } = req.body;
    if (!companyId || !userId) {
      throw new Error('Missing companyId or userId');
    }
    await intermediaryManager.deleteIntCompanyUser(companyId, userId);
    console.log('intCompanyUser_Delete: Relationship deleted successfully');
    res.status(200).json({ message: 'intCompanyUser_Delete: Relationship deleted successfully' });
  } catch (error) {
    console.error('Delete IntCompanyUser Error:', error);
    res.status(500).json({ error: 'Delete IntCompanyUser Error: ' + error.message });
  }
});

// Start Server
appExp.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
