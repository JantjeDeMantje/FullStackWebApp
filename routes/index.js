var express = require('express');
var router = express.Router();

/* GET home page. */
const db = require('../db');

router.get('/', async function(req, res, next) {
  const q = req.query.q || '';
  const genre = req.query.genre || '';
  try {
    // Get all genres
    const [genres] = await db.query('SELECT name FROM category ORDER BY name');
    // Build movie query
    let movies;
    let sql = `
      SELECT f.film_id, f.title, f.description, f.release_year, MIN(c.name) AS genre
      FROM film f
      JOIN film_category fc ON f.film_id = fc.film_id
      JOIN category c ON fc.category_id = c.category_id
      WHERE 1
    `;
    let params = [];
    if (q) {
      sql += ' AND f.title LIKE ?';
      params.push(`%${q}%`);
    }
    if (genre) {
      sql += ' AND c.name = ?';
      params.push(genre);
    }
    sql += `
      GROUP BY f.film_id, f.title, f.description, f.release_year
      ORDER BY f.title
      LIMIT 20
    `;
    const [rows] = await db.query(sql, params);
    movies = rows;
    res.render('index', { movies, error: null, q, genres, genre: genre || '' });
  } catch (err) {
    res.render('index', { movies: [], error: err.message, q, genres: [], genre });
  }
});

module.exports = router;
