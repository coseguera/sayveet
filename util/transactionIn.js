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

inFn(args.fileName, processLine, end);

function processLine (line, callback) {
    var parts = line.split(','),
        obj = {
            date: new Date(parts[0]),
            concept: parts[1],
            amount: args.amountin === 'dollars' ? 
                Math.round(parts[2] * 100) : parts[2],
            account: parts[3],
            person: parts[4]
        };

    if (parts[5]) {
        obj.splitId = parts[5];
    }

    if (isNaN(obj.date.getTime()) || isNaN(obj.amount)) {
        console.error('not a valid value!');
        return;
    }

    if (args.test) {
        console.log(JSON.stringify(obj));
        return;
    }

    repo.query(obj, function (err, result) {
        if (err) {
            console.error(err);
            return;
        }

        if (result.length > 0) {
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