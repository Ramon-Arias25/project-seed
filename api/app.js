var express = require('express');
var bodyParse = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

var app = express();

//middlewares
app.use(morgan('dev'));
app.use(bodyParse.urlencoded({extended:false}));
app.use(bodyParse.json());
app.use(cors());

//settings
app.set('port', process.env.PORT || 3800);
app.set('uri', process.env.URI || 'mongodb://localhost:27017/test');
app.set('cluster', process.env.CLUSTER || 'CLUSTER');

//routes
app.use('/api', require('./routes/users'));
app.use('/api', require('./routes/follow'));
app.use('/api', require('./routes/publication'));
app.use('/api', require('./routes/message'));

//export
module.exports = app;