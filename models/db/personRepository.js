'use strict';

module.exports = function (Person) {
    var model = {};

    model.getAll = function (callback) {
        Person.find(function(err, people) {
            callback(err, people);
        });
    };

    model.get = function (id, callback) {
        Person.findOne({ id: id }, function (err, person) {
            callback(err, person);
        });
    };

    model.create = function (obj, callback) {
        if (!obj.id || !obj.name) { 
            return callback('no id or name provided');
        }

        var person = new Person();
        person.id = obj.id;
        person.name = obj.name;

        person.save(function (err) {
            callback(err);
        });
    };

    model.update = function (obj, callback) {
        if (!obj.id || !obj.name) { 
            return callback('no id or name provided');
        }

        Person.findOneAndUpdate({ id: obj.id }, obj, function (err, person) {
            callback(err, person);
        });
    };

    model.delete = function (id, callback) {
        if (!id) {
            return callback('no id provided');
        }

        Person.findOneAndRemove({ id: id }, function (err, person) {
            callback(err, person);
        });
    };

    return model;
};
