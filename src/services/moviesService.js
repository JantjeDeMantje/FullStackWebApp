const moviesDao = require('../dao/moviesDao');

exports.fetchMovies = function(q, genre, callback) {
  moviesDao.getMovies(q, genre, callback);
};

exports.fetchGenres = function(callback) {
  moviesDao.getGenres(callback);
};

exports.fetchMovieById = function(id, callback) {
  moviesDao.getMovieById(id, callback);
};

exports.fetchActorsByMovieId = function(movieId, callback) {
  moviesDao.getActorsByMovieId(movieId, callback);
};

exports.getAvailableCopies = function(filmId, callback) {
  moviesDao.getAvailableCopies(filmId, callback);
};