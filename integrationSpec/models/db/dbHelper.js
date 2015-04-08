var mongoose = require("mongoose");
var started = false;

exports.startTimeoutForConnection = function () {
    if (started) return;

    setTimeout(function () {
        mongoose.disconnect();
    }, 500);
}
