'use strict';

var mongoose = require('mongoose');
var accountRepo = require('../../../models/db/accountRepository');
var accountModel = require('../../../models/db/accountModel');

describe('accountDb wrapper', function () {
    var db;
    var repo;

    it('beforeAll', function () {
        db = mongoose.createConnection('mongodb://localhost/sayveettest');
        repo = accountRepo(db.model('Account'));
    });

    describe('accountDb', function () {
        var emptyStart = false;
        accountModel();

        function hasEmptyStart(done) {
            if(!emptyStart) {
                expect('emptyStart failed').toBeFalsy();
                if(done) {
                    done();
                }
            }
            return emptyStart;
        }

        it('should get no accounts first', function (done) {
            repo.getAll(function(err, accounts) {
                expect(err).toBeNull();
                expect(accounts.length).toBe(0);

                if(accounts.length === 0) {
                    emptyStart = true;
                }

                done();
            });
        });

        it('should add one account', function (done) {
            if(hasEmptyStart(done)) {
                repo.create({ id: 'A', name: 'accountA' }, function (err) {
                    expect(err).toBeNull();
                    done();
                });
            }
        });

        it('should get one account', function (done) {
            if(hasEmptyStart(done)) {
                repo.getAll(function (err, accounts) {
                    expect(err).toBeNull();
                    expect(accounts.length).toBe(1);
                    expect(accounts[0].id).toBe('A');
                    expect(accounts[0].name).toBe('accountA');
                    done();
                });
            }
        });

        it('should add another account and get two accounts', function (done) {
            if(hasEmptyStart(done)) {
                repo.create({ id: 'B', name: 'accountB' }, function (err) {
                    expect(err).toBeNull();
                    repo.getAll(function (err2, accounts) {
                        expect(err2).toBeNull();
                        expect(accounts.length).toBe(2);
                        done();
                    });
                });
            }
        });

        it('should update an account and get the updated value', function (done) {
            if(hasEmptyStart(done)) {
                var newValue = { id: 'B', name: 'accountBplus' };
                repo.update(newValue, function (err) { //}, result) {
                    expect(err).toBeNull();
                    // fails: expect(result.name).toBe(newValue.name);
                    repo.get(newValue.id, function (err2, account) {
                        expect(err2).toBeNull();
                        expect(account.name).toBe(newValue.name);
                        done();
                    });
                });
            }
        });

        it('should delete accounts', function (done) {
            if(hasEmptyStart(done)) {
                repo.delete('A', function (err, result) {
                    expect(err).toBeNull();
                    expect(result.id).toBe('A');

                    repo.delete('B', function (err2, result2) {
                        expect(err2).toBeNull();
                        expect(result2.id).toBe('B');

                        repo.getAll(function (err3, accounts) {
                            expect(err3).toBeNull();
                            expect(accounts.length).toBe(0);
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
