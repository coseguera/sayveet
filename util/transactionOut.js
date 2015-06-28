'use strict';

var mongoose = require('mongoose'),
    repoFn = require('./../models/db/transactionRepository'),
    modelFn = require('./../models/db/transactionModel'),
    outArgs = require('./helpers/outArgs');
var args = outArgs(process.argv, { round: true });

var db = mongoose.createConnection(args.instance + args.db);
modelFn();
var repo = repoFn(db.model('Transaction'));

if (args) {
    repo.getAll(function (err, result) {
        if (err) {
            console.error('An error ocurred');
        }

        for (var i in result) {
            if (result.hasOwnProperty(i)) {
                var item = result[i],
                    amount = args.round ? Math.round(item.amount) : item.amount,
                    splitId = item.splitId ? item.splitId : '';
                console.log(item.date + ',' +
                    item.concept + ',' +
                    amount + ',' +
                    item.account + ',' +
                    item.person + ',' +
                    splitId);
            }
        }
        mongoose.disconnect();
    });
}