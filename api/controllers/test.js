function home (req, res) {
    res.status(200).send({ message: 'Hola mundo desde el servidor' });
}

function pruebas (req, res){
    res.status(200).send({ message: 'Accion de prueba en el servidor NodeJS' });
}

module.exports = {
    home,
    pruebas
}