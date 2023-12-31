// backend/UserManager.js
const bcrypt = require('bcrypt');
const Database = require('./Database');

class UserManager {
  constructor() {
    this.db = new Database();
    this.table = "users";
  }

  async hashPassword(password) {
    return bcrypt.hash(password, 10);
  }

  async validateLogin(email, password) {
    try{
      const FIND_QUERY = `SELECT * FROM ${this.table} WHERE email = ?`;
      const users = await this.db.query(FIND_QUERY, [email]);
      if (users.length === 0) {
        throw new Error(`User - ${email} not found`);
      }
      const user = users[0];
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        throw new Error('Password - Invalid credentials');
      }
      return { ...user, password: undefined };
    } catch (error) {
      console.error("validateLogin RESP ERROR: ",error);
      throw error;
    }
  }

  async verifyUser(email) {
    try{
      const FIND_QUERY = `SELECT * FROM ${this.table} WHERE email = ?`;
      const users = await this.db.query(FIND_QUERY, [email]);
      let typeStatus = { email: email}
      if (!users || users.length === 0) {
        typeStatus.type = "usuario";
        typeStatus.status = null;
        typeStatus.id = null;
      } else {
        typeStatus.type = users[0].type
        typeStatus.status = users[0].status
        typeStatus.id = users[0].id
      }
      return typeStatus;
    } catch (error) {
      console.error("verifyUser RESP ERROR: ",error);
      throw error;
    }
  }

  async getUsers() {
    try{
      const GET_QUERY = `SELECT * FROM ${this.table}`;
      return this.db.query(GET_QUERY, false, `GET ${this.table}`);
    } catch (error) {
      console.error("getUsers RESP ERROR: ",error);
      throw error;
    }  
  }

  async addUser(firstName, lastName, email, password, type) {
    const hashedPassword = await this.hashPassword(password || "admin_generated");
    try{
      const INSERT_QUERY = `INSERT INTO ${this.table} (firstName, lastName, email, password, type, status) VALUES (?, ?, ?, ?, 'usuario', 'active')`;
      // needs aditional await on return because 'hashedPassword' has one.
      return await this.db.query(INSERT_QUERY, [firstName, lastName, email, hashedPassword, type], `ADD ${this.table}`);
    } catch (error) {
      console.error("addUser RESP ERROR: ",error);
      throw error;
    }
  }

  async updateUser(id, firstName, lastName, email, type, status) {
    try{
      const UPDATE_QUERY = `UPDATE ${this.table} SET firstName=?, lastName=?, email=?, type=?, status=? WHERE id=?`;
      return this.db.query(UPDATE_QUERY, [firstName, lastName, email, type, status, id], `PATCH ${this.table}`);
    } catch (error) {
      console.error("updateUser RESP ERROR: ",error);
      throw error;
    }
  }

  async resetPassword(id, newPassword) {
    try {
      const hashedPassword = await this.hashPassword(newPassword);
      const UPDATE_QUERY = `UPDATE ${this.table} SET password = ? WHERE id = ?`;
      await this.db.query(UPDATE_QUERY, [hashedPassword, id]);
      return { message: 'Password updated successfully' };
    } catch (error) {
      console.error("resetPassword RESP ERROR: ", error);
      throw error;
    }
  }

  async deleteUser(id) {
    try{
      const DELETE_QUERY = `DELETE FROM ${this.table} WHERE id = ?`;
      return this.db.query(DELETE_QUERY, [id], `DELETE ${this.table}`);
    } catch (error) {
      console.error("deleteUser RESP ERROR: ",error);
      throw error;
    }
  }

}

module.exports = UserManager;
