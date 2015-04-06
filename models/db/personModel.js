var mongoose = require('mongoose');

module.exports = function () {
    var personSchema = mongoose.Schema({
        id: String,
        name: String
    });
    return mongoose.model('Person', personSchema);
};
