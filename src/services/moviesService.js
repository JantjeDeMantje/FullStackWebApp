const moviesDao = require('../dao/moviesDao');

exports.fetchMovies = function(q, genre, callback) {
  moviesDao.getMovies(q, genre, callback);
};

exports.fetchGenres = function(callback) {
  moviesDao.getGenres(callback);
};