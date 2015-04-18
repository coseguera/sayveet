'use strict';

module.exports = function (Transaction) {
    var model = {};

    model.getAll = function (callback) {
        Transaction.find(callback);
    };

    model.get = function (id, callback) {
        Transaction.findById(id, callback);
    };

    model.query = function (query, callback) {
        var find = Transaction.find();

        if (query.from) { find.where('date').gt(query.from); }

        if (query.to) { find.where('date').lte(query.to); }

        if (query.date) { find.where('date').equals(query.date); }

        if (query.concept) { find.where('concept').equals(query.concept); }

        if (query.amount) { find.where('amount').equals(query.amount); }

        if (query.person) { find.where('person').equals(query.person); }

        if (query.account) { find.where('account').equals(query.account); }

        if (query.splitId) { find.where('splitId').equals(query.splitId); }

        find
        .sort({ date: 1, splitId: 1 })
        .exec(callback);
    };

    model.create = function (obj, callback) {
        if (!obj.date || !obj.concept || !obj.amount ||
            !obj.person || !obj.account) {
            return callback(
                'no date, concept, amount, person or account provided');
        }

        var t = new Transaction();
        t.date = obj.date;
        t.concept = obj.concept;
        t.amount = obj.amount;
        t.person = obj.person;
        t.account = obj.account;
        
        if(obj.splitId) { t.splitId = obj.splitId; }

        t.save(callback);
    };

    model.update = function (id, obj, callback) {
        if (!id || !obj.date || !obj.concept || 
            !obj.amount || !obj.person || !obj.account) {
            return callback(
                'no id, date, concept, amount, person or account provided');
        }

        Transaction.findByIdAndUpdate(id, obj, callback);
    };

    model.delete = function (id, callback) {
        if (!id) { return callback('no id provided'); }

        Transaction.findByIdAndRemove(id, callback);
    };

    model.aggregate = function (lteDate, field, callback) {
        Transaction.aggregate(
            { $match: { date: { $lte: lteDate } } },
            { $group: { _id: field, value: { $sum: '$amount' } } },
            callback);
    };

    return model;
};
