const db = require('../../db');

// Fetch all users
exports.fetchUsers = function(callback) {
  db.query('SELECT * FROM user', function(err, results) {
    callback(err, results);
  });
};