(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/// <reference path="../../../typings/node/node.d.ts"/>
/// <reference path="../../../typings/jquery/jquery.d.ts" />
/// <reference path="../../../typings/knockout/knockout.d.ts" />

var ko = (window.ko),
    $ = (window.$),
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
},{"./config":2}],2:[function(require,module,exports){
module.exports = {
    'url': {
        'transactions': '/api/transaction',
        'people': '/api/person',
        'accounts': '/api/account'
    }
};
},{}],3:[function(require,module,exports){
/// <reference path="../../../typings/jquery/jquery.d.ts" />
/// <reference path="../../../typings/knockout/knockout.d.ts" />
/// <reference path="../../../typings/underscore/underscore.d.ts" />
/// <reference path="../../../typings/moment/moment.d.ts" />

var $ = (window.$),
    ko = (window.ko),
    _ = (window._),
    moment = (window.moment),
    AppViewModel = require('./appViewModel'),
    $by = $('#by'),
    $on = $('#on');

ko.bindingHandlers.jqCalendar = {
    init: function (element) {
        $(element).datepicker();
    }
};

var vm = new AppViewModel(processTransactions);
vm.transactions = ko.observableArray();

ko.applyBindings(vm);

function processTransactions(transactions, aggregates) {
    var personSummaries = processSummaries(aggregates.personSummaries),
        accountSummaries = processSummaries(aggregates.accountSummaries),
        by = $by.val(),
        on = $on.val();
    
    _.each(transactions, function (t) {
        personSummaries[t.person] += t.amount;
        t.personSummary = personSummaries[t.person];
        
        accountSummaries[t.account] += t.amount;
        t.accountSummary = accountSummaries[t.account];
    });
    
    if(by) {
        transactions = _.filter(transactions, function (t) { return t.person === by; });
    }
    
    if(on) {
        transactions = _.filter(transactions, function (t) { return t.account === on; });
    }
    
    vm.transactions(_.map(transactions, function (t) {
        return new Transaction(t, vm);
    }));
}

function processSummaries(summaries) {
    var result = {};
    for (var i = 0, len = summaries.length; i < len; i++) {
        var summary = summaries[i];
        result[summary._id] = summary.value;
    }
    return result;
}

function getName(arr, id) {
    return _.find(arr, function (p) {
        return p.id === id;
    }).name;
}

function Transaction(item, vm) {
    var self = this;
    self.concept = ko.observable(item.concept);
    self.date = ko.observable(item.date);
    self.amount = ko.observable(item.amount);
    self.account = ko.observable(item.account);
    self.person = ko.observable(item.person);
    self.splitId = ko.observable(item.splitId);
    self.personName =  ko.computed(function () { return getName(vm.people(), item.person); });
    self.accountName = ko.computed(function () { return getName(vm.accounts(), item.account); });
    self.isSplit = ko.computed(function () { return item.splitId ? 'x' : ''; });
    
    self.formattedAmount = ko.computed(function () {
        return formatAmount(item.amount);
    });
    self.formattedPersonSummary = ko.computed(function() {
        return formatAmount(item.personSummary);
    });
    self.formattedAccountSummary = ko.computed(function() {
        return formatAmount(item.accountSummary);
    });
    self.formattedDate = ko.computed(function () {
        return moment(self.date()).format('MM/DD/YY');
    });
    
    function formatAmount(amount) { return amount ? (amount / 100).toFixed(2) : 'None'; }
}
},{"./appViewModel":1}]},{},[3]);
