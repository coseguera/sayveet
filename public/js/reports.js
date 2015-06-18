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
    var data = {},
        dateLimits,
        dateStep;
    
    if($by.val()) {
        transactions = _.where(transactions, { person: $by.val() });
    }
    
    dateLimits = getDateLimits(transactions);
    dateStep = Math.ceil(dateLimits.max.diff(dateLimits.min, 'days') / 30);
    
    data.labels = datesBetween(dateLimits.min, dateLimits.max, dateStep);
    data.datasets = processDatasetArrays(transactions, aggregates.personSummaries, 'person', data.labels);
    
    if (chart) {
        chart.destroy();
    }
    
    chart = new Chart(ctx).Line(data, { responsive: true });
}

function getDateLimits(transactions) {
    var moments = _.map(transactions, function (t) {
        return moment(t.date).startOf('day');
    });
    return { min: _.min(moments), max: _.max(moments) };
}

function processDatasetArrays(transactions, aggregates, field, labels) {
    var group = _.groupBy(transactions, field),
        datasets = [],
        aggregate,
        start,
        colorIndex = 0,
        color;
    
    for (var idx in group) {
        if(group.hasOwnProperty(idx)) {
            color = getColor(colorIndex++);
            aggregate = _.chain(aggregates).where({ _id: idx }).first().value();
            start = aggregate ? aggregate.value : 0;
            datasets.push({ 
                label: idx,
                fillColor: formatString('rgba({0},{1},{2},0.2)', color.r, color.g, color.b),
                strokeColor: formatString('rgba({0},{1},{2},1)', color.r, color.g, color.b),
                pointColor: formatString('rgba({0},{1},{2},1)', color.r, color.g, color.b),
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: formatString('rgba({0},{1},{2},1)', color.r, color.g, color.b),
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
            var day = moment(t.date).startOf('day');
            
            while(labels.indexOf(day.format('MM/DD/YY')) < 0) {
                day = day.add(1, 'days');
            }
            
            return { 
                date: day.format('MM/DD/YY'),
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
function reduceSum(memo, t) { return Math.round((memo + t) * 100) / 100; }

function datesBetween(start, end, step) {
    var result = [],
        m = moment(start);
        
    result.push(m.format('MM/DD/YY'));
    
    while(m.diff(end) < 0) {
        m = moment(m).add(step, 'days');
        result.push(m.format('MM/DD/YY'));
    }
    
    return result;
}

function getColor(idx) {
    var colors = [
        { r: 220, g: 220, b: 220 },
        { r: 223, g: 105, b: 26 },
        { r: 92, g: 184, b: 92 },
        { r: 91, g: 192, b: 222 },
        { r: 240, g: 173, b: 78 }
    ];
    
    return colors[idx % colors.length];
}

function formatString() {
    var str = arguments[0],
        args;
    [].shift.call(arguments);
    args = arguments;
    return str.replace(/{(\d+)}/g, function(match, number) {
        var res = typeof args[number] != 'undefined'
            ? args[number] : match;
        return res;
    });
}
},{"./appViewModel":1}]},{},[3]);
