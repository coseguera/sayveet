'use strict';

var mongoose = require('mongoose'),
    repoFn = require('./../models/db/transactionRepository'),
    modelFn = require('./../models/db/transactionModel'),
    argsFn = require('./helpers/inArgs'),
    inFn = require('./helpers/in'),
    argvs = process.argv.slice(2);

var args = argsFn(argvs);

if (!args.valid) { return; }

var db = mongoose.createConnection(args.mongoInstance + args.dbName);
modelFn();
var repo = repoFn(db.model('Transaction'));

inFn(args.fileName, processLine, function () {
    process.stdout.write('\n');
    mongoose.disconnect();
});

function processLine (line, callback) {
    var parts = line.split(','),
        obj = {
            date: new Date(parts[0]),
            concept: parts[1],
            amount: parts[2],
            account: parts[3],
            person: parts[4],
            splitId: parts[5]
        };

    if (isNaN(obj.date.getTime()) || isNaN(obj.amount)) {
        console.error('not a valid value!');
        return callback();
    }

    repo.query(obj, function (err, result) {
        if (err) {
            console.error(err);
            return callback(err);
        }

        if (result.length > 0) {
            process.stdout.write('x');
            return callback(err);
        }

        repo.create(obj, function (createErr) {
            if (createErr) {
                console.error(createErr);
            } else {
                process.stdout.write('.');
            }
            callback(createErr);
        });
    });
}
