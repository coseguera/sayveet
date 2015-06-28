'use strict';

var mongoose = require('mongoose'),
    repoFn = require('./../models/db/accountRepository'),
    modelFn = require('./../models/db/accountModel'),
    inFn = require('./helpers/in'),
    inArgs = require('./helpers/inArgs');
var args = inArgs(process.argv);

var db = mongoose.createConnection(args.instance + args.db);
modelFn();
var repo = repoFn(db.model('Account'));

function processLine(line, next) {
    var parts = line.split(','),
        obj = {
            id: parts[0],
            name: parts[1]
        };

    if (args.test) {
        console.log(JSON.stringify(obj));
        return next();
    }

    repo.get(obj.id, function (err, result) {
        if (err) {
            console.error(err);
            return next();
        }

        if (result) {
            process.stdout.write('x');
            return next();
        }

        repo.create(obj, function (createErr) {
            if (createErr) {
                console.error(createErr);
            } else {
                process.stdout.write('.');
            }
            return next();
        });
    });
}

function end() {
    process.stdout.write('\n');
    mongoose.disconnect();
}

if (args) {
    inFn(args.file, processLine, end);
}