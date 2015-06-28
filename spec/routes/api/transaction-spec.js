'use strict';

var routes = require('../../../routes/api/transaction');
var repositoryMock = require('../../mocks/repositoryMock');
var loggerMock = require('../../mocks/loggerMock');
var responseMock = require('../../mocks/responseMock');

describe('transaction routes', function () {
    var resMock;

    beforeEach(function () {
        resMock = responseMock();
        spyOn(resMock, 'sendStatus');
        spyOn(resMock, 'json');
    });

    describe('index METHOD: POST', function () {
        it('creates a transaction', function () {
            var repoMock = repositoryMock();
            repoMock.err = 0;

            var reqMock = {
                body: {
                    date: '04/14/2015',
                    concept: 'concept',
                    amount: 100,
                    person: 'person',
                    account: 'account',
                    splitId: 'splitId'
                }
            };

            var obj = routes(repoMock, loggerMock);

            obj['/'].post(reqMock, resMock);

            expect(resMock.sendStatus).toHaveBeenCalledWith(200);
        });

        it('returns 500 if there is an error', function () {
            var repoMock = repositoryMock();
            repoMock.err = 1;

            var reqMock = {
                body: {
                    date: '04/14/2015',
                    concept: 'concept',
                    amount: 100,
                    person: 'person',
                    account: 'account',
                    splitId: 'splitId'
                }
            };

            var obj = routes(repoMock, loggerMock);

            obj['/'].post(reqMock, resMock);

            expect(resMock.sendStatus).toHaveBeenCalledWith(500);
        });

        it('returns 400 if no date is provided', function () {
            var repoMock = repositoryMock();
            repoMock.err = 1;

            var reqMock = {
                body: { // note there is no date
                    concept: 'concept',
                    amount: 100,
                    person: 'person',
                    account: 'account',
                    splitId: 'splitId'
                }
            };

            var obj = routes(repoMock, loggerMock);

            obj['/'].post(reqMock, resMock);

            expect(resMock.sendStatus).toHaveBeenCalledWith(400);
        });

        it('returns 400 if an invalid date is provided', function () {
            var repoMock = repositoryMock();
            repoMock.err = 0;
            repoMock.result = 1;

            var reqMock = {
                body: {
                    date: 'date', // note date is not a valid date
                    concept: 'concept',
                    amount: 100,
                    person: 'person',
                    account: 'account',
                    splitId: 'splitId'
                }
            };

            var obj = routes(repoMock, loggerMock);

            obj['/'].post(reqMock, resMock);

            expect(resMock.sendStatus).toHaveBeenCalledWith(400);
        });

        it('returns 400 if an invalid amount is provided', function () {
            var repoMock = repositoryMock();
            repoMock.err = 0;
            repoMock.result = 1;

            var reqMock = {
                body: {
                    date: '04/14/2015',
                    concept: 'concept',
                    amount: 'amount', // note amount is not a valid number
                    person: 'person',
                    account: 'account',
                    splitId: 'splitId'
                }
            };

            var obj = routes(repoMock, loggerMock);

            obj['/'].post(reqMock, resMock);

            expect(resMock.sendStatus).toHaveBeenCalledWith(400);
        });
    });

    describe(':id METHOD: GET', function () {
        it('returns transaction from repo', function () {
            var repoMock = repositoryMock();
            repoMock.err = 0;
            repoMock.result = 2;

            var reqMock = {
                params: { id: 'id' }
            };

            var obj = routes(repoMock, loggerMock);

            obj['/:id'].get(reqMock, resMock);

            expect(resMock.json).toHaveBeenCalledWith(repoMock.result);
        });

        it('returns 500 if there is an error', function () {
            var repoMock = repositoryMock();
            repoMock.err = 1;

            var reqMock = {
                params: { id: 'id' }
            };

            var obj = routes(repoMock, loggerMock);

            obj['/:id'].get(reqMock, resMock);

            expect(resMock.sendStatus).toHaveBeenCalledWith(500);
            expect(resMock.json).not.toHaveBeenCalled();
        });

        it('returns 404 if id is not present', function () {
            var repoMock = repositoryMock();
            repoMock.err = 0;
            repoMock.result = 0;

            var reqMock = {
                params: { id: 'id' }
            };

            var obj = routes(repoMock, loggerMock);

            obj['/:id'].get(reqMock, resMock);

            expect(resMock.sendStatus).toHaveBeenCalledWith(404);
            expect(resMock.json).not.toHaveBeenCalled();
        });
    });

    describe(':id METHOD: PUT', function () {
        it('updates a transaction in repo', function () {
            var repoMock = repositoryMock();

            repoMock.update = function (id, obj, callback) {
                callback(this.err, this.result);
            };

            repoMock.err = 0;
            repoMock.result = 1;

            var reqMock = {
                params: { id: 'id' },
                body: {
                    date: '04/14/2015',
                    concept: 'concept',
                    amount: 100,
                    person: 'person',
                    account: 'account',
                    splitId: 'splitId'
                }
            };

            var obj = routes(repoMock, loggerMock);

            obj['/:id'].put(reqMock, resMock);

            expect(resMock.sendStatus).toHaveBeenCalledWith(200);
        });

        it('returns 500 if there is an error', function () {
            var repoMock = repositoryMock();

            repoMock.update = function (id, obj, callback) {
                callback(this.err, this.result);
            };

            repoMock.err = 1;

            var reqMock = {
                params: { id: 'id' },
                body: {
                    date: '04/14/2015',
                    concept: 'concept',
                    amount: 100,
                    person: 'person',
                    account: 'account',
                    splitId: 'splitId'
                }
            };

            var obj = routes(repoMock, loggerMock);

            obj['/:id'].put(reqMock, resMock);

            expect(resMock.sendStatus).toHaveBeenCalledWith(500);
        });

        it('returns 404 if transaction doesnt exist', function () {
            var repoMock = repositoryMock();

            repoMock.update = function (id, obj, callback) {
                callback(this.err, this.result);
            };

            repoMock.err = 0;
            repoMock.result = 0;

            var reqMock = {
                params: { id: 'id' },
                body: {
                    date: '04/14/2015',
                    concept: 'concept',
                    amount: 100,
                    person: 'person',
                    account: 'account',
                    splitId: 'splitId'
                }
            };

            var obj = routes(repoMock, loggerMock);

            obj['/:id'].put(reqMock, resMock);

            expect(resMock.sendStatus).toHaveBeenCalledWith(404);
        });

        it('returns 400 if no date is provided', function () {
            var repoMock = repositoryMock();

            repoMock.update = function (id, obj, callback) {
                callback(this.err, this.result);
            };

            repoMock.err = 0;
            repoMock.result = 1;

            var reqMock = {
                params: { id: 'id' },
                body: { // note there is no date
                    concept: 'concept',
                    amount: 100,
                    person: 'person',
                    account: 'account',
                    splitId: 'splitId'
                }
            };

            var obj = routes(repoMock, loggerMock);

            obj['/:id'].put(reqMock, resMock);

            expect(resMock.sendStatus).toHaveBeenCalledWith(400);
        });

        it('returns 400 if an invalid date is provided', function () {
            var repoMock = repositoryMock();

            repoMock.update = function (id, obj, callback) {
                callback(this.err, this.result);
            };

            repoMock.err = 0;
            repoMock.result = 1;

            var reqMock = {
                params: { id: 'id' },
                body: {
                    date: 'date', // note date is not a valid date
                    concept: 'concept',
                    amount: 100,
                    person: 'person',
                    account: 'account',
                    splitId: 'splitId'
                }
            };

            var obj = routes(repoMock, loggerMock);

            obj['/:id'].put(reqMock, resMock);

            expect(resMock.sendStatus).toHaveBeenCalledWith(400);
        });

        it('returns 400 if an invalid amount is provided', function () {
            var repoMock = repositoryMock();

            repoMock.update = function (id, obj, callback) {
                callback(this.err, this.result);
            };

            repoMock.err = 0;
            repoMock.result = 1;

            var reqMock = {
                params: { id: 'id' },
                body: {
                    date: '04/14/2015',
                    concept: 'concept',
                    amount: 'amount', // note amount is not a valid number
                    person: 'person',
                    account: 'account',
                    splitId: 'splitId'
                }
            };

            var obj = routes(repoMock, loggerMock);

            obj['/:id'].put(reqMock, resMock);

            expect(resMock.sendStatus).toHaveBeenCalledWith(400);
        });
    });

    describe(':id METHOD: DELETE', function () {
        it('deletes a transaction in repo', function () {
            var repoMock = repositoryMock();
            repoMock.err = 0;
            repoMock.result = 1;

            var reqMock = {
                params: { id: 'id' }
            };

            var obj = routes(repoMock, loggerMock);

            obj['/:id'].delete(reqMock, resMock);

            expect(resMock.sendStatus).toHaveBeenCalledWith(200);
        });

        it('returns 500 if there is an error', function () {
            var repoMock = repositoryMock();
            repoMock.err = 1;

            var reqMock = {
                params: { id: 'id' }
            };

            var obj = routes(repoMock, loggerMock);

            obj['/:id'].delete(reqMock, resMock);

            expect(resMock.sendStatus).toHaveBeenCalledWith(500);
        });

        it('returns 404 if account doesnt exist', function () {
            var repoMock = repositoryMock();
            repoMock.err = 0;
            repoMock.result = 0;

            var reqMock = {
                params: { id: 'id' }
            };

            var obj = routes(repoMock, loggerMock);

            obj['/:id'].delete(reqMock, resMock);

            expect(resMock.sendStatus).toHaveBeenCalledWith(404);
        });
    });
});
