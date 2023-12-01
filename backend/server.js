const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;

const appExp = express();
appExp.use(cors());
appExp.use(bodyParser.json());

const UserManager = require('./UserManager');
const CompanyManager = require('./CompanyManager'); 
const ContactManager = require('./ContactManager'); 
const OrderManager = require('./OrderManager'); 
const ItemManager = require('./ItemManager'); 
const IntermediaryManager = require('./IntermediaryManager'); 

const userManager = new UserManager();
const companyManager = new CompanyManager();
const contactManager = new ContactManager();
const orderManager = new OrderManager();
const itemManager = new ItemManager();
const intermediaryManager = new IntermediaryManager();

// SignUp endpoint
appExp.post('/api/signup', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    await userManager.addUser(firstName, lastName, email, password);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('❌Signup Error:', error);
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
    console.error('❌Login Error:', error);
    res.status(401).json({ error: 'Login Error: ' + error.message });
  }
});

// Verify Type & Status
appExp.post('/api/verifyUser', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await userManager.verifyUser(email);
    res.status(200).json({ message: 'User Verified Successfully', user });
  } catch (error) {
    console.error('❌Login Error:', error);
    res.status(401).json({ error: 'User Verification Error: ' + error.message });
  }
});

// Get Users
appExp.get('/api/users', async (req, res) => {
  try {
    const values = await userManager.getUsers();
    res.status(200).json(values);
  } catch (error) {
    console.error('❌Get Users Error:', error);
    res.status(500).json({ error: 'Get Users Error: ' + error.message });
  }
});

// Add User
appExp.post('/api/users', async (req, res) => {
  const { firstName, lastName, email, password, type } = req.body;
  try {
    const values = await userManager.addUser(firstName, lastName, email, password, type);
    const userId = values.insertId;
    res.status(201).json({ message: 'New user added successfully', id: userId });
  } catch (error) {
    console.error('❌Add User Error:', error);
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
    console.error('❌Update User Error:', error);
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
    console.error('❌Delete User Error:', error);
    res.status(500).json({ error: 'Delete User Error: ' + error.message });
  }
});

// Get Companies
appExp.get('/api/companies', async (req, res) => {
  try {
    let values = await companyManager.getCompanies();
    values = sortArrayByProperty(values, 'companyName', true);
    res.status(200).json(values);
  } catch (error) {
    console.error('❌Get Companies Error:', error);
    res.status(500).json({ error: 'Get Companies Error: ' + error.message });
  }
});

// Get Contacts
appExp.get('/api/contacts', async (req, res) => {
  try {
    let values = await contactManager.getContacts();
    values = sortArrayByProperty(values, 'lastName', true);
    res.status(200).json(values);
  } catch (error) {
    console.error('❌Get Contacts Error:', error);
    res.status(500).json({ error: 'Get Contacts Error: ' + error.message });
  }
});


// Get All Orders 📦
appExp.get('/api/orders', async (req, res) => {
  try {
    let values = await orderManager.getOrders();
    values = sortArrayByProperty(values, 'orderDate', false);
    res.status(200).json(values);
  } catch (error) {
    console.error('❌Get Orders Error:', error);
    res.status(500).json({ error: 'Get Orders Error: ' + error.message });
  }
});

// Get Orders for Specific Company
appExp.get('/api/orders/company/:companyId', async (req, res) => {
  const companyId = req.params.companyId;
  try {
    const values = await orderManager.getOrdersByCompanyId(companyId);
    res.status(200).json(values);
  } catch (error) {
    console.error(`❌Get Orders for Company ${companyId} Error:`, error);
    res.status(500).json({ error: `Get Orders for Company ${companyId} Error: ` + error.message });
  }
});

// Add Order 📦
appExp.post('/api/orders', async (req, res) => {
  const { companyId, userId, status } = req.body;
  try {
    await orderManager.addOrder(companyId, userId, status);
    res.status(201).json({ message: 'New order added successfully' });
  } catch (error) {
    console.error('❌Add Order Error:', error);
    res.status(500).json({ error: 'Add Order Error: ' + error.message });
  }
});

// Update Order 📦
appExp.patch('/api/orders/:orderId', async (req, res) => {
  const orderId = req.params.orderId;
  const { companyId, userId, status } = req.body;
  try {
    await orderManager.updateOrder(orderId, companyId, userId, status);
    res.status(200).json({ message: 'Order updated successfully' });
  } catch (error) {
    console.error('❌Update Order Error:', error);
    res.status(500).json({ error: 'Update Order Error: ' + error.message });
  }
});

// Delete Order 📦
appExp.delete('/api/orders/:orderId', async (req, res) => {
  const orderId = req.params.orderId;
  try {
    await orderManager.deleteOrder(orderId);
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('❌Delete Order Error:', error);
    res.status(500).json({ error: 'Delete Order Error: ' + error.message });
  }
});

// Get Items 🍸
appExp.get('/api/items', async (req, res) => {
  try {
    const values = await itemManager.getItems();
    res.status(200).json(values);
  } catch (error) {
    console.error('❌Get Items Error:', error);
    res.status(500).json({ error: 'Get Items Error: ' + error.message });
  }
});

