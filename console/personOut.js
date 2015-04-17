'use strict';

var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://localhost/ispentit');
var repoFn = require('./../models/db/personRepository');
var modelFn = require('./../models/db/personModel');

modelFn();
var repo = repoFn(db.model('Person'));

repo.getAll(function (err, result) {
    for (var i in result) {
        if (result.hasOwnProperty(i)) {
            var item = result[i];
            console.log(item.id + ',' + item.name);
        }
    }
    mongoose.disconnect();
});
