'use strict';

var mongoose = require('mongoose'),
    repoFn = require('./../models/db/accountRepository'),
    modelFn = require('./../models/db/accountModel'),
    argsFn = require('./helpers/inArgs'),
    inFn = require('./helpers/in'),
    argvs = process.argv.slice(2);

var args = argsFn(argvs);

if (!args.valid) { return; }

var db = mongoose.createConnection(args.mongoInstance + args.dbName);
modelFn();
var repo = repoFn(db.model('Account'));

inFn(args.fileName, processLine, end);;

function processLine(line) {
    var parts = line.split(','),
        obj = {
            id: parts[0],
            name: parts[1]
        };

    repo.get(obj.id, function (err, result) {
        if (err) {
            console.error(err);
            return;
        }

        if (result) {
            process.stdout.write('x');
            return;
        }

        repo.create(obj, function (createErr) {
            if (createErr) {
                console.error(createErr);
            } else {
                process.stdout.write('.');
            }
        });
    });
}

function end() {
    process.stdout.write('\n');
    mongoose.disconnect();
}