// Add Item 🍸
appExp.post('/api/items', async (req, res) => {
  const { name, description, unitprice_usd, available, userId } = req.body;
  try {
    await itemManager.addItem(name, description, unitprice_usd, available, userId);
    res.status(201).json({ message: 'New item added successfully' });
  } catch (error) {
    console.error('❌Add Item Error:', error);
    res.status(500).json({ error: 'Add Item Error: ' + error.message });
  }
});

// Update Item 🍸
appExp.patch('/api/items/:itemId', async (req, res) => {
  const itemId = req.params.itemId;
  const { name, description, unitprice_usd, available, userId } = req.body;
  try {
    await itemManager.updateItem(itemId, name, description, unitprice_usd, available, userId); 
    res.status(200).json({ message: 'Item updated successfully' });
  } catch (error) {
    console.error('❌Update Item Error:', error);
    res.status(500).json({ error: 'Update Item Error: ' + error.message });
  }
});

// Delete Item 🍸
appExp.delete('/api/items/:itemId', async (req, res) => {
  const itemId = req.params.itemId;
  try {
    await itemManager.deleteItem(itemId); // Implement deleteItem in your itemManager
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('❌Delete Item Error:', error);
    res.status(500).json({ error: 'Delete Item Error: ' + error.message });
  }
});

// Get IntCompanyUser
appExp.get('/api/intCompanyUser', async (req, res) => {
  try {
    const values = await intermediaryManager.getIntCompanyUser();
    res.status(200).json(values);
  } catch (error) {
    console.error('❌Get IntCompanyUser Error:', error);
    res.status(500).json({ error: 'Get IntCompanyUser Error: ' + error.message });
  }
});

// Add IntCompanyUser relation
appExp.post('/api/intCompanyUser', async (req, res) => {
  try {
    const { companyId, userId } = req.body;
    if (!companyId && !userId ) {
      throw new Error('Missing both companyId & userId');
    } else if (!companyId) {
      throw new Error('Missing companyId');
    } else if( !userId) {
      throw new Error('Missing userId');
    }
    await intermediaryManager.addIntCompanyUser(companyId, userId);
    console.log('intCompanyUser_Post: success');
    res.status(201).json({ message: 'intCompanyUser_Post: success' });
  } catch (error) {
    console.error('❌Add IntCompanyUser Error:', error);
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
    console.error('❌Delete IntCompanyUser Error:', error);
    res.status(500).json({ error: 'Delete IntCompanyUser Error: ' + error.message });
  }
});

// Get IntOrderItem
appExp.get('/api/intOrderItem', async (req, res) => {
  try {
    const values = await intermediaryManager.getIntOrderItem();
    res.status(200).json(values);
  } catch (error) {
    console.error('❌Get IntOrderItem Error:', error);
    res.status(500).json({ error: 'Get IntOrderItem Error: ' + error.message });
  }
});

// Get IntOrderItem by orderId
appExp.get('/api/intOrderItem/:orderId', async (req, res) => {
  const orderId = req.params.orderId;
  try {
    const values = await intermediaryManager.getIntOrderItemsByOrderId(orderId);
    res.status(200).json(values);
  } catch (error) {
    console.error(`❌Get IntOrderItem by orderId ${orderId} Error:`, error);
    res.status(500).json({ error: `IntOrderItem by orderId ${orderId} Error: ` + error.message });
  }
});

// Add IntOrderItem relation
appExp.post('/api/intOrderItem', async (req, res) => {
  try {
    const { orderId, itemId } = req.body;
    if (!orderId || !itemId) {
      throw new Error('❌Missing orderId or itemId');
    }
    await intermediaryManager.addIntOrderItem(orderId, itemId);
    console.log('intOrderItem_Post: success');
    res.status(201).json({ message: 'intOrderItem_Post: success' });
  } catch (error) {
    console.error('❌Add IntOrderItem Error:', error);
    res.status(500).json({ error: 'Add IntOrderItem Error: ' + error.message });
  }
});

// Delete IntOrderItem relation
appExp.delete('/api/intOrderItem', async (req, res) => {
  try {
    const { orderId, itemId } = req.body;
    if (!orderId || !itemId) {
      throw new Error('Missing orderId or itemId');
    }
    await intermediaryManager.deleteIntOrderItem(orderId, itemId);
    console.log('intOrderItem_Delete: Relationship deleted successfully');
    res.status(200).json({ message: 'intOrderItem_Delete: Relationship deleted successfully' });
  } catch (error) {
    console.error('❌Delete IntOrderItem Error:', error);
    res.status(500).json({ error: 'Delete IntOrderItem Error: ' + error.message });
  }
});



// Start Server
appExp.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// Helper function for Sorting an ArrayOfObjects
const sortArrayByProperty = (array, property, isAscending = true) => {
  return array.sort((a, b) => {
    if (a[property] < b[property]) {
      return isAscending ? -1 : 1;
    }
    if (a[property] > b[property]) {
      return isAscending ? 1 : -1;
    }
    return 0;
  });
};