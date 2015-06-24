'use strict';

var express = require('express');
var router = express.Router();

/* GET transactions page */
router.get('/', function (req, res) {
    res.render('transaction/transactions', {
        title: 'SayVeet Transactions',
        message: 'The transactions page to be built',
        styles: ['/lib/bootstrap-datepicker/dist/css/bootstrap-datepicker3.css'],
        scripts: [
            '/lib/knockout/dist/knockout.js',
            '/lib/underscore/underscore.js',
            '/lib/moment/moment.js',
            '/lib/bootstrap-datepicker/dist/js/bootstrap-datepicker.js',
            '/js/transactions.js'
        ],
        page: { transactions: true }
    });
})
/* GET reports page */
.get('/reports', function (req, res) {
    res.render('transaction/reports', {
        title: 'SayVeet Reports',
        styles: [
            '/lib/bootstrap-datepicker/dist/css/bootstrap-datepicker3.css',
            '/lib/c3/c3.css'
        ],
        scripts: [
            '/lib/knockout/dist/knockout.js',
            '/lib/underscore/underscore.js',
            '/lib/moment/moment.js',
            '/lib/d3/d3.js',
            '/lib/c3/c3.js',
            '/lib/bootstrap-datepicker/dist/js/bootstrap-datepicker.js',
            '/js/reports.js'
        ],
        page: { transactionReports: true }
    });
});

module.exports = router;