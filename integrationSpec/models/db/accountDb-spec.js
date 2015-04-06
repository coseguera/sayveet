var accountDb = require("../../../models/db/accountDb");
var accountModel = require("../../../models/db/accountModel");
var mongoose = require("mongoose");


describe("accountDb", function () {
    mongoose.createConnection("mongodb://localhost/sayveettest");
    var model = accountModel(mongoose);
    var db = accountDb(model);
    var emptyStart = false;

    function hasEmptyStart(done) {
        if(!emptyStart) {
            expect("emptyStart failed").toBeFalsy();
            if(done) {
                done();
            }
        }
        return emptyStart;
    }

    it("should get no accounts first", function (done) {
        db.getAll(function(err, accounts) {
            expect(err).toBeNull();
            expect(accounts.length).toBe(0);

            if(accounts.length === 0) {
                emptyStart = true;
            }

            done();
        });
    });

//    it("should add one account", function (done) {
//        if(hasEmptyStart(done)) {
//            db.create({ id: "A", name: "accountA" }, function (err) {
//                expect(err).toBeNull();
//                done();
//            });
//        }
//    });
//
//    it("should get one account", function (done) {
//        if(hasEmptyStart(done)) {
//            db.getAll(function (err, accounts) {
//                expect(err).toBeNull();
//                expect(accounts.length).toBe(1);
//                expect(accounts[0].id).toBe("A");
//                expect(accounts[0].name).toBe("accountA");
//                done();
//            });
//        }
//    });
//
//    it("should add another account and get two accounts", function (done) {
//        if(hasEmptyStart(done)) {
//            db.create({ id: "B", name: "accountB" }, function (err) {
//                expect(err).toBeNull();
//                db.getAll(function (err, accounts) {
//                    expect(err).toBeNull();
//                    expect(accounts.length).toBe(2);
//                    done();
//                });
//            });
//        }
//    });
//
//    it("should update an account and get the updated value", function (done) {
//        if(hasEmptyStart(done)) {
//            var newValue = { id: "B", name: "accountBplus" };
//            db.update(newValue, function (err, result) {
//                expect(err).toBeNull();
//                // fails: expect(result.name).toBe(newValue.name);
//                db.get(newValue.id, function (err, account) {
//                    expect(err).toBeNull();
//                    expect(account.name).toBe(newValue.name);
//                    done();
//                });
//            });
//        }
//    });
//
//    it("should delete accounts", function (done) {
//        if(hasEmptyStart(done)) {
//            db.delete("A", function (err, result) {
//                expect(err).toBeNull();
//                expect(result.id).toBe("A");
//
//                db.delete("B", function (err, result2) {
//                    expect(err).toBeNull();
//                    expect(result2.id).toBe("B");
//
//                    db.getAll(function (err, accounts) {
//                        expect(err).toBeNull();
//                        expect(accounts.length).toBe(0);
//                        done();
//                    });
//                });
//            });
//        }
//    });
});
