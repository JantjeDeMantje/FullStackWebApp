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

exports.getMovieById = function(id, callback) {
  const sql = `
    SELECT f.film_id, f.title, f.description, f.release_year, f.length, f.rating, f.special_features,
           GROUP_CONCAT(c.name) AS genres
    FROM film f
    JOIN film_category fc ON f.film_id = fc.film_id
    JOIN category c ON fc.category_id = c.category_id
    WHERE f.film_id = ?
    GROUP BY f.film_id
  `;
  db.query(sql, [id], function(err, results) {
    if (err) return callback(err);
    callback(null, results[0]);
  });
};

exports.getActorsByMovieId = function(movieId, callback) {
  const sql = `
    SELECT a.actor_id, a.first_name, a.last_name
    FROM actor a
    JOIN film_actor fa ON a.actor_id = fa.actor_id
    WHERE fa.film_id = ?
    ORDER BY a.last_name, a.first_name
  `;
  db.query(sql, [movieId], callback);
};