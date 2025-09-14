const moviesService = require('../services/moviesService');

// Render movies page with filters
exports.getAllMovies = function(req, res) {
  const q = req.query.q || '';
  const genre = req.query.genre || '';
  moviesService.fetchGenres(function(err, genres) {
    if (err) {
      return res.render('moviesTable', { movies: [], error: err.message, q, genres: [], genre });
    }
    moviesService.fetchMovies(q, genre, function(err, movies) {
      if (err) {
        return res.render('moviesTable', { movies: [], error: err.message, q, genres, genre });
      }
      res.render('moviesTable', { movies, error: null, q, genres, genre });
    });
  });
};