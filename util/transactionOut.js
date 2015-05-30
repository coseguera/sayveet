'use strict';

var mongoose = require('mongoose'),
    repoFn = require('./../models/db/transactionRepository'),
    modelFn = require('./../models/db/transactionModel'),
    args = require('./helpers/outArgs')(process.argv, { round: true });

if (!args) { return; }

var db = mongoose.createConnection(args.instance + args.db);
modelFn();
var repo = repoFn(db.model('Transaction'));

repo.getAll(function (err, result) {
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