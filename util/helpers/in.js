'use strict';

var fs = require('fs'),
    liner = require('./liner'),
    Writable = require('stream').Writable;

module.exports = function (fileName, callback, end) {
    var source = fs.createReadStream(fileName);

    var ws = new Writable();

    ws._write = function (chunk, enc, next) {
        callback(chunk.toString(), next);
    };

    ws.on('finish', end);

    source.pipe(liner).pipe(ws);
};