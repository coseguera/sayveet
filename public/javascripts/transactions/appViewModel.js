/// <reference path="../../../typings/node/node.d.ts"/>
/// <reference path="../../../typings/jquery/jquery.d.ts" />
/// <reference path="../../../typings/knockout/knockout.d.ts" />
'use strict';

var ko = require('knockout'),
    $ = require('jquery'),
    config = require('./config'),
    $form = $('#query'),
    $from = $('#from');

module.exports = function (processTransactionsCallback) {
    var self = this;
    self.people = ko.observableArray();
    self.accounts = ko.observableArray();
    
    self.processTransactions = function (transactions) {
        $.getJSON(config.url.transactions, 'aggregates=true&from=' + $from.val(), function (aggregateData) {
            processTransactionsCallback(transactions, aggregateData);
        });
    };
    
    self.queryTransactions = function () {
        $.getJSON(config.url.transactions, $form.serialize(), self.processTransactions);
    };
    
    $.getJSON(config.url.people, self.people);
    $.getJSON(config.url.accounts, self.accounts);
};