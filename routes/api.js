//'use strict';
//
//var express = require('express');
//var router = express.Router();
//var mongoose = require('mongoose');
//
//var accountRepository = require('./../models/db/accountRepository');
//var accountModel = require('./../models/db/accountModel');
//var accountRoutes = require('./api/accounts');
//
//var personRepository = require('./../models/db/personRepository');
//var personModel = require('./../models/db/personModel');
//var personRoutes = require('./api/people');
//
//var db = mongoose.createConnection('mongodb://localhost/sayveettestb');
//
//var logger = {
//    error: function (err) {
//        console.error(err);
//    }
//};
//
//accountModel();
//var accountRepo = accountRepository(db.model('Account'));
//var accounts = accountRoutes(accountRepo, logger);
//
//router.get('/account', accounts['/'].get);
//router.post('/account', accounts['/'].post);
//router.get('/account/:id', accounts['/:id'].get);
//router.put('/account/:id', accounts['/:id'].put);
//router.delete('/account/:id', accounts['/:id'].delete);
//
//personModel();
//var personRepo = personRepository(db.model('Person'));
//var people = personRoutes(personRepo, logger);
//
//router.get('/person', people['/'].get);
//router.post('/person', people['/'].post);
//router.get('/person/:id', people['/:id'].get);
//router.put('/person/:id', people['/:id'].put);
//router.delete('/person/:id', people['/:id'].delete);
//
//module.exports = router;
