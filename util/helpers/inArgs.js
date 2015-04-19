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
        }
    }

    result.valid = !!result.mongoInstance && 
        !!result.dbName && 
        !!result.fileName;

    return result;
};
