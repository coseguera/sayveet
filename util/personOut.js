'use strict';

var mongoose = require('mongoose'),
    repoFn = require('./../models/db/personRepository'),
    modelFn = require('./../models/db/personModel'),
    outArgs = require('./helpers/outArgs');
var args = outArgs(process.argv);

var db = mongoose.createConnection(args.instance + args.db);
modelFn();
var repo = repoFn(db.model('Person'));

if (args) {
    repo.getAll(function (err, result) {
        if (err) {
            console.error('An error ocurred');
        }

        for (var i in result) {
            if (result.hasOwnProperty(i)) {
                var item = result[i];
                console.log(item.id + ',' + item.name);
            }
        }
        mongoose.disconnect();
    });
}