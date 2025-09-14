const usersDao = require('../dao/usersDao');

// Fetch all users
exports.fetchUsers = function(callback) {
  usersDao.getUsers(callback);
};

// Fetch a user by ID
exports.fetchUserById = function(id, callback) {
  usersDao.getUserById(id, callback);
};

exports.createUser = function(user, callback) {
  usersDao.createUser(user, callback);
};