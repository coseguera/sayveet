/// <reference path="../../../typings/jquery/jquery.d.ts" />
/// <reference path="../../../typings/knockout/knockout.d.ts" />
/// <reference path="../../../typings/underscore/underscore.d.ts" />
/// <reference path="../../../typings/moment/moment.d.ts" />
'use strict';

var $ = require('jquery'),
    ko = require('knockout'),
    _ = require('underscore'),
    moment = require('moment'),
    Chart = require('Chart'),
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

function processDatasetArrays(transactions, aggregates, field, labels) {
    var group = _.groupBy(transactions, field),
        datasets = [],
        start,
        colorIndex = 0,
        color;
    
    for (var idx in group) {
        if(group.hasOwnProperty(idx)) {
            color = getColor(colorIndex++);
            start = _.chain(aggregates).where({ _id: idx }).first().value().value;
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
function reduceSum(memo, t) { return Math.round((memo + t) * 100) / 100; }

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