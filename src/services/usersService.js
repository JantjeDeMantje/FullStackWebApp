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

exports.updateUser = function(user, callback) {
  usersDao.updateUser(user, callback);
};

exports.deleteUser = function(id, callback) {
  usersDao.deleteUser(id, callback);
};

exports.getRentalHistory = function(customerId, callback) {
  usersDao.getRentalHistory(customerId, callback);
};