var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');

var fileUpload = require('express-fileupload'); 

var index = require('./routes/index');
var users = require('./routes/users');
//Import routes for "catalog" area of site
var catalog = require('./routes/catalog');  

var helmet = require('helmet');
var compression = require('compression');

var app = express();

// Set up mongoose connection
var mongoose = require('mongoose');

//Set up default mongoose connection
var dev_db_url = 'mongodb://127.0.0.1:27017/expresslearn';
// var dev_db_url = 'mongodb://cooluser:coolpassword@ds119748.mlab.com:19748/local_library';
var mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB);

//Get the default connection
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Add this after the bodyParser middlewares! express-validator uses the body-parser to access parameters
app.use(expressValidator()); 
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(fileUpload());
app.use(compression()); //Compress all routes
app.use(helmet());
app.use('/', index);
app.use('/users', users);
// Add catalog routes to middleware chain.
app.use('/catalog', catalog);  

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
