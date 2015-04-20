'use strict';

var mongoose = require('mongoose'),
    repoFn = require('./../models/db/accountRepository'),
    modelFn = require('./../models/db/accountModel'),
    argsFn = require('./helpers/outArgs'),
    argvs = process.argv.slice(2);

var args = argsFn(argvs);

if (!args.valid) { return; }

var db = mongoose.createConnection(args.mongoInstance + args.dbName);
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
