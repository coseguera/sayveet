'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var logger = require('./../helpers/logger');

var db = mongoose.createConnection('mongodb://localhost/sayveettestb');

var entities = [ 
    { name: 'account', model: 'Account' }, 
    { name: 'person', model: 'Person' }, 
    { name: 'transaction', model: 'Transaction' } 
];

for (var i in entities) {
    if (entities.hasOwnProperty(i)) {
        var entity = entities[i];
        var repoFn = require('./../models/db/' + entity.name + 'Repository');
        var modelFn = require('./../models/db/' + entity.name + 'Model');
        var routeFn = require('./api/' + entity.name);
    
        modelFn();
        var repo = repoFn(db.model(entity.model));
        var routes = routeFn(repo, logger);
    
        for (var key in routes) {
            if (routes.hasOwnProperty(key)) {
                for (var method in routes[key]) {
                    if (routes[key].hasOwnProperty(method)) {
                        router[method]('/' + entity.name + key, 
                                       routes[key][method]);

                        logger.log('activated ' + entity.name + key +
                                   ' ' + method + ' route');
                    }
                }
            }
        }
    }
}

module.exports = router;
