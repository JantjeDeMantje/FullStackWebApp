const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /movies - fetch movies from Sakila DB
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT film_id, title, description, release_year FROM film LIMIT 20');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

module.exports = router;
