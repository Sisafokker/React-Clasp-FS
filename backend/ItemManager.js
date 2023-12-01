const Database = require('./Database');

class ItemManager {
  constructor() {
    this.db = new Database();
    this.table = "items";
  }

  async getItems() {
    const GET_QUERY = `SELECT * FROM ${this.table}`;
    return this.db.query(GET_QUERY, false, `GET ${this.table}`);
  }

  async addItem(name, description, unitprice_usd, available, userId, itemImage) {
    const INSERT_QUERY = `INSERT INTO ${this.table} (name, description, unitprice_usd, available, userId) VALUES (?, ?, ?, ?, ?, ?)`;
    return this.db.query(INSERT_QUERY, [name, description, unitprice_usd, available, userId, itemImage], `ADD ${this.table}`);
  }

  async updateItem(itemId, name, description, unitprice_usd, available, userId, itemImage) {
    const UPDATE_QUERY = `UPDATE ${this.table} SET name=?, description=?, unitprice_usd=?, available=?, userId=? itemImage=? WHERE itemId=?`;
    return this.db.query(UPDATE_QUERY, [name, description, unitprice_usd, available, userId, itemId, itemImage], `PATCH ${this.table}`);
  }

  async deleteItem(itemId) {
    const DELETE_QUERY = `DELETE FROM ${this.table} WHERE itemId = ?`;
    return this.db.query(DELETE_QUERY, [itemId], `DELETE ${this.table}`);
  }
}

module.exports = ItemManager;
