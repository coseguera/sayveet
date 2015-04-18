'use strict';

var fs = require('fs'),
    liner = require('./helpers/liner'),
    mongoose = require('mongoose'),
    repoFn = require('./../models/db/accountRepository'),
    modelFn = require('./../models/db/accountModel'),
    argsFn = require('./helpers/inArgs'),
    argvs = process.argv.slice(2);

var args = argsFn(argvs),
    lineCnt = 0;

if (args.valid) {
    var db = mongoose.createConnection(args.mongoInstance + args.dbName);
    modelFn();
    var repo = repoFn(db.model('Account'));

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
            id: parts[0],
            name: parts[1]
        };

    repo.get(obj.id, function (err, result) {
        if (err) {
            console.error(err);
            return;
        }

        lineCnt--;

        if (result) {
            console.error(JSON.stringify(obj) + ' already exists');

            if (!lineCnt) {
                mongoose.disconnect();
            }

            return;
        }

        repo.create(obj, function (createErr) {
            if (createErr) {
                console.error(createErr);
            } else {
                console.log('created: ' + JSON.stringify(obj));
            }

            if (!lineCnt) {
                mongoose.disconnect();
            }
        });
    });
}
