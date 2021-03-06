'use strict';

var program = require('commander');

module.exports = function (args, options) {
    program
    .version('0.0.0')
    .option('--db <dbName>', 'Database name')
    .option('--instance [instanceName]', 'The name of the (default: mongodb://localhost/)', 'mongodb://localhost/');
    
    if (options && options.round) {
        program.option('--round', 'Round the amounts?');
    }
    
    program.parse(args);
    
    if(!program.db || !program.instance) {
        program.help();
        return;
    }
    
    return program;
};