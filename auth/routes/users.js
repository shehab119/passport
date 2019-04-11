var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local'),Strategy;
var flash = require('connect-flash');

var User = require('../models/user');



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', function(req, res, next) {
  res.render('login');
});




router.get('/signup', function(req, res, next) {
  res.render('signup');
});

router.post('/signup', function(req, res, next) {
	var name = req.body.name;
	var password = req.body.password;
	console.log(name);

	var newUser = new User({
		name:name,
		password:password

	});

	User.createUser(newUser, function (err, user){
		if(err) throw err;
		console.log(user);

	})


	res.redirect('/users/login');
	
});

passport.use(new LocalStrategy(
  function(name, password, done) {
  User.getUserByName(name,function(err, user){
  	if(err) throw err;
  	if(!user){
  		return done(null,false,{message:'Unknown User'});
  	}
  	User.comparePassword(password, user.password, function(err,isMatch){
  		if(err) throw err;
  		if(isMatch){
  			return done(null,user);
  		}else{
  			return done(null,false,{message: 'Invalid password'});
  		}
  	});
  });

  }));


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});



router.post('/login',passport.authenticate('local', 
	{ successRedirect: '/users',failureRedirect: '/users/login',failureFlash: true }),
	function (err, user){
	console.log(user);
  	res.redirect('/user/login');
  });


module.exports = router;
