const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('./src/middleware/flashMessage');
const usersRouter = require('./src/routes/users');
const moviesRouter = require('./src/routes/movies');
const moviesController = require('./src/controllers/moviesController');


const app = express();

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/`);
});

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false
}));

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

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

// Flash messages middleware
app.use(flash);

// Homepage
app.get('/', moviesController.getAllMovies);

// Static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));

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

