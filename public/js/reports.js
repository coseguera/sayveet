(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/// <reference path="../../../typings/node/node.d.ts"/>
/// <reference path="../../../typings/jquery/jquery.d.ts" />
/// <reference path="../../../typings/knockout/knockout.d.ts" />
'use strict';

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
'use strict';

var $ = (window.$),
    ko = (window.ko),
    _ = (window._),
    moment = (window.moment),
    AppViewModel = require('./appViewModel'),
    c3 = (window.c3),
    $by = $('#by');

ko.bindingHandlers.jqCalendar = {
    init: function (element) {
        $(element).datepicker();
    }
};

var vm = new AppViewModel(processTransactions);
ko.applyBindings(vm);
vm.queryTransactions();

function processTransactions(transactions, aggregates) {
    var data = $by.val() ? 
                _.where(transactions, { person: $by.val() }) : 
                transactions,
        xlabels = getDateLimits(data),
        columns = processDatasets(data, aggregates.personSummaries, 'person', xlabels);

    xlabels.unshift('x');
    columns.unshift(xlabels);

    c3.generate({
        bindto: '#report-chart',
        data: {
            x: 'x',
            columns: columns
        },
        axis: {
            x: {
                type: 'timeseries',
                tick: {
                    format: '%Y-%m-%d'
                }
            }
        }
    });
}

function getDateLimits(transactions) {
    if (transactions && transactions.length > 0) {
        // transactions are ordered by date
        var min = moment(transactions[0].date).startOf('day');
        var max = moment(transactions[transactions.length - 1].date).startOf('day');
        return datesBetween(min, max);
    }

    return [];

    function datesBetween(start, end) {
        var result = [];
        var m = moment(start);
        result.push(m.format('YYYY-MM-DD'));
    
        while (m.diff(end) < 0) {
            m = moment(m).add(1, 'days');
            result.push(m.format('YYYY-MM-DD'));
        }
    
        return result;
    }
}

function processDatasets(transactions, aggregates, field, labels) {
    var arr = [],
        group = _.groupBy(transactions, field);

    for (var idx in group) {
        if (group.hasOwnProperty(idx)) {
            var aggregate = findAggregateById(aggregates, idx);
            var start = aggregate ? aggregate.value : 0;
            var dataArr = processEntityData(group[idx], start, labels);
            dataArr.unshift(idx);
            arr.push(dataArr);
        }
    }

    return arr;

    function findAggregateById(aggregates, id) {
        return _.find(aggregates, function (t) {
            return t._id === id;
        });
    }
}

function processEntityData(transactions, aggregate, labels) {
    var start = aggregate / 100;
    var result = [];
    var value;
    
    var j = 0;
    var jlen = transactions.length;

    for (var i = 0, len = labels.length; i < len; i++) {
        if (j === jlen) { break; }
        
        value = start;
        
        while (transactions[j] && transactions[j].date.startsWith(labels[i])) {
            value = reduceSum(value, mapToDollarAmount(transactions[j]));
            j++;
        }
        
        result.push(value);
        start = value;
    }
    
    return result;
    
    function mapToDollarAmount(t) { return t.amount / 100; }
    function reduceSum(memo, t) { return Math.round((memo + t) * 100) / 100; }
}
},{"./appViewModel":1}]},{},[3]);
