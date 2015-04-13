'use strict';

var repo = require('../../../models/db/transactionRepository');
var mocks = require('./../../mocks/crudMocks');

var observer = { callback: function () { } };

describe('get all', function () {
    it('should call callback with results', function () {
        var cMock = mocks.crudMock();
        cMock.err = 1;
        cMock.result = 2;

        spyOn(observer, 'callback');

        var db = repo(cMock);

        db.getAll(observer.callback);

        expect(observer.callback)
        .toHaveBeenCalledWith(
            cMock.err,
            cMock.result);
    });
});

describe('get one', function () {
    it('should call callback with result', function () {
        var cMock = mocks.crudMock();
        cMock.err = 1;
        cMock.result = 2;

        var id = 'id';

        spyOn(observer, 'callback');

        var db = repo(cMock);

        db.get(id, observer.callback);

        expect(observer.callback)
        .toHaveBeenCalledWith(
            cMock.err,
            cMock.result);
    });
});

describe('query', function () {
    it('should call callback with results', function () {
        var cMock = mocks.crudMock();
        cMock.err = 1;
        cMock.result = 2;

        spyOn(observer, 'callback');

        var db = repo(cMock);

        var toDate = new Date();
        var fromDate = toDate.getDate() - 5;

        var query = {
            from: fromDate,
            to: toDate
        };

        db.query(query, observer.callback);

        expect(observer.callback)
        .toHaveBeenCalledWith(
            cMock.err,
            cMock.result);
    });
});

describe('aggregate', function () {
    it('should call callback with results', function () {
        var cMock = mocks.crudMock();
        cMock.err = 1;
        cMock.result = 2;

        spyOn(observer, 'callback');

        var db = repo(cMock);

        var lteDate = new Date();
        var field = 'field';

        db.aggregate(lteDate, field, observer.callback);

        expect(observer.callback)
        .toHaveBeenCalledWith(
            cMock.err,
            cMock.result);
    });
});

describe('create', function () {
    it('should call callback with error', function () {
        var obj = {
            date: 'date',
            concept: 'concept',
            amount: 'amount',
            person: 'person',
            account: 'account',
            splitId: 'splitId'
        };

        spyOn(observer, 'callback');

        var db = repo(mocks.CrudSaveMock);

        db.create(obj, observer.callback);

        expect(observer.callback)
        .toHaveBeenCalledWith('err');
    });
    it('should send custom error if no date is provided', function () {
        var obj = { // note there is no date
            concept: 'concept',
            amount: 'amount',
            person: 'person',
            account: 'account',
            splitId: 'splitId'
        };

        spyOn(observer, 'callback');

        var db = repo(mocks.CrudSaveMock);

        db.create(obj, observer.callback);

        expect(observer.callback)
        .not.toHaveBeenCalledWith('err');
    });
});

describe('update', function () {
    it('should call callback with result', function () {
        var cMock = mocks.crudMock();
        cMock.err = 1;
        cMock.result = 2;

        var id = 'id';

        var obj = {
            date: 'date',
            concept: 'concept',
            amount: 'amount',
            person: 'person',
            account: 'account',
            splitId: 'splitId'
        };

        spyOn(observer, 'callback');

        var db = repo(cMock);

        db.update(id, obj, observer.callback);

        expect(observer.callback)
        .toHaveBeenCalledWith(
            cMock.err,
            cMock.result);
    });
    it('should send custom error if no id is provided', function () {
        var cMock = mocks.crudMock();
        cMock.err = 1;
        cMock.result = 2;

        var id = ''; // note empty id

        var obj = {
            date: 'date',
            concept: 'concept',
            amount: 'amount',
            person: 'person',
            account: 'account',
            splitId: 'splitId'
        };

        spyOn(observer, 'callback');

        var db = repo(cMock);

        db.update(id, obj, observer.callback);

        expect(observer.callback)
        .not.toHaveBeenCalledWith(
            cMock.err,
            cMock.result);
    });
    it('should send custom error if no date is provided', function () {
        var cMock = mocks.crudMock();
        cMock.err = 1;
        cMock.result = 2;

        var id = 'id';

        var obj = { // note there is no date
            concept: 'concept',
            amount: 'amount',
            person: 'person',
            account: 'account',
            splitId: 'splitId'
        };

        spyOn(observer, 'callback');

        var db = repo(cMock);

        db.update(id, obj, observer.callback);

        expect(observer.callback)
        .not.toHaveBeenCalledWith(
            cMock.err,
            cMock.result);
    });
});

describe('delete', function () {
    it('should call callback with result', function () {
        var cMock = mocks.crudMock();
        cMock.err = 1;
        cMock.result = 2;

        var id = 'id';

        spyOn(observer, 'callback');

        var db = repo(cMock);

        db.delete(id, observer.callback);

        expect(observer.callback)
        .toHaveBeenCalledWith(
            cMock.err,
            cMock.result);
    });
    it('should send custom error if no id is provided', function () {
        var cMock = mocks.crudMock();
        cMock.err = 1;
        cMock.result = 2;

        var id = '';

        spyOn(observer, 'callback');

        var db = repo(cMock);

        db.delete(id, observer.callback);

        expect(observer.callback)
        .not.toHaveBeenCalledWith(
            cMock.err,
            cMock.result);
    });
});
