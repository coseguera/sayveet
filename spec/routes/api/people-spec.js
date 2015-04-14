'use strict';

var routes = require('../../../routes/api/people');
var repositoryMock = require('../../mocks/repositoryMock');
var loggerMock = require('../../mocks/loggerMock');
var responseMock = require('../../mocks/responseMock');

describe('person routes', function () {
    var resMock;

    beforeEach(function () {
        resMock = responseMock();
        spyOn(resMock, 'sendStatus');
        spyOn(resMock, 'json');
    });

    describe('index METHOD: GET', function () {
        it('returns all people from repo', function () {
            var repoMock = repositoryMock();
            repoMock.err = 0;
            repoMock.result = 2;

            var obj = routes(repoMock, loggerMock);

            obj['/'].get({}, resMock);

            expect(resMock.json).toHaveBeenCalledWith(repoMock.result);
        });

        it('returns 500 if there is an error', function () {
            var repoMock = repositoryMock();
            repoMock.err = 1;

            var obj = routes(repoMock, loggerMock);

            obj['/'].get({}, resMock);

            expect(resMock.sendStatus).toHaveBeenCalledWith(500);
            expect(resMock.json).not.toHaveBeenCalled();
        });
    });

    describe('index METHOD: POST', function () {
        it('creates a person', function () {
            var repoMock = repositoryMock();
            repoMock.err = 0;

            var reqMock = {
                body: { id: 'id', name: 'name' }
            };

            var obj = routes(repoMock, loggerMock);

            obj['/'].post(reqMock, resMock);

            expect(resMock.sendStatus).toHaveBeenCalledWith(200);
        });

        it('returns 500 if there is an error', function () {
            var repoMock = repositoryMock();
            repoMock.err = 1;

            var reqMock = {
                body: { id: 'id', name: 'name' }
            };

            var obj = routes(repoMock, loggerMock);

            obj['/'].post(reqMock, resMock);

            expect(resMock.sendStatus).toHaveBeenCalledWith(500);
        });

        it('returns 400 if no id is provided', function () {
            var repoMock = repositoryMock();
            repoMock.err = 1;

            var reqMock = { // note there is no id
                body: { name: 'name' }
            };

            var obj = routes(repoMock, loggerMock);

            obj['/'].post(reqMock, resMock);

            expect(resMock.sendStatus).toHaveBeenCalledWith(400);
        });

        it('returns 400 if no name is provided', function () {
            var repoMock = repositoryMock();
            repoMock.err = 1;

            var reqMock = { // note there is no name
                body: { id: 'id' }
            };

            var obj = routes(repoMock, loggerMock);

            obj['/'].post(reqMock, resMock);

            expect(resMock.sendStatus).toHaveBeenCalledWith(400);
        });
    });

    describe(':id METHOD: GET', function () {
        it('returns person from repo', function () {
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

    describe(':id METHOD PUT', function () {
        it('updates a person in repo', function () {
            var repoMock = repositoryMock();
            repoMock.err = 0;
            repoMock.result = 1;

            var reqMock = {
                params: { id: 'id' },
                body: { name: 'name' }
            };

            var obj = routes(repoMock, loggerMock);

            obj['/:id'].put(reqMock, resMock);

            expect(resMock.sendStatus).toHaveBeenCalledWith(200);        
        });

        it('returns 500 if there is an error', function () {
            var repoMock = repositoryMock();
            repoMock.err = 1;

            var reqMock = {
                params: { id: 'id' },
                body: { name: 'name' }
            };

            var obj = routes(repoMock, loggerMock);

            obj['/:id'].put(reqMock, resMock);

            expect(resMock.sendStatus).toHaveBeenCalledWith(500);
        });
 
        it('returns 404 if person doesnt exist', function () {
            var repoMock = repositoryMock();
            repoMock.err = 0;
            repoMock.result = 0;

            var reqMock = {
                params: { id: 'id' },
                body: { name: 'name' }
            };

            var obj = routes(repoMock, loggerMock);

            obj['/:id'].put(reqMock, resMock);

            expect(resMock.sendStatus).toHaveBeenCalledWith(404);
        });
 
        it('returns 400 if no name is provided', function () {
            var repoMock = repositoryMock();
            repoMock.err = 0;
            repoMock.result = 1;

            var reqMock = { // note there is no name
                params: { id: 'id' },
                body: { }
            };

            var obj = routes(repoMock, loggerMock);

            obj['/:id'].put(reqMock, resMock);

            expect(resMock.sendStatus).toHaveBeenCalledWith(400);
        });
   });

    describe(':id METHOD DELETE', function () {
        it('deletes a person in repo', function () {
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
 
        it('returns 404 if person doesnt exist', function () {
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
