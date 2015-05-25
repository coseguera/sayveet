/// <reference path="../../../typings/jasmine/jasmine.d.ts"/>
'use strict';

var inArgs = require('./../../../util/helpers/inArgs');

describe('inArgs', function () {
    it('should be valid with db, amountin and file', function () {
        // using this file name to mock a valid file name with path
        var args = ['--silent', '--db', 'dbName', '--amountin', 'cents', '--file', __filename];

        var result = inArgs(args);

        expect(result.valid).toBe(true);
    });

    it('should not be valid with no file', function () {
        var args = ['--silent', '--db', 'dbName', '--amountin', 'cents'];

        var result = inArgs(args);

        expect(result.valid).toBe(false);
    });

    it('should not be valid with no file name', function () {
        var args = ['--silent', '--db', 'dbName', '--amountin', 'cents', '--file'];

        var result = inArgs(args);

        expect(result.valid).toBe(false);
    });

    it('should not be valid with no db', function () {
        // using this file name to mock a valid file name with path
        var args = ['--silent', '--file', __filename, '--amountin', 'cents'];

        var result = inArgs(args);

        expect(result.valid).toBe(false);
    });

    it('should not be valid with no db name', function () {
        // using this file name to mock a valid file name with path
        var args = ['--silent', '--db', '--file', __filename, '--amountin', 'cents'];

        var result = inArgs(args);

        expect(result.valid).toBe(false);
    });

    it('should not be valid with no amountin', function () {
        // using this file name to mock a valid file name with path
        var args = ['--silent', '--db', 'dbName', '--file', __filename];

        var result = inArgs(args);

        expect(result.valid).toBe(false);
    });

    it('should not be valid with no amountin value', function () {
        // using this file name to mock a valid file name with path
        var args = ['--silent', '--db', 'dbName', '--amountin', '--file', __filename];

        var result = inArgs(args);

        expect(result.valid).toBe(false);
    });

    it('should not be valid with no mongoInstance name', function () {
        // using this file name to mock a valid file name with path
        var args = ['--silent', '--db', 'dbName', '--file', __filename, '--amountin', 'cents', '--instance'];

        var result = inArgs(args);

        expect(result.valid).toBe(false);
    });
});
