const Database = require('./Database');

class ContactManager {
  constructor() {
    this.db = new Database();
    this.table = "contacts";
  }
  
  async getContacts() {
    const GET_QUERY = `SELECT * FROM ${this.table}`;
    return this.db.query(GET_QUERY, false, `GET ${this.table}`);
  }

  async addContact(companyId, firstName, lastName, phone, email, division, position, createdBy, updatedBy) {
    const INSERT_QUERY = `INSERT INTO ${this.table} (companyId, firstName, lastName, phone, email, division, position, createdAt, updatedAt, createdBy, updatedBy) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?, ?)`;
    return this.db.query(INSERT_QUERY, [companyId, firstName, lastName, phone, email, division, position, createdBy, updatedBy], `ADD ${this.table}`);
  }

  async updateContact(contactId, companyId, firstName, lastName, phone, email, division, position, updatedBy) {
    const UPDATE_QUERY = `UPDATE ${this.table} SET companyId=?, firstName=?, lastName=?, phone=?, email=?, division=?, position=?, updatedAt=NOW(), updatedBy=? WHERE contactId=?`;
    return this.db.query(UPDATE_QUERY, [companyId, firstName, lastName, phone, email, division, position, updatedBy, contactId], `PATCH ${this.table}`);
  }

  async deleteContact(contactId) {
    const DELETE_QUERY = `DELETE FROM ${this.table} WHERE contactId = ?`;
    return this.db.query(DELETE_QUERY, [contactId], `DELETE ${this.table}`);
  }

}

module.exports = ContactManager;
