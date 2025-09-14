const db = require('../../db');

// Get all users
exports.getUsers = function(callback) {
  db.query('SELECT * FROM user', callback);
};

// Get a user by ID
exports.getUserById = function(id, callback) {
  db.query('SELECT * FROM user WHERE user_id = ?', [id], callback);
};

// Add more user-related DB functions as needed