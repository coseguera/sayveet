//'use strict';
//
//var express = require('express');
//var router = express.Router();
//var mongoose = require('mongoose');
//var accountRepository = require('./../models/db/accountRepository');
//var accountModel = require('./../models/db/accountModel');
//var accountRoutes = require('./api/accounts');
//
//var db = mongoose.createConnection('mongodb://localhost/sayveettestb');
//
//accountModel();
//var accountRepo = accountRepository(db.model('Account'));
//
//var logger = {
//    error: function (err) {
//        console.error(err);
//    }
//};
//
//var accounts = accountRoutes(accountRepo, logger);
//
//router.get('/account', accounts['/'].get);
//router.post('/account', accounts['/'].post);
//
//router.get('/account/:id', accounts['/:id'].get);
//router.put('/account/:id', accounts['/:id'].put);
//router.delete('/account/:id', accounts['/:id'].delete);
//
//module.exports = router;
