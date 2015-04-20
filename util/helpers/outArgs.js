'use strict';

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
            case '--round':
                result.round = true;
                break;
        }
    }

    result.valid = !!result.mongoInstance &&
        !!result.dbName;

    if (!result.valid) {
        process.stderr.write('usage: node programName --db databaseName ');
        process.stderr.write('[--instance instanceName] [--round]\n');
        process.stderr.write('example: node accountOut.js --db sayveet --round\n');
    }

    return result;
};
