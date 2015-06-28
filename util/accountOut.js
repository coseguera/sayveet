'use strict';

var mongoose = require('mongoose'),
    repoFn = require('./../models/db/accountRepository'),
    modelFn = require('./../models/db/accountModel'),
    outArgs = require('./helpers/outArgs');
var args = outArgs(process.argv);

var db = mongoose.createConnection(args.instance + args.db);
modelFn();
var repo = repoFn(db.model('Account'));

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