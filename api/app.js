var express = require('express');
var bodyParse = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

var app = express();

//middlewares
app.use(morgan('dev'));
app.use(bodyParse.urlencoded({extended:false}));
app.use(bodyParse.json());
app.use(cors());

//routes
app.use('/api', require('./routes/users'));
app.use('/api', require('./routes/follow'));
app.use('/api', require('./routes/publication'));
app.use('/api', require('./routes/message'));

//export
module.exports = app;