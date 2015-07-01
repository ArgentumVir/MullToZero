var express = require('express');
var app = express();

//serve static content for the app from the 'pages' directory in the app dir
app.use(express.static('./apps'));
app.listen(80);