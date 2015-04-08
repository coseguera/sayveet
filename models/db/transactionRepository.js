module.exports = function (Transaction) {
    var model = {};

    model.getAll = function (callback) {
        Transaction.find(callback);
    };

    model.get = function (id, callback) {
        Transaction.findById(id, callback);
    };

    model.query = function (query, callback) {
        var result = {};
        var find = Transaction.find();

        if (query.from) find.where("date").gt(query.from);

        if (query.to) find.where("date").lte(query.to);

        find
        .sort({ date: 1, splitId: 1 })
        .exec(callback);
    };

    model.create = function (obj, callback) {
        if (!obj.date || !obj.concept || !obj.amount ||
            !obj.person || !obj.account) {
            return 
            callback("no date, concept, amount, person or account provided");
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
            return 
            callback(
                "no id, date, concept, amount, person or account provided");
        }

        Transaction.findByIdAndUpdate(id, obj, callback);
    };

    model.delete = function (id, callback) {
        if (!id) return callback("no id provided");

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
