var express = require('express');
var MessageController = require('../controllers/message');
var md_auth = require('../middlewares/authenticated');
var api = express.Router();

api.post('/message/send', md_auth.ensureAuth, MessageController.saveMessage);
api.get('/message/inbox/:page?', md_auth.ensureAuth, MessageController.getReceivedMessages);
api.get('/message/outbox/:page?', md_auth.ensureAuth, MessageController.getEmitterMessages);
api.get('/message/uncountviewed', md_auth.ensureAuth, MessageController.getCountUnViewedMessages);
api.get('/message/setviewed/:id', md_auth.ensureAuth, MessageController.setViewedMessages);
api.get('/message/setunviewed/:id', md_auth.ensureAuth, MessageController.setUnViewedMessages);

module.exports = api;