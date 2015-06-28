'use strict';

var stream = require('stream');
var liner = new stream.Transform({ objectMode: true });

liner._transform = function (chunk, encoding, done) {
    var data = chunk.toString();
    if (this.lastLineData) { data = this.lastLineData + data; }

    var lines = data.split(/\r?\n/);
    this.lastLineData = lines.splice(lines.length - 1, 1)[0];

    lines.forEach(this.push.bind(this));
    done();
};

liner._flush = function (done) {
    if (this.lastLineData) { this.push(this.lastLineData); }
    this.lastLineData = null;
    done();
};

module.exports = liner;
