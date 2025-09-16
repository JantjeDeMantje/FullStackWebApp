const moviesService = require("../services/moviesService");

// Render movies page with filters
exports.getAllMovies = function (req, res) {
  const q = req.query.q || "";
  const genre = req.query.genre || "";
  moviesService.fetchGenres(function (err, genres) {
    if (err) {
      return res.render("moviesTable", {
        movies: [],
        error: err.message,
        q,
        genres: [],
        genre,
      });
    }
    moviesService.fetchMovies(q, genre, function (err, movies) {
      if (err) {
        return res.render("moviesTable", {
          movies: [],
          error: err.message,
          q,
          genres,
          genre,
        });
      }
      res.render("moviesTable", { movies, error: null, q, genres, genre });
    });
  });
};

exports.getMovieDetail = function (req, res) {
  const id = req.params.id;
  moviesService.fetchMovieById(id, function (err, movie) {
    if (err || !movie) {
      return res
        .status(404)
        .render("error", {
          title: "Error",
          message: "Movie not found",
          error: {},
        });
    }
    moviesService.fetchActorsByMovieId(id, function (err, actors) {
      if (err) {
        return res
          .status(500)
          .render("error", {
            title: "Error",
            message: "Failed to load actors",
            error: {},
          });
      }
      moviesService.getAvailableCopies(id, function (err, availableCopies) {
        if (err) {
          return res
            .status(500)
            .render("error", {
              title: "Error",
              message: "Failed to check availability",
              error: {},
            });
        }
        res.render("movieDetail", { movie, actors, availableCopies });
      });
    });
  });
};