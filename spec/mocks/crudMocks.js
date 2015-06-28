'use strict';

exports.crudMock = function () {
    return {
        find: function (callback) {
            if (callback) {
                callback(this.err, this.result);
                return undefined;
            }
            return this;
        },
        where: function () { return this; },
        sort: function () { return this; },
        gt: function () { return this; },
        lte: function () { return this; },
        exec: function(callback) {
            callback(this.err, this.result);
        },
        aggregate: function (param1, param2, callback) {
            callback(this.err, this.result);
        },
        findById: function (id, callback) {
            callback(this.err, this.result);
        },
        findOne: function (obj, callback) {
            callback(this.err, this.result);
        },
        findByIdAndUpdate: function (id, obj, callback) {
            callback(this.err, this.result);
        },
        findOneAndUpdate: function (obj, obj2, callback) {
            callback(this.err, this.result);
        },
        findByIdAndRemove: function (id, callback) {
            callback(this.err, this.result);
        },
        findOneAndRemove: function (obj, callback) {
            callback(this.err, this.result);
        }
    };
};

exports.CrudSaveMock = function () { };
exports.CrudSaveMock.prototype.save = function (callback) {
    callback(this.err);
};
exports.CrudSaveMock.prototype.err = 'err';

