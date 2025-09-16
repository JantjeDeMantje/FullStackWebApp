const db = require('../../db');

// Get all users
exports.getUsers = function(callback) {
  db.query('SELECT * FROM customer', callback);
};

// Get a user by ID
exports.getUserById = function(id, callback) {
  db.query('SELECT * FROM customer WHERE customer_id = ?', [id], callback);
};

// Create a new user with dummy address_id and store_id
exports.createUser = function(user, callback) {
  const sql = `
    INSERT INTO customer (first_name, last_name, email, password_hash, address_id, store_id, active, create_date)
    VALUES (?, ?, ?, ?, ?, ?, 1, NOW())
  `;
  db.query(sql, [
    user.first_name,
    user.last_name,
    user.email,
    user.password,
    user.address_id,
    user.store_id
  ], callback);
};

exports.updateUser = function(user, callback) {
  const sql = `
    UPDATE customer
    SET first_name = ?, last_name = ?, email = ?, password_hash = ?
    WHERE customer_id = ?
  `;
  db.query(sql, [
    user.first_name,
    user.last_name,
    user.email,
    user.password_hash,
    user.customer_id // <-- use customer_id
  ], callback);
};

exports.deleteUser = function(id, callback) {
  db.query('DELETE FROM customer WHERE customer_id = ?', [id], callback);
};

exports.getRentalHistory = function(customerId, callback) {
  const sql = `
    SELECT r.rental_id, r.rental_date, r.return_date, f.title, f.film_id, s.store_id
    FROM rental r
    JOIN inventory i ON r.inventory_id = i.inventory_id
    JOIN film f ON i.film_id = f.film_id
    JOIN store s ON i.store_id = s.store_id
    WHERE r.customer_id = ?
    ORDER BY r.rental_date DESC
  `;
  db.query(sql, [customerId], callback);
};
