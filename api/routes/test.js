var express = require('express');
var { home, pruebas } = require ('../controllers/test');

var api = express.Router();

api.get('/home', home);
api.get('/pruebas', pruebas);

module.exports = api;