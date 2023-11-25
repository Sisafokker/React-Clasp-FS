const Database = require('./Database');

class CompanyManager {
  constructor() {
    this.db = new Database();
    this.table = "companies";
  }

  async getCompanies() {
    const GET_QUERY = `SELECT * FROM ${this.table}`;
    return this.db.query(GET_QUERY, false, `GET ${this.table}`);
  }

  async addCompany(companyName, companyAddress, state, country, industry, status, createdBy, updatedBy) {
    const INSERT_QUERY = `INSERT INTO ${this.table} (companyName, companyAddress, state, country, industry, status, createdBy, updatedBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    return this.db.query(INSERT_QUERY, [companyName, companyAddress, state, country, industry, status, createdBy, updatedBy], `ADD ${this.table}`);
  }

  async updateCompany(companyId, companyName, companyAddress, state, country, industry, status, updatedBy) {
    const UPDATE_QUERY = `UPDATE ${this.table} SET companyName=?, companyAddress=?, state=?, country=?, industry=?, status=?, updatedBy=? WHERE companyId=?`;
    return this.db.query(UPDATE_QUERY, [companyName, companyAddress, state, country, industry, status, updatedBy, companyId], `PATCH ${this.table}`);
  }

  async deleteCompany(companyId) {
    const DELETE_QUERY = `DELETE FROM ${this.table} WHERE companyId = ?`;
    return this.db.query(DELETE_QUERY, [companyId]), `DELETE ${this.table}`;
  }

}

module.exports = CompanyManager;
