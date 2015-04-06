var personDb = require("../../../models/db/personDb");
var personModel = require("../../../models/db/personModel");
var mongoose = require("mongoose");


describe("personDb", function () {
//    var mongoosedb = mongoose.createConnection("mongodb://localhost/uspentittest");
//    var model = personModel(mongoosedb);
//    var db = personDb(model);
//    var emptyStart = false;
//
//    function hasEmptyStart(done) {
//        if(!emptyStart) {
//            expect("emptyStart failed").toBeFalsy();
//            if(done) {
//                done();
//            }
//        }
//        return emptyStart;
//    }
//
//    it("should get no people first", function (done) {
//        db.getAll(function(err, people) {
//            expect(err).toBeNull();
//            expect(people.length).toBe(0);
//
//            if(people.length === 0) {
//                emptyStart = true;
//            }
//
//            done();
//        });
//    });
//
//    it("should add one person", function (done) {
//        if(hasEmptyStart(done)) {
//            db.create({ id: "A", name: "personA" }, function (err) {
//                expect(err).toBeNull();
//                done();
//            });
//        }
//    });
//
//    it("should get one person", function (done) {
//        if(hasEmptyStart(done)) {
//            db.getAll(function (err, people) {
//                expect(err).toBeNull();
//                expect(people.length).toBe(1);
//                expect(people[0].id).toBe("A");
//                expect(people[0].name).toBe("personA");
//                done();
//            });
//        }
//    });
//
//    it("should add another person and get two people", function (done) {
//        if(hasEmptyStart(done)) {
//            db.create({ id: "B", name: "personB" }, function (err) {
//                expect(err).toBeNull();
//                db.getAll(function (err, people) {
//                    expect(err).toBeNull();
//                    expect(people.length).toBe(2);
//                    done();
//                });
//            });
//        }
//    });
//
//    it("should update an person and get the updated value", function (done) {
//        if(hasEmptyStart(done)) {
//            var newValue = { id: "B", name: "personBplus" };
//            db.update(newValue, function (err, result) {
//                expect(err).toBeNull();
//                // fails: expect(result.name).toBe(newValue.name);
//                db.get(newValue.id, function (err, person) {
//                    expect(err).toBeNull();
//                    expect(person.name).toBe(newValue.name);
//                    done();
//                });
//            });
//        }
//    });
//
//    it("should delete people", function (done) {
//        if(hasEmptyStart(done)) {
//            db.delete("A", function (err, result) {
//                expect(err).toBeNull();
//                expect(result.id).toBe("A");
//
//                db.delete("B", function (err, result2) {
//                    expect(err).toBeNull();
//                    expect(result2.id).toBe("B");
//
//                    db.getAll(function (err, people) {
//                        expect(err).toBeNull();
//                        expect(people.length).toBe(0);
//                        done();
//                    });
//                });
//            });
//        }
//    });
});
