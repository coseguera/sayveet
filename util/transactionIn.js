'use strict';

var fs = require('fs'),
    liner = require('./helpers/liner'),
    mongoose = require('mongoose'),
    repoFn = require('./../models/db/transactionRepository'),
    modelFn = require('./../models/db/transactionModel'),
    argsFn = require('./helpers/inArgs'),
    argvs = process.argv.slice(2);

var args = argsFn(argvs),
    lineCnt = 0;

if (args.valid) {
    var db = mongoose.createConnection(args.mongoInstance + args.dbName);
    modelFn();
    var repo = repoFn(db.model('Transaction'));

    var source = fs.createReadStream(args.fileName);
    source.pipe(liner);
    liner.on('readable', function () {
        var line;
        while ((line = liner.read())) {
            lineCnt++;
            processLine(line);
        }
    });
} else {
    console.error('There is an error');
}

function processLine (line) {
    var parts = line.split(','),
        obj = {
            date: new Date(parts[0]),
            concept: parts[1],
            amount: parts[2],
            person: parts[4],//[3],
            account: parts[3],//[4],
            splitId: parts[5]
        };

    //console.log(JSON.stringify(obj));

    if (isNaN(obj.date.getTime()) || isNaN(obj.amount)) {
        console.error('not a valid value!');
        return;
    }

    repo.query(obj, function (err, result) {
        if (err) {
            console.error(err);
            return;
        }

        lineCnt--;

        if (result.length > 0) {
            //console.error(JSON.stringify(result) + ' already exists');
            process.stdout.write('x');

            if (!lineCnt) {
                mongoose.disconnect();
            }

            return;
        }

        repo.create(obj, function (createErr) {
            if (createErr) {
                console.error(createErr);
            } else {
                //console.log('created: ' + JSON.stringify(obj));
                process.stdout.write('.');
            }

            if (!lineCnt) {
                mongoose.disconnect();
            }
        });
    });
}
