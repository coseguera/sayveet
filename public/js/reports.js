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
    Chart = (window.Chart),
    AppViewModel = require('./appViewModel'),
    ctx = $('#report-chart').get(0).getContext('2d'),
    chart,
    $by = $('#by');

ko.bindingHandlers.jqCalendar = {
    init: function (element) {
        $(element).datepicker();
    }
};

var vm = new AppViewModel(processTransactions);
ko.applyBindings(vm);

function processTransactions(transactions, aggregates) {
    var data = {};
    
    if($by.val()) {
        transactions = _.where(transactions, { person: $by.val() });
    }
    
    data.labels = processDataLabels(transactions);
    data.datasets = processDatasetArrays(transactions, aggregates.personSummaries, 'person', data.labels);
    
    if (chart) {
        chart.destroy();
    }
    
    chart = new Chart(ctx).Line(data, { responsive: true });
}

function processDataLabels(transactions) {
    var moments = _.map(transactions, function (t) {
        return moment(t.date).startOf('day');
    });
    return datesBetween(_.min(moments), _.max(moments));
}

function datesBetween(start, end) {
    var result = [],
        m = moment(start);
        
    result.push(m.format('MM/DD/YY'));
    
    while(!m.isSame(end)) {
        m = moment(m).add(1, 'days');
        result.push(m.format('MM/DD/YY'));
    }
    
    return result;
}

function processDatasetArrays(transactions, aggregates, field, labels) {
    var group = _.groupBy(transactions, field),
        datasets = [],
        start;
    
    for (var idx in group) {
        if(group.hasOwnProperty(idx)) {
            start = _.chain(aggregates).where({ _id: idx }).first().value().value;
            datasets.push({ 
                label: idx,
                data: processEntityData(group[idx], labels, start)
            });
        }
    }
    
    return datasets;
}

function processEntityData(transactions, labels, aggregate) {
    var result = [],
        start = aggregate / 100,
        value,
        map = _.map(transactions, function (t) {
            return { 
                date: moment(t.date).startOf('day').format('MM/DD/YY'),
                amount: t.amount
            };
        });
    
    for (var i = 0, len = labels.length; i < len; i++) {
        value = _.chain(map)
            .where({ date: labels[i] })
            .map(mapToDollarAmount)
            .reduce(reduceSum, start)
            .value();
        
        result.push(value);
        start = value;
    }
    
    return result;
}

function mapToDollarAmount(t) { return t.amount / 100; }
function reduceSum(memo, t) { return memo + t; }
},{"./appViewModel":1}]},{},[3]);
