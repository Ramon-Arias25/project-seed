var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessageSchema = Schema ({
    emitter: { type: Schema.ObjectId, ref:'User' },
    receiver: { type: Schema.ObjectId, ref:'User' },
    text: String,
    viewed: String,
    createdAt: String,
});

module.exports = mongoose.model ('Message', MessageSchema);