'use strict';

var fs = require('fs'),
    async = require('async'),
    liner = require('./liner');

module.exports = function (fileName, fn, callback) {
    var source = fs.createReadStream(fileName);
    source.pipe(liner);

    var fns = [];

    liner.on('readable', function () {
        var line;

        while ((line = liner.read())) {
            pushLine(line);
        }
    })
    .on('end', function () {
        async.parallel(fns, callback);
    });

    function pushLine (line) {
        fns.push(function (callback) {
            fn(line, callback);
        });
    }
};
