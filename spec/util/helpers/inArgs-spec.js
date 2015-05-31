/// <reference path="../../../typings/node/node.d.ts"/>
/// <reference path="../../../typings/jasmine/jasmine.d.ts"/>
'use strict';

var inArgsPath = './../../../util/helpers/inArgs',
    inArgs;

describe('inArgs', function () {
    beforeEach(function () {
        inArgs = require(inArgsPath);
    });
    
    afterEach(function () {
        // had to un-require commander to be able to test the logic
        // and that means I have to un-require inArgs too
        delete require.cache[require.resolve(inArgsPath)];
        delete require.cache[require.resolve('commander')];
    });
    
    it('should be valid with db and file', function () {
        // using this file name to mock a valid file name with path
        var args = ['node', 'test', '--db', 'dbName', '--file', __filename, '--silent'];
        
        var result = inArgs(args);
        
        expect(result).toBeTruthy();
        expect(result.instance).toBeTruthy();
    });
    
    it('should be valid with db, file and instance', function () {
        // using this file name to mock a valid file name with path
        var args = ['node', 'test', '--db', 'dbName', '--file', __filename, '--instance', 'instanceName', '--silent'];
        
        var result = inArgs(args);
        
        expect(result).toBeTruthy();
        expect(result.instance).toBe('instanceName');
    });
    
    it('should not be valid with no db', function () {
        // using this file name to mock a valid file name with path
        var args = ['node', 'test', '--file', __filename, '--silent'];
        
        var result = inArgs(args);
        
        expect(result).toBeFalsy();
    });
    
    it('should not be valid with no filename', function () {
        var args = ['node', 'test', '--db', 'dbName', '--silent'];
        
        var result = inArgs(args);
        
        expect(result).toBeFalsy();
    });
    
    it('should not be valid with invalid filename', function () {
        var args = ['node', 'test', '--db', 'dbName', '--file', 'notValid', '--silent'];
        
        var result = inArgs(args);
        
        expect(result).toBeFalsy();
    });
    
    it('should not be valid if filename is a directory', function () {
        var args = ['node', 'test', '--db', 'dbName', '--file', '/', '--silent'];
        
        var result = inArgs(args);
        
        expect(result).toBeFalsy();
    });
    
    it('with options should be valid with db, file and amountin', function () {
        // using this file name to mock a valid file name with path
        var args = ['node', 'test', '--db', 'dbName', '--file', __filename, '--amountin', 'cents', '--silent'];
        
        var result = inArgs(args, { amountin: true });
        
        expect(result).toBeTruthy();
    });
    
    it('with options should not be valid with no amountin', function () {
        // using this file name to mock a valid file name with path
        var args = ['node', 'test', '--db', 'dbName', '--file', __filename, '--silent'];
        
        var result = inArgs(args, { amountin: true });
        
        expect(result).toBeFalsy();
    });
    
    it('with options should not be valid with no valid amountin', function () {
        // using this file name to mock a valid file name with path
        var args = ['node', 'test', '--db', 'dbName', '--file', __filename, '--amountin', 'notValid', '--silent'];
        
        var result = inArgs(args, { amountin: true });
        
        expect(result).toBeFalsy();
    });
});
