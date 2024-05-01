require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const User = require('./models/user');
const session = require('express-session');
const passport = require('passport');

mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@task-management.5fwjy6z.mongodb.net/user_database?retryWrites=true&w=majority&appName=task-management`)
.then(() => {
  console.log('User Database connection successful');
})
.catch((err) => {
  console.log('Database Connection error');
});

var indexRouter = require('./routes/index');
var tasksRouter = require('./routes/task');
var authRouter = require('./routes/auth');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret:'my session',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.authenticate('session'));

app.use('/', indexRouter);
app.use('/tasks', tasksRouter);
app.use('/', authRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
