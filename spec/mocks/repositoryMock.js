'use strict';

module.exports = function () {
    return {
        getAll: function (callback) {
            callback(this.err, this.result);
        },
        get: function (id, callback) {
            callback(this.err, this.result);
        },
        query: function (query, callback) {
            callback(this.err, this.result);
        },
        create: function (obj, callback) {
            callback(this.err);
        },
        update: function (obj, callback) {
            callback(this.err, this.result);
        },
        delete: function (id, callback) {
            callback(this.err, this.result);
        }
    };
};
