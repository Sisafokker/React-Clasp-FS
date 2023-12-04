const mysql = require('mysql');

class Database {
  constructor() {
    /* LOCAL EVERYTHING ⌛⌛DEVELOPMENT ENVIRONMENT⌛⌛*/ 
    // this.pool = mysql.createPool({
    //   host: process.env.SQL_HOST,
    //   user: process.env.SQL_USER,
    //   password: process.env.SQL_PASSWORD,
    //   database: process.env.SQL_DATABASE
    // });

    /* LOCAL BACKEND - CLOUD SQL*/ 
    // this.pool = mysql.createPool({
    // host: process.env.GOOGLE_SQL_DB_HOST_LOCAL_BACKEND,
    // user: process.env.GOOGLE_SQL_USER,
    // password: process.env.GOOGLE_SQL_PASSWORD,
    // database: process.env.GOOGLE_SQL_DATABASE,
    // });


    /* CLOUD BACKEND && CLOUD SQL 🚩🚩USE THESE ONLY WHEN UPDATING CLOUD ENGINE🚩🚩 */ 
    this.pool = mysql.createPool({
    user: process.env.GOOGLE_SQL_USER,
    password: process.env.GOOGLE_SQL_PASSWORD,
    database: process.env.GOOGLE_SQL_DATABASE,
    socketPath: process.env.GOOGLE_SQL_DB_HOST
    });
}

  query(sql, params, tableName) {
    var tableName = tableName || sql;
    return new Promise((resolve, reject) => {
      this.pool.query(sql, params, (error, results) => {
        if (error) {
          console.log(`Error in ${sql}: ${error}`)
          reject(error);
        } else {
          console.log(`Success: ${tableName}`)
          resolve(results);
        }
      });
    });
  }
}

module.exports = Database;
