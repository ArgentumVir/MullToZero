// Package Dependencies
var bodyParser = require('body-parser');
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
app.use(flash());

// Passport session setup #######################################################
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    connection.query("select * from user where id = " + id, function(err,rows){	
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
	console.log(email);
	console.log(password);
	email = email.toLowerCase();
	console.log("SIGNUP: DEBUG FLAG 0");
	// Check if email already exists
    /*connection.query("select * from user where email = '" + email + "'", function(err,rows){
    	console.log("SIGNUP: DEBUG FLAG 0.5");
		if (err){
			console.log("SIGNUP: " + err);
            return done(err);
        }
		 if (rows.length) {
		 	console.log("SIGNUP: Username is already taken");
            return done(null, false);
        } else {*/
			// Create user if email not taken
			console.log("SIGNUP: DEBUG FLAG 1");
            var newUserMysql = new Object();
			
			console.log("SIGNUP: DEBUG FLAG 2");
			newUserMysql.email    = email;
			console.log("SIGNUP: DEBUG FLAG 3");
            newUserMysql.password = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
			console.log("SIGNUP: DEBUG FLAG 4");
			var insertQuery = "INSERT INTO user ( email, password ) values ('" + email + "','" + password + "')";
			console.log(insertQuery);
			connection.query(insertQuery,function(err,rows){
				console.log("SIGNUP: Success");
				return done(null, newUserMysql);
        	});
}));
	//});
// Local Login #######################################################
passport.use('localLogin', new localStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
},
function(req, email, password, done) {
	email = email.toLowerCase();
     connection.query("SELECT * FROM `user` WHERE `email` = '" + email + "'", function(err,rows){
		if (err)
            return done(err);
		 if (!rows.length) {
		 	// Username not found
            return done(null, false);
        } 
		
        if (!( rows[0].password == password)){
        	//Password incorrect
            return done(null, false);
        }
		
        // Success
        return done(null, rows[0]);					
	});
}));

// Passport routes #######################################################
app.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
});

app.post('/signup', passport.authenticate('localSignup', {
    successRedirect : '/#/profile',
    failureRedirect : '/#/signup',
}));

// General authentication functions #######################################################
function isLoggedIn(req, res, next) {

    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}

// Local authentication routes #######################################################
app.post('/login',
  passport.authenticate('local'),
  function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    res.redirect('/users/' + req.user.username);
  });

app.post('/signupCheck', function(req, res){
	email = req.body;
	connection.query("select * from user where email = '" + email + "'", function(err,rows){
		if (err){
			console.log("signupCheck: " + err);
        } 
        else if (rows.length) {
		 	console.log("SIGNUP: Username is already taken.");
            res.send(true);
        } else {
        	res.send(false);
        }
    })
});




app.use(express.static('./public'));
app.listen(config.port); // For local testing port is '8080'
console.log("Active port is: " + config.port);