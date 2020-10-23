var express = require('express');
var publicationsController = require('../controllers/publication');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');
var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/publications' });

api.get('/publication/save', md_auth.ensureAuth, publicationsController.savePublications);
api.get('/publication/getPublications/:page?', md_auth.ensureAuth, publicationsController.getPublications);
api.get('/publication/getPublication/:id', md_auth.ensureAuth, publicationsController.getPublication);
api.delete('/publication/deletePublication/:id', md_auth.ensureAuth, publicationsController.deletePublication);
api.post('/publication/updatePublication/:id', [md_auth.ensureAuth, md_upload], publicationsController.uploadImage);
api.get('/publication/getPublication/:imageFile', publicationsController.getImageFile);
api.get('/publications/:id?/:page?', md_auth.ensureAuth, publicationsController.getPublicationsByUser);

module.exports = api;