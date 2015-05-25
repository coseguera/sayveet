'use strict';

var express = require('express');
var router = express.Router();

/* GET transactions page */
router.get('/', function (req, res) {
    res.render('transactions', {
        title: 'SayVeet Transactions',
        message: 'The transactions page to be built',
        styles: ['/lib/bootstrap-datepicker/dist/css/bootstrap-datepicker3.css'],
        scripts: [
            '/lib/knockout/dist/knockout.js',
            '/lib/bootstrap-datepicker/dist/js/bootstrap-datepicker.js',
            '/lib/sammy/lib/sammy.js',
            '/javascripts/transactions.js'
        ],
        page: { transactions: true }
    });
});

module.exports = router;