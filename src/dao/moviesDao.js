const db = require('../../db');

exports.getMovies = function(q, genre, callback) {
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
    params.push('%' + q + '%');
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
  db.query(sql, params, callback);
};

exports.getGenres = function(callback) {
  db.query('SELECT name FROM category ORDER BY name', callback);
};