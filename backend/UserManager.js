const bcrypt = require('bcrypt');
const Database = require('./Database'); // Same dir.

class UserManager {
  constructor() {
    this.db = new Database();
    this.table = "users";
  }

  async hashPassword(password) {
    return bcrypt.hash(password, 10);
  }

  async validateLogin(email, password) {
    const FIND_QUERY = `SELECT * FROM ${this.table} WHERE email = ?`;
    const users = await this.db.query(FIND_QUERY, [email]);
    if (users.length === 0) {
      throw new Error('User not found');
    }
    const user = users[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new Error('Invalid credentials');
    }
    return { ...user, password: undefined };
  }

  async getUsers() {
    const GET_USERS_QUERY = `SELECT * FROM ${this.table}`;
    return this.db.query(GET_USERS_QUERY, false, `GET ${this.table}`);
  }

  async addUser(firstName, lastName, email, password) {
    const hashedPassword = await this.hashPassword(password);
    const INSERT_QUERY = `INSERT INTO ${this.table} (firstName, lastName, email, password, type, status) VALUES (?, ?, ?, ?, 'usuario', 'active')`;
    return this.db.query(INSERT_QUERY, [firstName, lastName, email, hashedPassword], `ADD ${this.table}`);
  }

  async updateUser(id, firstName, lastName, email, type, status) {
    const UPDATE_QUERY = `UPDATE ${this.table} SET firstName=?, lastName=?, email=?, type=?, status=? WHERE id=?`;
    return this.db.query(UPDATE_QUERY, [firstName, lastName, email, type, status, id], `PATCH ${this.table}`);
  }

  async deleteUser(id) {
    const DELETE_QUERY = `DELETE FROM ${this.table} WHERE id = ?`;
    return this.db.query(DELETE_QUERY, [id], `DELETE ${this.table}`);
  }

}

module.exports = UserManager;
