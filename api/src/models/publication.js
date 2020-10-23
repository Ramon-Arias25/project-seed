var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PublicationSchema = Schema ({
    text: String,
    file: String,
    createAt: String,
    user : { type: Schema.ObjectId, ref: 'User' }
});

module.exports = mongoose.model ('Publication', PublicationSchema);