const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

router.get('/', usersController.getAllUsers);
router.get('/register', usersController.showRegisterForm);
router.post('/register', usersController.registerUser);
router.get('/login', usersController.showLoginForm);
router.post('/login', usersController.loginUser);
router.get('/logout', usersController.logoutUser);
router.get('/edit', usersController.showEditForm);
router.post('/edit', usersController.updateUser);
router.post('/delete', usersController.deleteUser);
router.get('/rental-history', usersController.showRentalHistory);

router.get('/about', (req, res) => {
  res.render('about');
});

module.exports = router;