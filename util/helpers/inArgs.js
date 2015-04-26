'use strict';

var fs = require('fs');
module.exports = function (args) {
    var result = {
        mongoInstance: 'mongodb://localhost/'
    };

    for (var i = 0, len = args.length; i < len; i++) {
        switch(args[i]) {
            case '--db':
                i++;
                result.dbName = args[i];
                break;
            case '--instance':
                i++;
                result.mongoInstance = args[i];
                break;
            case '--file':
                i++;
                var path = args[i];
                if (fs.existsSync(path) && fs.lstatSync(path).isFile()) {
                    result.fileName = path;
                }
                break;
            case '--amountin':
                i++;
                var amountin = args[i];
                if (amountin === 'dollars' || amountin === 'cents') {
                    result.amountin = amountin;
                }
                break;
            case '--test':
                result.test = true;
                break;
        }
    }

    result.valid = !!result.mongoInstance && 
        !!result.dbName && 
        !!result.fileName &&
        !!result.amountin;

    if (!result.valid) {
        process.stderr.write('usage: node programName --db databaseName ');
        process.stderr.write('[--instance instanceName] --file pathToFile ');
        process.stderr.write('--amountin dollars|cents [--test]\n');
        process.stderr.write('example: node accountIn.js --db sayveet --file ');
        process.stdout.write('/Users/coseguera/Documents/ispentit_backup/accounts.txt\n');
    }

    return result;
};
