'use strict';

var express = require('express');
var router = express.Router();

/* GET transactions page */
router.get('/', function (req, res) {
    res.render('transactions', {
        title: 'SayVeet Transactions',
        message: 'The transactions page to be built',
        styles: ['/lib/bootstrap-datepicker/dist/css/bootstrap-datepicker3.css'],
        script: 'app/transactions',
        page: { transactions: true }
    });
})
/* GET reports page */
.get('/reports', function (req, res) {
    res.render('transaction/reports', {
        title: 'SayVeet Reports',
        styles: ['/lib/bootstrap-datepicker/dist/css/bootstrap-datepicker3.css'],
        scripts: [
            '/lib/knockout/dist/knockout.js',
            '/lib/underscore/underscore.js',
            '/lib/moment/moment.js',
            '/lib/chartjs/Chart.js',
            '/lib/bootstrap-datepicker/dist/js/bootstrap-datepicker.js',
            '/js/reports.js'
        ],
        page: { transactionReports: true }
    });
});

module.exports = router;