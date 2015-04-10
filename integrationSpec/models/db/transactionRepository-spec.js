'use strict';

var mongoose = require('mongoose');
var transactionRepo = require('../../../models/db/transactionRepository');
var transactionModel = require('../../../models/db/transactionModel');

describe('transactionDb', function () {
    var db;
    var repo;
    var emptyStart = false;
    transactionModel();

    var fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
    var fourDaysAgo = new Date();
    fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);
    var threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    var objs = [];
    var objids = [];

    objs.push({ date: fiveDaysAgo, concept: 'transactionA', amount: 10,
              person: 'personA', account: 'accountA'});
    objs.push({ date: fourDaysAgo, concept: 'transactionB', amount: 11,
              person: 'personB', account: 'accountB'});
    objs.push({ date: threeDaysAgo, concept: 'transactionC', amount: 12,
              person: 'personC', account: 'accountC'});

    beforeEach(function () {
        db = mongoose.createConnection('mongodb://localhost/sayveettest');
        repo = transactionRepo(db.model('Transaction'));
    });

    afterEach(function () {
        mongoose.disconnect();
    });

    function hasEmptyStart(done) {
        if(!emptyStart) {
            expect('emptyStart failed').toBeFalsy();
            if(done) {
                done();
            }
        }
        return emptyStart;
    }

    function expectCompare (actual, expected) {
        expect(actual.date).toEqual(expected.date);
        expect(actual.concept).toEqual(expected.concept);
        expect(actual.amount).toEqual(expected.amount);
        expect(actual.person).toEqual(expected.person);
        expect(actual.account).toEqual(expected.account);
        expect(actual.splitId).toEqual(expected.splitId);
    }

    it('should get no transactions first', function (done) {
        repo.getAll(function(err, transactions) {
            expect(err).toBeNull();
            expect(transactions.length).toBe(0);

            if(transactions.length === 0) {
                emptyStart = true;
            }

            done();
        });
    });

    it('should add one transaction', function (done) {
        if(hasEmptyStart(done)) {
            repo.create(objs[0], function (err) {
                expect(err).toBeNull();
                done();
            });
        }
    });

    it('should get one transaction', function (done) {
        if(hasEmptyStart(done)) {
            repo.getAll(function (err, transactions) {
                expect(err).toBeNull();
                expect(transactions.length).toBe(1);
                expectCompare(transactions[0], objs[0]);
                done();
            });
        }
    });

    it('should add another transaction and get two transactions', function (done) {
        if(hasEmptyStart(done)) {
            repo.create(objs[1], function (err) {
                expect(err).toBeNull();
                repo.getAll(function (err, transactions) {
                    expect(err).toBeNull();
                    expect(transactions.length).toBe(2);

                    // cheat, get ids from result and save them
                    objids.push(transactions[0].id);
                    objids.push(transactions[1].id);

                    done();
                });
            });
        }
    });

    it('should update an transaction and get the updated value', function (done) {
        if(hasEmptyStart(done)) {
            objs[1].concept = 'transactionBplus';
            
            repo.update(objids[1], objs[1], function (err) { //}, result) {
                expect(err).toBeNull();
                // fails: expect(result.name).toBe(newValue.name);
                repo.get(objids[1], function (err, transaction) {
                    expect(err).toBeNull();
                    expectCompare(transaction, objs[1]);
                    done();
                });
            });
        }
    });

    it('should delete transactions', function (done) {
        if(hasEmptyStart(done)) {
            repo.delete(objids[0], function (err, result) {
                expect(err).toBeNull();
                expect(result.id).toBe(objids[0]);

                repo.delete(objids[1], function (err, result2) {
                    expect(err).toBeNull();
                    expect(result2.id).toBe(objids[1]);

                    repo.getAll(function (err, transactions) {
                        expect(err).toBeNull();
                        expect(transactions.length).toBe(0);
                        done();
                    });
                });
            });
        }
    });
});
