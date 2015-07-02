var express = require('express');
var url = require('url');
var app = express();

app.use(express.static('./public'));
app.listen(80);