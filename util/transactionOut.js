'use strict';

var args = process.argv.slice(2);

var validArgs = false,
    round = false,
    mongoInstance = 'mongodb://localhost/',
    dbName;

for (var i = 0, len = args.length; i < len; i++) {
    switch(args[i]) {
        case '--round':
            round = true;
            break;
        case '--db':
            validArgs = false;
            i++;
            dbName = args[i];
            validArgs = true;
            break;
        case '--instance':
            validArgs = false;
            i++;
            mongoInstance = args[i];
            validArgs = true;
            break;
    }
}

if (validArgs) {
    var mongoose = require('mongoose');
    var db = mongoose.createConnection(mongoInstance + dbName);
    var repoFn = require('./../models/db/transactionRepository');
    var modelFn = require('./../models/db/transactionModel');
    
    modelFn();
    var repo = repoFn(db.model('Transaction'));
    
    repo.getAll(function (err, result) {
        for (var i in result) {
            if (result.hasOwnProperty(i)) {
                var item = result[i],
                    amount = round ? Math.round(item.amount) : item.amount,
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
else {
    console.error('No valid args provided');
}
