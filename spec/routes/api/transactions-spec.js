'use strict';

var routes = require('../../../routes/api/transactions');
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

    describe(':id METHOD DELETE', function () {
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
