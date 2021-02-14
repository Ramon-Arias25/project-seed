var express = require('express');
var UserController = require ('../controllers/user');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');



var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: process.cwd() + '/src/uploads/users/'});


api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.get('/user/:id', md_auth.ensureAuth, UserController.getUser);
api.get('/users/:page?', md_auth.ensureAuth, UserController.getUsers);
api.put('/user/update/:id', md_auth.ensureAuth, UserController.updateUser);
api.post('/user/upload-image-user/:id?', [ md_auth.ensureAuth, md_upload ] , UserController.uploadImage);
api.get('/user/get-image/:imageFile', UserController.getImageFile);
api.get('/user/get-counters/:id?', md_auth.ensureAuth, UserController.getCounters);

module.exports = api; 