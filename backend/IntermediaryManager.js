// IntermediaryManager.js
const Database = require('./Database');

class IntermediaryManager {
  constructor() {
    this.db = new Database();
    this.companyUserTable = "intcompanyuser";
    this.orderItemTable = "intorderitem"; 
  }

  // Methods for intCompanyUser
  async getIntCompanyUser() {
    const GET_QUERY = `SELECT * FROM ${this.companyUserTable}`;
    return this.db.query(GET_QUERY, false, `GET ${this.companyUserTable}`);
  }

  async addIntCompanyUser(companyId, userId) {
    const INSERT_QUERY = `INSERT INTO ${this.companyUserTable} (companyId, userId) VALUES (?, ?)`;
    return this.db.query(INSERT_QUERY, [companyId, userId], `ADD ${this.companyUserTable}`);
  }

  async deleteIntCompanyUser(companyId, userId) {
    const DELETE_QUERY = `DELETE FROM ${this.companyUserTable} WHERE companyId = ? AND userId = ?`;
    return this.db.query(DELETE_QUERY, [companyId, userId], `DELETE ${this.companyUserTable}`);
  }

  // Methods for intOrderItem
  async getIntOrderItem() {
    const GET_QUERY = `SELECT * FROM ${this.orderItemTable}`;
    return this.db.query(GET_QUERY, false, `GET ${this.orderItemTable}`);
  }

  async getIntOrderItemsByOrderId(orderId) {
    const GET_QUERY = `SELECT * FROM ${this.orderItemTable} WHERE orderId = ?`;
    return this.db.query(GET_QUERY, [orderId], `GET ${this.orderItemTable} for orderId: ${orderId}`);
  }

  async addIntOrderItem(orderId, itemId, quantity, unitPrice_usd) {
    const INSERT_QUERY = `INSERT INTO ${this.orderItemTable} (orderId, itemId, quantity, unitPrice_usd) VALUES (?, ?, ?, ?)`;
    return this.db.query(INSERT_QUERY, [orderId, itemId, quantity, unitPrice_usd], `ADD ${this.orderItemTable}`);
  }

  async deleteIntOrderItem(orderId, itemId) {
    const DELETE_QUERY = `DELETE FROM ${this.orderItemTable} WHERE orderId = ? AND itemId = ?`;
    return this.db.query(DELETE_QUERY, [orderId, itemId], `DELETE ${this.orderItemTable}`);
  }

}

module.exports = IntermediaryManager;
