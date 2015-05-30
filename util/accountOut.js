'use strict';

var mongoose = require('mongoose'),
    repoFn = require('./../models/db/accountRepository'),
    modelFn = require('./../models/db/accountModel'),
    args = require('./helpers/outArgs')(process.argv);

if (!args) { return; }

var db = mongoose.createConnection(args.instance + args.db);
modelFn();
var repo = repoFn(db.model('Account'));

repo.getAll(function (err, result) {
    for (var i in result) {
        if (result.hasOwnProperty(i)) {
            var item = result[i];
            console.log(item.id + ',' + item.name);
        }
    }
    mongoose.disconnect();
});