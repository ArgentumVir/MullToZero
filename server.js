'use strict';
// Package Dependencies
var bodyParser = require('body-parser');
var bcrypt   = require('bcrypt-nodejs');
var cookieParser = require('cookie-parser');
var express = require('express');
var flash = require('connect-flash'); // Probobly won't need this one
var localStrategy = require('passport-local').Strategy;
var morgan = require('morgan');
var mysql = require('mysql');
var passport = require('passport');
var session = require('express-session');
var url = require('url');

var config = require('./config.js');
var app = express();

var connection = mysql.createConnection({
	host: config.host,
	user: config.user,
	password: config.password,
	database: config.database
});

connection.connect(function(err){
	if(!err) {
	    console.log("Database is connected...");  
	} else {
	    console.log("Error connecting database...");  
	}
});

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser());

app.set('view engine', 'ejs');

app.use(session({secret: config.sessionSecret}));
app.use(passport.initialize());
app.use(passport.session());
//app.use(flash());
app.use(express.static('./public'));

// Passport session setup #######################################################
passport.serializeUser(function(user, done) {
    console.log("SERIALIZED");
    done(null, user.iduser);
});

passport.deserializeUser(function(id, done) {
    console.log("DESERIALIZED");
    connection.query("SELECT * from `user` where `iduser` = " + id, function(err,rows){
    	if(err) {
			console.log("deserializeUser:" + err);
			done(err, false); // Not sure I want to be returning false
		} else if (!rows.length){
			console.log("deserializeUser: User's id not found");
			done(err, false); 
		}
		done(err, rows[0]);
	});
});

// Local Sign Up #######################################################
passport.use('localSignup', new localStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
},
function(req, email, password, done) {
	email = email.toLowerCase();
  var newUser = new Object();
	
	newUser.email    = email;
  newUser.password = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);

  // Put user into database
	var insertQuery = "INSERT INTO user ( email, password ) values ('" + email + "','" + newUser.password + "')";
	connection.query(insertQuery,function(err,rows){
		if(err) {
			console.log("localSignup - insertQuery:" + err);
		} else {
			console.log("localSignup: User successfully added to database");
		}
	});

	// get generated user id for serialization purposes
	connection.query("SELECT * FROM `user` WHERE `email` = '" + email + "'", function(err,rows){
		if(err) {
			console.log("localSignup - idQuery:" + err);
		} else if (!rows.length){
			console.log("localSignup - idQuery: User's id not found");
			return done(null, false);
		}
		newUser.iduser = rows[0].iduser;
		return done(null, newUser);
	});
}));

// Local Login #######################################################
passport.use('localLogin', new localStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
},
function(req, email, password, done) {
	email = email.toLowerCase();

	// Checks if username/password are correct
    connection.query("SELECT * FROM `user` WHERE `email` = '" + email + "'", function(err,rows){
		if (err){
			console.log("localLogin:" + err);
      return done(err);
    }
		if (!rows.length) {
	 	  // Username not found
      console.log("localLogin - usernameCheck: Email not found. ");
      return done(null, false);
    } 
    if (!(bcrypt.compareSync(password, rows[0].password))){
    	//Password incorrect
      console.log("localLogin - passwordCheck: Passwords do not match. ");
      return done(null, false);
    }
    // Success
    return done(null, rows[0]);					
	});
}));

// Passport routes #######################################################
app.post('/login', function(req, res, next) {
  passport.authenticate('localLogin', function(err, user, info) {
  	if(err){
  		return next(err); // will generate a 500 error
  	}
  	if(!user){
  		res.send('/#/login');
  	} else {
  		res.send('/#/profile');
    }
  })(req, res, next);
});

app.post('/signup', function(req, res, next) {
  passport.authenticate('localSignup', function(err, user, info) {
    if (err) {
      	return next(err); // will generate a 500 error
    }
    if (!user) {
     	res.send('/#/signup');
    } else {
      res.send('/#/profile');
    }
  })(req, res, next);
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/authCheck', function(req, res){
  console.log(req.isAuthenticated());
  console.log(req.user);
  console.log(req.session);
  if(req.user){
    console.log("Logged in");
    res.send(true);
  } else {
    console.log("NOT Logged in");
    res.send(false);
  }
});

// General authentication functions #######################################################
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      console.log(next);
      return next();
    } else {
      res.redirect('/');
    }
}

// Local authentication routes #######################################################
app.post('/signupCheck', function(req, res){

	connection.query("select * from user where email = '" + req.body.email + "'", function(err,rows){
		if (err){
			console.log("signupCheck: " + err);
        } 
        else if (rows.length) {
        	// username taken
            res.send(true);
        } else {
        	// username free
        	res.send(false);
        }
    });
});

app.post('/loginCheck', function(req, res){
  // Checks if username/password are correct
    connection.query("SELECT * FROM `user` WHERE `email` = '" + req.body.email + "'", function(err,rows){
    if (err){
      console.log("loginCheck: " + err);
        }
    if (!rows.length) {
      // Username not found
      res.send(false);      
      } 
    if (!(bcrypt.compareSync(req.body.password, rows[0].password))){
      //Password incorrect
      res.send(false);  
    } else {
    // Success
    res.send(true);     
    }  
  });
});



app.listen(config.port); // For local testing port is '8080'
console.log("Active port is: " + config.port);