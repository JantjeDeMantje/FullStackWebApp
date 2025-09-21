const { defineConfig } = require("cypress");
const mysql = require('mysql2/promise');
require('dotenv').config();

module.exports = {
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      on('task', {
        async createTestUser({ email, passwordHash }) {
          const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
          });
          // Insert with dummy address_id and store_id (1)
          await connection.execute(
            `INSERT INTO customer (first_name, last_name, email, password_hash, address_id, store_id, active, create_date)
             VALUES ('Test', 'User', ?, ?, 1, 1, 1, NOW())`,
            [email, passwordHash]
          );
          await connection.end();
          return null;
        },
        async deleteTestUser(email) {
          const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
          });
          await connection.execute(
            `DELETE FROM customer WHERE email = ?`,
            [email]
          );
          await connection.end();
          return null;
        }
      });
    },
  },
};
