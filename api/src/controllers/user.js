var User = require('../models/user');
var Follow = require('../models/follow');
var Publication = require ('../models/publication');
var jwt = require('../services/jwt');
var {getFollowIds} = require('../services/getFollowIds');
var fs = require('fs'); 
var path = require('path');
var Paginate = require('../services/pagination');
var bcrypt = require('bcrypt');
var saltRounds = 10;

function saveUser(req, res) {
    if (req.body.name && req.body.surname && req.body.nick && req.body.email && req.body.password) {
        var user = new User();
        user.name = req.body.name;
        user.surname = req.body.surname;
        user.nick = req.body.nick;
        user.email = req.body.email;
        user.role = 'ROLE_USER';
        user.image = null;
        User.find({
            $or: [{ email: user.email.toLowerCase() }, { nick: user.nick.toLowerCase() }]
        }).exec((err, users) => {
            if (err) return res.status(500).send({ message: "error en la peticion de usuarios" });

            if (users && users.length >= 1) {
                return res.status(200).send({ message: "el email/nick existe" })
            } else {
                bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
                    user.password = hash;
                    user.save((err, userStored) => {
                        if (err)
                            return res.status(500).send({ message: 'error al guardar usuario' });

                        if (userStored) {
                            return res.status(200).send({ user: userStored });
                        } else {
                            return res.status(404).send({ message: ' no se ha registrado el usuario' });
                        }
                    });
                });
            }
        });
    } else {
        return res.status(200).send({ message: "faltan datos" });
    }
}

function loginUser(req, res) {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' });

        if (user) {
            bcrypt.compare(req.body.password, user.password, (err, check) => {
                if (check) {
                    if (req.body.gettoken) {
                        return res.status(200).send({ token: jwt.createtoken(user) });
                    } else {
                        user.password = undefined;
                        return res.status(200).send({ user });
                    }
                } else {
                    return res.status(404).send({ message: 'el usuario no se ha podido identificar' });
                }
            });
        } else {
            return res.status(404).send({ message: 'el usuario no existe' });
        }
    });
}

async function getUser(req, res) {
    User.findById(req.params.id, (err, user) => {
        if (err) return res.status(500).send({ message: ' Error en la peticion' });

        if (!user) return res.status(404).send({ message: 'El usuario no existe' });
        
        getFollowIds(req.params.id)
            .then((value) => {
                
                user.password = undefined;
                return res.status(200).send({
                    user,
                    following: value.following,
                    followers: value.followers
                });
            });
    });
}

function getUsers(req, res) {
    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    }
    var itemsPerPage = 5;
    User.find().sort('_id').paginate(page, itemsPerPage, (err, users, total) => {
        if (err) return res.status(500).send({ message: ' Error en la peticion' });

        if (!users) return res.status(404).send({ message: 'No hay usuarios disponibles' });

        return res.status(200).send({
            users,
            total,
            pages: Math.ceil(total / itemsPerPage)
        });
    });
}

function updateUser(req, res) {
    var userId = req.params.id;
    var update = req.body;
    delete update.password;

    if (userId != req.user.sub) {
        return res.status(500).send({ message: 'no tiene permiso para actualizar los datos del usuario' });
    }

    User.find({
        $or: [{ email: update.email.toLowerCase() }, { nick: update.nick.toLowerCase() }]
    }).exec((err, users) => {
        var userIsset = false;
        users.forEach((user) => {
            if(user && user._id != userId) {
                userIsset = true;
            }
        });

        if (userIsset){
            return res.status(500).send({ message: 'los datos ya estan en uso' });
        }

        /*findByIdAndUpdate will be deprecated function 
        is recommended replaced with useFindAndModify 
        and modify ../index.js global options mongoose useFindAndModify:true or delete this option*/
        User.findByIdAndUpdate(userId, update, { new: true }, (err, userUpdated) => {
            if (err) return res.status(500).send({ message: 'No se ha podido actualizar el usuario' });

            if (!userUpdated) return res.status(404).send({ message: 'No se ha podido actualizar el usuario' });

            return res.status(200).send({ user: userUpdated });
        });

    });
}

function uploadImage(req, res) {
    console.log(req.params);
    if (req.params.id = req.user.sub) {
        if (req.files.image) {
            if (((req.files.image.path.split('/')[2]).split('\.')[1]) == 'png'
                || ((req.files.image.path.split('/')[2]).split('\.')[1]) == 'jpg'
                || ((req.files.image.path.split('/')[2]).split('\.')[1]) == 'jpeg'
                || ((req.files.image.path.split('/')[2]).split('\.')[1]) == 'gif') {
                User.findByIdAndUpdate(req.params.id, { image: (req.files.image.path.split('/')[2]) }, { new: true }, (err, userUpdated) => {
                    if (err) {
                        fs.unlink(req.files.image.path, (err) => {
                            return res.status(500).send({ message: 'Error al actualizar el usuario' });
                        });
                    }
                    if (!userUpdated) {
                        fs.unlink(req.files.image.path, (err) => {
                            return res.status(404).send({ message: 'No se ha podido actualizar el usuario' });
                        });
                    }
                    return res.status(200).send({ user: userUpdated });
                });
            } else {
                fs.unlink(req.files.image.path, (err) => {
                    return res.status(200).send({ message: 'Extension no valida' });
                });
            }
        } else {
            return res.status(200).send({ message: 'No existe imagen adjunta' });
        }
    } else {
        fs.unlink(req.files.image.path, (err) => {
            return res.status(500).send({ message: 'no tiene permiso para actualizar los datos del usuario' });
        });
    }
}

function getImageFile(req, res) {

    if (fs.existsSync('./uploads/users/' + req.params.imageFile)) {
        res.sendFile(path.resolve('./uploads/users/' + req.params.imageFile));
    } else {
        res.status(200).send({ message: 'No existe la imagen' });
    }
}

function getCounters(req,res){
    var userId = req.user.sub;
    if(req.params.id){
        userId = req.params.id;
    }
    getCountAll(userId)
        .then((value)=>{   
            return res.status(200).send(value);
        });
}

async function getCountAll(user_id) {
    var following = await Follow.countDocuments({ user: user_id })
        .exec()
        .then((count) => {
            return count;
        })
        .catch((err) => { return handleError(err); });
 
    var followed = await Follow.countDocuments({ followed: user_id })
        .exec()
        .then((count) => {
            return count;
        })
        .catch((err) => { return handleError(err); });
 
    var publication = await Publication.countDocuments({ user: user_id })
        .exec()
        .then((count) => {
            return count;
        })
        .catch((err) => { return handleError(err); });
        
    return { following: following, 
        followed: followed, 
        publication: publication }
}

module.exports = {
    saveUser,
    loginUser,
    getUser,
    getUsers,
    updateUser,
    uploadImage,
    getImageFile,
    getCounters
}