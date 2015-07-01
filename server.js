var express = require('express');
var app = express();

app.use(express.static('./apps'));
app.listen(80);