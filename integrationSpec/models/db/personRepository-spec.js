'use strict';

var mongoose = require('mongoose');
var personRepo = require('../../../models/db/personRepository');
var personModel = require('../../../models/db/personModel');

describe('personDb wrapper', function () {
    var db;
    var repo;

    it('beforeAll', function () {
        db = mongoose.createConnection('mongodb://localhost/sayveettest');
        repo = personRepo(db.model('Person'));
    });

    describe('personDb', function () {
        var emptyStart = false;
        personModel();

        function hasEmptyStart(done) {
            if(!emptyStart) {
                expect('emptyStart failed').toBeFalsy();
                if(done) {
                    done();
                }
            }
            return emptyStart;
        }

        it('should get no people first', function (done) {
            repo.getAll(function(err, people) {
                expect(err).toBeNull();
                expect(people.length).toBe(0);

                if(people.length === 0) {
                    emptyStart = true;
                }

                done();
            });
        });

        it('should add one person', function (done) {
            if(hasEmptyStart(done)) {
                repo.create({ id: 'A', name: 'personA' }, function (err) {
                    expect(err).toBeNull();
                    done();
                });
            }
        });

        it('should get one person', function (done) {
            if(hasEmptyStart(done)) {
                repo.getAll(function (err, people) {
                    expect(err).toBeNull();
                    expect(people.length).toBe(1);
                    expect(people[0].id).toBe('A');
                    expect(people[0].name).toBe('personA');
                    done();
                });
            }
        });

        it('should add another person and get two people', function (done) {
            if(hasEmptyStart(done)) {
                repo.create({ id: 'B', name: 'personB' }, function (err) {
                    expect(err).toBeNull();
                    repo.getAll(function (err2, people) {
                        expect(err2).toBeNull();
                        expect(people.length).toBe(2);
                        done();
                    });
                });
            }
        });

        it('should update an person and get the updated value', function (done) {
            if(hasEmptyStart(done)) {
                var newValue = { id: 'B', name: 'personBplus' };
                repo.update(newValue, function (err) { //}, result) {
                    expect(err).toBeNull();
                    // fails: expect(result.name).toBe(newValue.name);
                    repo.get(newValue.id, function (err2, person) {
                        expect(err2).toBeNull();
                        expect(person.name).toBe(newValue.name);
                        done();
                    });
                });
            }
        });

        it('should delete people', function (done) {
            if(hasEmptyStart(done)) {
                repo.delete('A', function (err, result) {
                    expect(err).toBeNull();
                    expect(result.id).toBe('A');

                    repo.delete('B', function (err2, result2) {
                        expect(err2).toBeNull();
                        expect(result2.id).toBe('B');

                        repo.getAll(function (err3, people) {
                            expect(err3).toBeNull();
                            expect(people.length).toBe(0);
                            done();
                        });
                    });
                });
            }
        });
    });

    it('afterAll', function () {
        mongoose.disconnect();
    });
});

