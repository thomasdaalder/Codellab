var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var expressHbs = require('express-handlebars');
var hbsHelpers = require('handlebars-helpers');
var session = require('express-session');
var validator = require('express-validator');
var flash = require('connect-flash');
var pg = require('pg');
var db = require(__dirname + '/models/db.js');
var bcrypt = require('bcrypt');

// Including routes
var index = require('./routes/index');
var userRoutes = require('./routes/user');
var project = require('./routes/grabProject');
var profile = require('./routes/grabProfile');

var app = express();

// View engine setup
var hbs = expressHbs.create({
    extname: '.hbs',
    defaultLayout: 'layout',
    layoutsDir: './views/layouts',
    partialsDir: './views/partials',
    helpers: require('./helpers/helpers.js')
});
app.engine('hbs', hbs.engine);
app.set('view engine', '.hbs');

// Middleware
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session(
  {secret: 'thisisasupersecretkey',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/user', userRoutes);
app.use('/', index);
app.use('/project', project);
app.use('/profile', profile);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
