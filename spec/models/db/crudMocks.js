exports.crudMock = function () {
    return {
        find: function (callback) {
            callback(this.err, this.result);
        },
        findOne: function (obj, callback) {
            callback(this.err, this.result);
        },
        findOneAndUpdate: function (obj, obj2, callback) {
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
exports.CrudSaveMock.prototype.err = "err";

