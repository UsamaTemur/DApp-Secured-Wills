var mongoose = require('mongoose');

var transferSchema = mongoose.Schema({
    willHash           : String,
    toEmail            : String,
    fromEmail          : String,
});

// create the model for transfers and expose it to our app
module.exports = mongoose.model('Transfer', transferSchema);