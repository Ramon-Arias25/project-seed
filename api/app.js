var express = require('express');
var bodyParse = require('body-parser');

var app = express();

//routes
var user_routes = require('./routes/users');
//middlewares
app.use(bodyParse.urlencoded({extended:false}));
app.use(bodyParse.json());

//cros

//rutas
app.use('/api', user_routes);

//export
module.exports = app;