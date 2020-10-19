var express = require('express');
var bodyParse = require('body-parser');

var app = express();

//middlewares
app.use(bodyParse.urlencoded({extended:false}));
app.use(bodyParse.json());

//cros

//routes
app.use('/api', require('./routes/test'));
app.use('/api', require('./routes/users'));
app.use('/api', require('./routes/follow'));

//export
module.exports = app;