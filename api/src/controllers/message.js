var Message = require('../models/message');
var moment = require('moment');
var Paginate = require('../services/pagination');

function saveMessage(req, res) {
    console.log(moment().unix());
    if (!req.body.text || !req.body.receiver) {

        return res.status(200).send({ message: 'Envia los datos necesarios' });
    } else {
        var message = new Message();
        message.emitter = req.user.sub;
        message.receiver = req.body.receiver;
        message.text = req.body.text;
        message.createdAt = moment().unix();
        message.viewed = 'false';
        message.save((err, messageStored) => {
            if (err) return res.status(500).send({ message: 'Error en la petición' });
    
            if (!messageStored) return res.status(500).send({ message: 'Error en la petición' });
    
            return res.status(200).send({ message: messageStored });
        });        
    }
}

function getReceivedMessages(req, res) {

    var page = 1;
    var itemsPerPage = 4;

    if (req.params.page) {
        page = req.params.page;
    }

    Message.find({ receiver: req.user.sub }).populate({
        path: 'emitter',
        select: '_id image nick surname name'
    }).sort('createAt').paginate(page, itemsPerPage, (err, messages, total) => {

        if (err) return res.status(500).send({ message: 'Error en la petición' });

        if (!messages) return res.status(404).send({ message: 'No hay mensajes que mostrar' });

        return res.status(200).send({
            total: total,
            pages: Math.ceil(total / itemsPerPage),
            messages
        });
    });
}

function getEmitterMessages(req, res) {
    
    var page = 1;
    var itemsPerPage = 4;

    if (req.params.page) {
        page = req.params.page;
    }

    Message.find({ emitter: req.user.sub }).populate({
        path: 'receiver',
        select: '_id image nick surname name'
    }).sort('createAt').paginate(page, itemsPerPage, (err, messages, total) => {

        if (err) return res.status(500).send({ message: 'Error en la petición' });

        if (!messages) return res.status(404).send({ message: 'No hay mensajes que mostrar' });

        return res.status(200).send({
            total: total,
            pages: Math.ceil(total / itemsPerPage),
            messages
        });
    });
}

function getCountUnViewedMessages(req, res) {

    Message.countDocuments({ receiver: req.user.sub, viewed: 'false' }).exec((err, count) => {
        if (err) return res.status(500).send({ message: 'Error en la petición' });

        return res.status(200).send({
            'unviewed': count
        });
    });
}

function setViewedMessages(req, res) {
    
    Message.updateOne({ _id: req.params.id , receiver: req.user.sub, viewed: 'false' }, { viewed: 'true' }, { 'multi': true }, (err, messagesUpdated) => {
        
        if (err) return res.status(500).send({ message: 'Error en la petición' });

        return res.status(200).send({ messages: messagesUpdated });
    });
}

function setUnViewedMessages(req, res) {
    
    Message.updateOne({ _id: req.params.id , receiver: req.user.sub, viewed: 'true' }, { viewed: 'false' }, { 'multi': false }, (err, messagesUpdated) => {
        
        if (err) return res.status(500).send({ message: 'Error en la petición' });

        return res.status(200).send({ messages: messagesUpdated });
    });
}

module.exports = {
    saveMessage,
    getReceivedMessages,
    getEmitterMessages,
    getCountUnViewedMessages,
    setViewedMessages,
    setUnViewedMessages
}