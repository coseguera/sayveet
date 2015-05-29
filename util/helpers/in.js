'use strict';

var fs = require('fs'),
    liner = require('./liner');

module.exports = function (fileName, callback, end) {
    var source = fs.createReadStream(fileName);
    source.pipe(liner);
    
    liner.on('readable', function () {
        var line;
        while ((line = liner.read())) {
            callback(line);
        }
    })
    .on('end', end);
};