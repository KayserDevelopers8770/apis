// !/usr/bin/env node
var express = require('express');
var app = express();
app.get('/', function (req, res, error) {
	if (error) console.log("ERROR EN LA PETICION")
	res.send('Globo.Tech says Hello!');
});
app.listen(6915, function () {
	console.log('Basic NodeJS app listening on port 6915.');
});