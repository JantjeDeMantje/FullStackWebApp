// Users Controller
const usersService = require('../services/usersService');

exports.getAllUsers = function(req, res) {
  usersService.fetchUsers(function(err, users) {
    if (err) {
      return res.status(500).send('Database error: ' + err.message);
    }
    res.json(users);
  });
};