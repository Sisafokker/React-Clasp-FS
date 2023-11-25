const Database = require('./Database');
class IntermediaryManager {
  constructor() {
    this.db = new Database();
    this.table = "intcompanyuser";
  }

  async getIntCompanyUser() {
    const GET_QUERY = `SELECT * FROM ${this.table}`;
    return this.db.query(GET_QUERY, false, `GET ${this.table}`);
  }

  async addIntCompanyUser(companyId, userId) {
    const INSERT_QUERY = `INSERT INTO ${this.table} (companyId, userId) VALUES (?, ?)`;
    return this.db.query(INSERT_QUERY, [companyId, userId], `ADD ${this.table}`);
  }

  async deleteIntCompanyUser(companyId, userId) {
    const DELETE_QUERY = `DELETE FROM ${this.table} WHERE companyId = ? AND userId = ?`;
    return this.db.query(DELETE_QUERY, [companyId, userId], `DELETE ${this.table}`);
  }

  
}

module.exports = IntermediaryManager;