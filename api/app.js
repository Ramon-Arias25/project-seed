var express = require('express');
var bodyParse = require('body-parser');

var app = express();

//routes

//middlewares
app.use(bodyParse.urlencoded({extended:false}));
app.use(bodyParse.json());

//cros

//rutas
app.get('/', (req, res) => {
    res.status(200).send({
        message: 'Hola Mundo desde Proyecto seed'
    });
});

//export
module.exports = app;