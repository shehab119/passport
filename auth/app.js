var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local'),Strategy;
var expressValidator = require('express-validator');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');




mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://localhost/reg', {
  useNewUrlParser: true
});
var db = mongoose.connection;

var app = express();
console.log("Ready to GO");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));





// Express body parser
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);


//Express Validator

app.use(expressValidator({
	errorFormatter: function(param, smg, value){

		var namespace = param.split('.'),
		 root = namespace.shift(),
		formParam = root;
			while (namespace,length){
				formParam += '[' + namespace.shift() + ']';
			}
			return {
				param : formParam,
				msg : msg,
				value : value
			};
	}

}));


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});


app.use('/', indexRouter);
app.use('/users', usersRouter);

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