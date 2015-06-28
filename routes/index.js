'use strict';

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) { //}, next) {
    res.render('index', {
        title: 'SayVeet Home',
        message: 'Welcome to the site!',
        page: { home: true }
    });
})
/* GET about page */
.get('/about', function (req, res) {
    res.render('index', {
        title: 'SayVeet About',
        message: 'About Sayveet',
        page: { about: true }
    });
});

module.exports = router;
