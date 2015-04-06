module.exports = function (Account) {
    var model = {};

    model.getAll = function (callback) {
        Account.find(function(err, accounts) {
            callback(err, accounts);
        });
    };

    model.get = function (id, callback) {
        Account.findOne({ id: id }, function (err, account) {
            callback(err, account);
        });
    };

    model.create = function (obj, callback) {
        if (!obj.id || !obj.name) return callback("no id or name provided");

        var account = new Account();
        account.id = obj.id;
        account.name = obj.name;

        account.save(function (err) {
            callback(err);
        });
    };

    model.update = function (obj, callback) {
        if (!obj.id || !obj.name) return callback("no id or name provided");

        Account.findOneAndUpdate({ id: obj.id }, obj, function (err, account) {
            callback(err, account);
        });
    };

    model.delete = function (id, callback) {
        if (!id) return callback("no id provided");

        Account.findOneAndRemove({ id: id }, function (err, account) {
            callback(err, account);
        });
    };

    return model;
};
