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
      // Check `user` table exists
      connection.query("SELECT * FROM `user` LIMIT 1", function(err){
        if (err){
          console.log("sqlConnection - tableUser:" + err);
          connection.query(config.createUserTable, function(err){
              if (err){
                console.log("sqlConnection - userTableCreation:" + err);
              } else {
                console.log("sqlConnection - userTableCreation: 'user' table created.");
              }
          }); 
        }
      });
      // Check `card` table exists
      connection.query("SELECT * FROM `card` LIMIT 1", function(err){
        if (err){
          console.log("sqlConnection - tableCard:" + err);
          connection.query(config.createCardTable, function(err){
              if (err){
                console.log("sqlConnection - cardTableCreation:" + err);
              } else {
                console.log("sqlConnection - cardTableCreation: 'card' table created.");
              }
          });
        } 
      });
      // Check `deck` table exists
      connection.query("SELECT * FROM `deck` LIMIT 1", function(err){
        if (err){
          console.log("sqlConnection - tableDeck:" + err);
          connection.query(config.createDeckTable, function(err){
              if (err){
                console.log("sqlConnection - deckTableCreation:" + err);
              } else {
                console.log("sqlConnection - deckTableCreation: 'deck' table created.");
              }
          });
        } 
      });
      // Check `decklist` table exists
      connection.query("SELECT * FROM `decklist` LIMIT 1", function(err){
        if (err){
          console.log("sqlConnection - tableDeckList:" + err);
          connection.query(config.createDeckListTable, function(err){
              if (err){
                console.log("sqlConnection - deckLIstTableCreation:" + err);
              } else {
                console.log("sqlConnection - deckListTableCreation: 'decklist' table created.");
              }
          });
        } 
      });
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
    done(null, user.iduser);
});

passport.deserializeUser(function(id, done) {
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
        req.login(user, function(err) {
        if (err) {
          console.log('/login - req.login: ' + err);
          res.send('/#/login');
        }
        res.send('/#/select');
       });
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
      req.login(user, function(err) {
        if (err) {
          console.log('/signup - req.login: ' + err);
          res.send('/#/login');
        }
        res.send('/#/select');
       });
    }
  })(req, res, next);
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.post('/authCheck', function(req, res){

  if(req.user){
    res.send(req.user);
  } else {
    res.send(false);
  }
});

// General authentication functions #######################################################
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
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

app.post('/getDeck', function(req,res){

	var deck = new Object();

	connection.query("SELECT * FROM `deck` WHERE `iduser` = '" + req.body.iduser + "' AND  `name` = '" + req.body.name + "'", function(err,rows){
		if(err){
			console.log("getDeck - getDeckName: " + err);
			res.send(false);
		} else if (!rows.length){
			res.send(false);
		} else {
			console.log(rows);
			console.log(rows[0]);
			deck.id = rows[0].iddeck;
			deck.name = req.body.name;
			connection.query("SELECT * FROM `decklist` WHERE `iddeck` = '" + deck.id + "'", function(err,rows){
				if(err){
					console.log("getDeck - getDeckList: " + err);
					res.send(false);
				} else if (!rows.length){
					console.log("getDeck - getDeckList: No cards found in deck");
					res.send(false);
				} else {
					var deckList = "";
					for (var i in rows) {
						deckList = deckList + rows[i].idcard + ",";
					}
					deckList = deckList.substring(0, deckList.length - 1);

					connection.query("SELECT * FROM `card` WHERE `idcard` IN ('" + deckList + "')", function(err,rows){
						if(err){
							console.log("getDeck - getCardList: " + err);
							res.send(false);
						} else if (!rows.length){
							console.log("getDeck - getCardList: No cards found");
							res.send(false);
						} else {
							for (var i in rows) {
								deck.deckList[i] = rows[i];
							}
							res.send(deck);
						}
					});
				}
			});
		}
	});
});



app.listen(config.port); // For local testing port is '8080'
console.log("Active port is: " + config.port);