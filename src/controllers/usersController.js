// Users Controller
const usersService = require("../services/usersService");
const bcrypt = require("bcrypt");

exports.getAllUsers = function (req, res) {
  usersService.fetchUsers(function (err, users) {
    if (err) {
      return res.status(500).send("Database error: " + err.message);
    }
    res.json(users);
  });
};

// Show registration form
exports.showRegisterForm = function (req, res) {
  res.render("register");
};

// Handle registration
exports.registerUser = function (req, res) {
  const { first_name, last_name, email, password } = req.body;
  console.log('Registration attempt:', { first_name, last_name, email }); // Log attempt

  if (!first_name || !last_name || !email || !password) {
    console.log('Registration failed: missing fields');
    return res.render("register", { error: "All fields are required." });
  }
  // Hash password
  bcrypt.hash(password, 10, function (err, hash) {
    if (err) {
      console.log('Registration failed: error hashing password', err);
      return res.render("register", { error: "Error hashing password." });
    }
    // Use dummy address_id and store_id (e.g., 1)
    usersService.createUser(
      {
        first_name,
        last_name,
        email,
        password: hash,
        address_id: 1,
        store_id: 1,
      },
      function (err) {
        if (err) {
          console.log('Registration failed: error inserting user', err);
          return res.render("register", { error: "Error registering user." });
        }
        console.log('Registration successful for:', email);
        res.redirect("/login");
      }
    );
  });
};
