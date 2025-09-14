const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

router.get('/', usersController.getAllUsers);
router.get('/register', usersController.showRegisterForm);
router.post('/register', usersController.registerUser);

module.exports = router;