// filepath: c:\Users\Admin\Documents\Programmeren\FullStackWebApp\FullStackWebApp\db.js
require('dotenv').config({ quiet: true });
const mysql = require('mysql2');
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false
  }
});
module.exports = pool;
