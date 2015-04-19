'use strict';

var inArgs = require('./../../../util/helpers/inArgs');

describe('inArgs', function () {
    it('should be valid with db and file', function () {
        // using this file name to mock a valid file name with path
        var args = ['--db', 'dbName', '--file', __filename];

        var result = inArgs(args);

        expect(result.valid).toBe(true);
    });

    it('should not be valid with no file', function () {
        var args = ['--db', 'dbName'];

        var result = inArgs(args);

        expect(result.valid).toBe(false);
    });

    it('should not be valid with no file name', function () {
        var args = ['--db', 'dbName', '--file'];

        var result = inArgs(args);

        expect(result.valid).toBe(false);
    });

    it('should not be valid with no db', function () {
        // using this file name to mock a valid file name with path
        var args = ['--file', __filename];

        var result = inArgs(args);

        expect(result.valid).toBe(false);
    });

    it('should not be valid with no db name', function () {
        // using this file name to mock a valid file name with path
        var args = ['--db', '--file', __filename];

        var result = inArgs(args);

        expect(result.valid).toBe(false);
    });

    it('should not be valid with no mongoInstance name', function () {
        // using this file name to mock a valid file name with path
        var args = ['--db', 'dbName', '--file', __filename, '--instance'];

        var result = inArgs(args);

        expect(result.valid).toBe(false);
    });
});
