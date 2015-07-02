// Package Dependencies
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var express = require('express');
var flash = require('connect-flash'); // Probobly won't need this one
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

//require('./app/routes.js')(app, passport);

app.use(express.static('./public'));
app.listen(config.port); // For local testing port is '8080'
console.log("Active port is: " + config.port);