var express = require('express');
var router = express.Router();

/* GET home page. */
const db = require('../db');

router.get('/', async function(req, res, next) {
  try {
    const [movies] = await db.query('SELECT film_id, title, description, release_year FROM film LIMIT 20');
    res.render('index', { movies, error: null });
  } catch (err) {
    res.render('index', { movies: [], error: err.message });
  }
});

module.exports = router;
