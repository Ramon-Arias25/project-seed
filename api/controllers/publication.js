var path = require('path');
var fs = require('fs');
var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');
var Publication = require('../models/publication');
var User = require('../models/user');
var Follow = require('../models/follow');


function savePublications(req, res) {

    if (!req.body.text) return res.status(200).send({ message: 'Debes enviar un texto' });

    var publication = new Publication();

    publication.text = req.body.text;
    publication.file = null;
    publication.user = req.user.sub;
    publication.create_at = moment().unix();
    publication.save((err, publicationStored) => {
        if (err) return res.status(500).send({ message: 'Error al guardar la publicacion' });

        if (!publicationStored) return res.status(404).send({ message: 'La publicacion no se ha guardado' });

        return res.status(200).send({ publication: publicationStored })
    });
}

function getPublications(req, res) {
    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    }
    var itemsPerPage = 4;
    var followsClean = [];
    Follow.find({ "user": req.user.sub }).populate('followed')
    .exec()
    .then((follows) => {
        for (let i in follows) {
            followsClean.push(follows[i].followed._id);
        }
        followsClean.push(req.user.sub);
        Publication.find({ user: { $in: followsClean } }).sort({ create_at: -1 }).populate('user').paginate(page, itemsPerPage, (err, publications, total) => {
            if (err) return res.status(500).send({ message: 'Error devolver publicaciones' });
            if (!publications) return res.status(404).send({ message: 'No existen publicaciones' });
            return res.status(200).send({
                total_items: total,
                pages: Math.ceil(total / itemsPerPage),
                page: page,
                itemsPerPage: itemsPerPage,
                publications
            }
            )
        });
    });
}

function getPublicationsByUser(req, res) {
    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    }

    if (req.params.id) {
        var userId = req.params.id
    } else {
        var userId = req.params.sub
    }

    var itemsPerPage = 4;
    Publication.find({ user: userId }).sort({ create_at: -1 }).populate('user').paginate(page, itemsPerPage, (err, publications, total) => {

        if (err) return res.status(500).send({ message: 'Error devolver publicaciones' });

        if (!publications) return res.status(404).send({ message: 'No existen publicaciones' });
        return res.status(200).send({
            total_items: total,
            pages: Math.ceil(total / itemsPerPage),
            page: page,
            itemsPerPage: itemsPerPage,
            publications
        })
    });
}

function getPublication(req, res) {

    Publication.findById(req.params.id, (err, publication) => {
        if (err) return res.status(500).send({ message: 'Error devolver publicaciones ' });

        if (!publication) return res.status(404).send({ message: 'No existe publicacion' });

        return res.status(200).send({ publication });
    });
}

function deletePublication(req, res) {

    Publication.find({ 'user': req.user.sub, '_id': req.params.id })
        .deleteOne((err, publicationRemoved) => {
            if (err) return res.status(500).send({ message: 'Error al borrar publicaciones' });
            
            if (!publicationRemoved) return res.status(404).send({ message: 'No se ha borrado la publicacion ' });

            if (publicationRemoved.n == 1) {
                return res.status(200).send({ message: 'Publicacion eliminada correctamente' });
            } else {
                return res.status(404).send({ message: 'Error al borrar publicacion' });
            }

        });

}

function uploadImage(req, res) {
        if (req.files.image) { 
            if (((req.files.image.path.split('/')[2]).split('\.')[1]) == 'png' 
             || ((req.files.image.path.split('/')[2]).split('\.')[1]) == 'jpg' 
             || ((req.files.image.path.split('/')[2]).split('\.')[1]) == 'jpeg' 
             || ((req.files.image.path.split('/')[2]).split('\.')[1]) == 'gif') {

            Publication.find({ 'user': req.user.sub, '_id': req.params.id }).exec((err, publication) => {
                if (publication) {
                    Publication.findByIdAndUpdate({ _id: req.params.id }, { file: (req.files.image.path.split('/')[2]) }, { new: true }, (err, publicationUpdate) => {

                        if (err) return res.status(500).send({ message: 'Error en la peticion' });

                        if (!publicationUpdate) return res.status(404).send({ message: 'No se ha podido actualizar el archivo' });

                        return res.status(200).send({ publication: publicationUpdate });
                    });
                } else {
                    fs.unlink(file_path, (err) => {
                        return res.status(200).send({ message: 'No tiene permiso de actualizar publicacion' });
                    });
                }
            });

        } else {
            fs.unlink(file_path, (err) => {
                return res.status(200).send({ message: 'Extension no valida' });
            });
        }

    } else {
        return res.status(200).send({ message: 'No se ha subido archivo' });
    }
}

function getImageFile(req, res) {
    if (fs.existsSync('./uploads/publications/' + req.params.imageFile)) {
        res.sendFile(path.resolve(('./uploads/publications/' + req.params.imageFile)));
    } else {
        res.status(200).send({ message: 'No existe la imagen. . . ' });
    }
}


module.exports = {
    savePublications,
    getPublications,
    getPublication,
    deletePublication,
    uploadImage,
    getImageFile,
    getPublicationsByUser
}