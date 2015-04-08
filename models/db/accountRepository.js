module.exports = function (Account) {
    var model = {};

    model.getAll = function (callback) {
        Account.find(callback);
    };

    model.get = function (id, callback) {
        Account.findOne({ id: id }, callback);
    };

    model.create = function (obj, callback) {
        if (!obj.id || !obj.name) return callback("no id or name provided");

        var account = new Account();
        account.id = obj.id;
        account.name = obj.name;

        account.save(callback);
    };

    model.update = function (obj, callback) {
        if (!obj.id || !obj.name) return callback("no id or name provided");

        Account.findOneAndUpdate({ id: obj.id }, obj, callback);
    };

    model.delete = function (id, callback) {
        if (!id) return callback("no id provided");

        Account.findOneAndRemove({ id: id }, callback);
    };

    return model;
};
