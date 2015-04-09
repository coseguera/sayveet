'use strict';

var mongoose = require('mongoose');

module.exports = function (connectionString) {
    var db = mongoose.createConnection(connectionString);

    db.on('error', function (err) {
        if(err) { throw err; }
    });

    db.once('open', function () {
        console.info('mongodb connection successful');
    });

    return db;
};
