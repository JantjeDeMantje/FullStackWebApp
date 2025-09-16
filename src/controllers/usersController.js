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

// Show login form
exports.showLoginForm = function (req, res) {
  res.render("login", { error: null });
};

// Handle login
exports.loginUser = function (req, res) {
  const { email, password } = req.body;
  console.log('Login attempt:', email); // Log attempt
  if (!email || !password) {
    console.log('Login failed: missing fields');
    return res.render("login", { error: "Email and password required." });
  }
  // Find user by email
  usersService.fetchUsers(function (err, users) {
    if (err) {
      console.log('Login failed: database error', err);
      return res.render("login", { error: "Database error." });
    }
    const user = users.find(u => u.email === email);
    if (!user) {
      console.log('Login failed: user not found for', email);
      return res.render("login", { error: "Invalid email or password." });
    }
    bcrypt.compare(password, user.password_hash, function (err, result) {
      if (err || !result) {
        console.log('Login failed: password mismatch for', email);
        return res.render("login", { error: "Invalid email or password." });
      }
      // Save user to session
      req.session.user = {
        customer_id: user.customer_id, // <-- use customer_id
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email
      };
      console.log('Login successful for:', email);
      res.redirect("/");
    });
  });
};

// Handle logout
exports.logoutUser = function (req, res) {
  console.log('Logout attempt for:', req.session.user ? req.session.user.email : 'Unknown user');
  req.session.destroy(function (err) {
    if (err) {
      console.log('Logout error:', err);
      return res.status(500).render('error', { title: 'Error', message: 'Logout failed', error: err });
    }
    res.redirect('/');
  });
};

// Show edit form
exports.showEditForm = function (req, res) {
  if (!req.session.user) {
    return res.redirect('/users/login');
  }
  usersService.fetchUserById(req.session.user.customer_id, function (err, users) { // <-- use customer_id
    if (err || !users || !users[0]) {
      return res.status(404).render('error', { title: 'Error', message: 'User not found', error: {} });
    }
    const user = users[0];
    res.render('editUser', { user, error: null });
  });
};

// Handle user update
exports.updateUser = function (req, res) {
  if (!req.session.user) {
    return res.redirect('/users/login');
  }
  const { first_name, last_name, email, password } = req.body;
  console.log('Update attempt:', { first_name, last_name, email });
  if (!first_name || !last_name || !email) {
    return res.render('editUser', { user: req.body, error: "All fields except password are required." });
  }
  function updateUserInDb(password_hash) {
    usersService.updateUser(
      {
        customer_id: req.session.user.customer_id, // <-- use customer_id
        first_name,
        last_name,
        email,
        password_hash
      },
      function (err) {
        if (err) {
          return res.render('editUser', { user: req.body, error: "Error updating user." });
        }
        req.session.user.first_name = first_name;
        req.session.user.last_name = last_name;
        req.session.user.email = email;
        res.redirect('/');
      }
    );
  }
  if (password) {
    require("bcrypt").hash(password, 10, function (err, hash) {
      if (err) {
        return res.render('editUser', { user: req.body, error: "Error hashing password." });
      }
      updateUserInDb(hash);
    });
  } else {
    usersService.fetchUserById(req.session.user.customer_id, function (err, users) { // <-- use customer_id
      if (err || !users || !users[0]) {
        return res.render('editUser', { user: req.body, error: "User not found." });
      }
      updateUserInDb(users[0].password_hash);
    });
  }
};

exports.deleteUser = function (req, res) {
  if (!req.session.user) {
    return res.redirect('/users/login');
  }
  const customer_id = req.session.user.customer_id;
  usersService.deleteUser(customer_id, function (err) {
    if (err) {
      console.log('Delete failed:', err);
      return res.render('editUser', { user: req.session.user, error: "Error deleting user." });
    }
    req.session.destroy(function () {
      res.redirect('/');
    });
  });
};

exports.showRentalHistory = function(req, res) {
  if (!req.session.user) return res.redirect('/users/login');
  usersService.getRentalHistory(req.session.user.customer_id, function(err, rentals) {
    if (err) return res.status(500).render('error', { title: 'Error', message: 'Failed to load rental history', error: err });
    res.render('rentalHistory', { rentals });
  });
};
