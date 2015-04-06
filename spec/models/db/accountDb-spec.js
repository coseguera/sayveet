var accountDb = require("../../../models/db/accountDb");

var observer = { callback: function () { } };

var crudMock = function () {
    return {
        find: function (callback) {
            callback(this.err, this.result);
        },
        findOne: function (obj, callback) {
            callback(this.err, this.result);
        },
        findOneAndUpdate: function (obj, obj2, callback) {
            callback(this.err, this.result);
        },
        findOneAndRemove: function (obj, callback) {
            callback(this.err, this.result);
        }
    };
};

var CrudSaveMock = function () { };
CrudSaveMock.prototype.save = function (callback) {
    callback(this.err);
};
CrudSaveMock.prototype.err = "err";

describe("get all", function () {
    it("should call callback with results", function () {
        var cMock = crudMock();
        cMock.err = 1;
        cMock.result = 2;

        spyOn(observer, "callback");

        var db = accountDb(cMock);

        db.getAll(observer.callback);

        expect(observer.callback)
        .toHaveBeenCalledWith(
            cMock.err,
            cMock.result);
    });
});

describe("get one", function () {
    it("should call callback with result", function () {
        var cMock = crudMock();
        cMock.err = 1;
        cMock.result = 2;

        var id = "id";

        spyOn(observer, "callback");

        var db = accountDb(cMock);

        db.get(id, observer.callback);

        expect(observer.callback)
        .toHaveBeenCalledWith(
            cMock.err,
            cMock.result);
    });
});

describe("create", function () {
    it("should call callback with error", function () {
        var obj = { id: "id", name: "name" };

        spyOn(observer, "callback");

        var db = accountDb(CrudSaveMock);

        db.create(obj, observer.callback);

        expect(observer.callback)
        .toHaveBeenCalledWith("err");
    });
    it("should send custom error if no id is provided", function () {
        var obj = { name: "name" }; // note there is no id

        spyOn(observer, "callback");

        var db = accountDb(CrudSaveMock);

        db.create(obj, observer.callback);

        expect(observer.callback)
        .not.toHaveBeenCalledWith("err");
    });
    it("should send custom error if no name is provided", function () {
        var obj = { id: "id" }; // note there is no name

        spyOn(observer, "callback");

        var db = accountDb(CrudSaveMock);

        db.create(obj, observer.callback);

        expect(observer.callback)
        .not.toHaveBeenCalledWith("err");
    });
});

describe("update", function () {
    it("should call callback with result", function () {
        var cMock = crudMock();
        cMock.err = 1;
        cMock.result = 2;

        var obj = { id: "id", name: "name" };

        spyOn(observer, "callback");

        var db = accountDb(cMock);

        db.update(obj, observer.callback);

        expect(observer.callback)
        .toHaveBeenCalledWith(
            cMock.err,
            cMock.result);
    });
    it("should send custom error if no id is provided", function () {
        var cMock = crudMock();
        cMock.err = 1;
        cMock.result = 2;

        var obj = { name: "name" }; // note there is no id

        spyOn(observer, "callback");

        var db = accountDb(cMock);

        db.update(obj, observer.callback);

        expect(observer.callback)
        .not.toHaveBeenCalledWith(
            cMock.err,
            cMock.result);
    });
    it("should send custom error if no name is provided", function () {
        var cMock = crudMock();
        cMock.err = 1;
        cMock.result = 2;

        var obj = { id: "id" }; // note there is no name

        spyOn(observer, "callback");

        var db = accountDb(cMock);

        db.update(obj, observer.callback);

        expect(observer.callback)
        .not.toHaveBeenCalledWith(
            cMock.err,
            cMock.result);
    });
});

describe("delete", function () {
    it("should call callback with result", function () {
        var cMock = crudMock();
        cMock.err = 1;
        cMock.result = 2;

        var id = "id";

        spyOn(observer, "callback");

        var db = accountDb(cMock);

        db.delete(id, observer.callback);

        expect(observer.callback)
        .toHaveBeenCalledWith(
            cMock.err,
            cMock.result);
    });
    it("should send custom error if no id is provided", function () {
        var cMock = crudMock();
        cMock.err = 1;
        cMock.result = 2;

        var id = "";

        spyOn(observer, "callback");

        var db = accountDb(cMock);

        db.delete(id, observer.callback);

        expect(observer.callback)
        .not.toHaveBeenCalledWith(
            cMock.err,
            cMock.result);
    });
});

