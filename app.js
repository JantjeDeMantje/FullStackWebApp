 //aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
const express = require('express');
const path = require('path');

const usersRouter = require('./src/routes/users');
const moviesRouter = require('./src/routes/movies');
const moviesController = require('./src/controllers/moviesController');

const app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(require('express-ejs-layouts'));
app.set('layout', 'layouts/main');

// Set default title and layout variables for all views
app.use((req, res, next) => {
  res.locals.title = 'Express Sakila WebApp';
  res.locals.genre = '';
  res.locals.genres = [];
  next();
});

// Homepage
app.get('/', moviesController.getAllMovies);

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/users', usersRouter);
app.use('/movies', moviesRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).render('error', { title: 'Error', message: 'Not Found', error: {} });
});

// Error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500).render('error', { title: 'Error', message: err.message, error: res.locals.error });
});

module.exports = app;

