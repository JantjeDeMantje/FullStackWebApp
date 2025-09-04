const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost', // Change if your DB is remote
  user: 'root',      // Your MySQL username
  password: 'Inferno2004',      // Your MySQL password
  database: 'sakila',// Sakila database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool.promise();
