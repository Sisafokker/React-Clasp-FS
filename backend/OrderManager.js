const Database = require('./Database');

class OrderManager {
  constructor() {
    this.db = new Database();
    this.table = "orders";
  }

  async getOrders() {
    const GET_QUERY = `SELECT * FROM ${this.table}`;
    return this.db.query(GET_QUERY, false, `GET ${this.table}`);
  }

  async getOrdersByCompanyId(companyId) {
    const GET_QUERY = `SELECT * FROM ${this.table} WHERE companyId = ?`;
    return this.db.query(GET_QUERY, [companyId], `GET ${this.table} for CompanyId`);
  }
  
  async addOrder(companyId, userId, status) {
    const INSERT_QUERY = `INSERT INTO ${this.table} (companyId, userId, status) VALUES (?, ?, ?)`;
    return this.db.query(INSERT_QUERY, [companyId, userId, status], `ADD ${this.table}`);
  }

  async updateOrder(orderId, companyId, userId, status) {
    const UPDATE_QUERY = `UPDATE ${this.table} SET companyId=?, userId=?, status=? WHERE orderId=?`;
    return this.db.query(UPDATE_QUERY, [companyId, userId, status, orderId], `PATCH ${this.table}`);
  }

  async deleteOrder(orderId) {
    const DELETE_QUERY = `DELETE FROM ${this.table} WHERE orderId = ?`;
    return this.db.query(DELETE_QUERY, [orderId], `DELETE ${this.table}`);
  }
}

module.exports = OrderManager;
