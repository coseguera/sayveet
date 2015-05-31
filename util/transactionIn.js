'use strict';

var mongoose = require('mongoose'),
    repoFn = require('./../models/db/transactionRepository'),
    modelFn = require('./../models/db/transactionModel'),
    inFn = require('./helpers/in'),
    args = require('./helpers/inArgs')(process.argv, { amountin: true });

if (!args) { return; }

var db = mongoose.createConnection(args.instance + args.db);
modelFn();
var repo = repoFn(db.model('Transaction'));

inFn(args.file, processLine, end);

function processLine (line, next) {
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
        return next();
    }

    if (args.test) {
        console.log(JSON.stringify(obj));
        return next();
    }

    repo.query(obj, function (err, result) {
        if (err) {
            console.error(err);
            return next();
        }

        if (result.length > 0) {
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