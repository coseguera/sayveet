/// <reference path="../../typings/node/node.d.ts"/>
'use strict';

var fs = require('fs'),
    program = require('commander');

module.exports = function (args, options) {
    program
    .version('0.0.0')
    .option('--db <dbName>', 'Database name')
    .option('--instance [instanceName]', 'The name of the (default: mongodb://localhost/)', 'mongodb://localhost/')
    .option('--file <filePath>', 'File path');
    
    if(options && options.amountin) {
        program.option('--amountin <value>', 'amount in (dollars|cents)');
    }
    
    program
    .option('--silent', 'do not output')
    .option('--test', 'just test the command')
    .parse(args);
    
    var valid = program.db && program.file;
    
    valid = valid && fs.existsSync(program.file) && fs.lstatSync(program.file).isFile();
    
    valid = valid && !(options && options.amountin && 
    (!program.amountin || !(program.amountin === 'dollars' || program.amountin === 'cents')));
    
    if (valid) {
        return program;
    } else {
        if (!program.silent) {
            program.help();
        }
        
        return;
    }
    return program;
};