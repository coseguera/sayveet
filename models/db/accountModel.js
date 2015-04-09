'use strict';

var mongoose = require('mongoose');

module.exports = function () {
    var accountSchema = mongoose.Schema({
        id: String,
        name: String
    });
    return mongoose.model('Account', accountSchema);
};
