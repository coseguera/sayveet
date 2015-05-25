/// <reference path="../../typings/knockout/knockout.d.ts"/>
/// <reference path="../../typings/jquery/jquery.d.ts"/>
/*global ko */

'use strict';

var $form = $('#query'),
    $from = $('#from'),
    $by = $('#by'),
    $on = $('#on'),
    url = '/api/transaction',
    peopleUrl = '/api/person',
    accountsUrl = '/api/account';

ko.bindingHandlers.jqCalendar = {
    init: function (element) {
        $(element).datepicker();
    }
};

function Transaction(item, vm) {
    var self = this;
    self.concept = ko.observable(item.concept);
    self.date = ko.observable(item.date);
    self.amount = ko.observable(item.amount);
    self.account = ko.observable(item.account);
    self.person = ko.observable(item.person);
    self.splitId = ko.observable(item.splitId);
    self.personName = ko.computed(function () { return vm.getPersonName(item.person); });
    self.accountName = ko.computed(function () { return vm.getAccountName(item.account); });
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
        var d = new Date(self.date());
        return d ? d.toLocaleDateString() : 'None';
    });
    
    function formatAmount(amount) { return amount ? (amount / 100).toFixed(2) : 'None'; }
}

function AppViewModel() {
    // Data
    var self = this;
    self.transactions = ko.observableArray();
    self.people = ko.observableArray();
    self.accounts = ko.observableArray();
    self.by = '';
    self.on = '';
    
    // Transaction related
    self.processTransactions = function (data) {
        $.getJSON(url, 'aggregates=true&from=' + $from.val(), function (aggregateData) {
            self.processPersonSummaries(aggregateData.personSummaries);
            self.processAccountSummaries(aggregateData.accountSummaries);
            
            self.transactions($.map(data, function (item) {
                self.addToPersonSummaries(item.person, item.amount);
                item.personSummary = self.getPersonSummaries(item.person);
                self.addToAccountSummaries(item.account, item.amount);
                item.accountSummary = self.getAccountSummaries(item.account);
                
                if((!self.by || self.by === item.person) && 
                    (!self.on || self.on === item.account)) {
                    return new Transaction(item, self);
                }
                return;
            }));
        });
    };
    self.queryTransactions = function() {
        var query = $form.serialize();
        self.by = $by.val();
        self.on = $on.val();
        $.getJSON(url, query, self.processTransactions);
    };
    self.queryTransactions();    
    
    // People related
    self.processPersonSummaries = function (summaries) {
        self.personSummaries = {};
        if (summaries) {
            for (var i = 0, len = summaries.length; i < len; i++) {
                var summary = summaries[i];
                self.personSummaries[summary._id] = summary.value;
            }
        }
    };
    self.addToPersonSummaries = function (person, value) {
        if (!self.personSummaries[person]) {
            self.personSummaries[person] = value;
        } else {
            self.personSummaries[person] += value;
        }
    };
    self.getPersonSummaries = function (person) {
        return self.personSummaries[person] ? self.personSummaries[person] : 0;
    };
    self.getPersonName = function(id) {
        return getName(id, self.people());
    };
    self.queryPeople = function () {
        $.getJSON(peopleUrl, self.people);
    };
    self.queryPeople();
    
    // Accounts related
    self.processAccountSummaries = function (summaries) {
        self.accountSummaries = {};
        if (summaries) {
            for (var i = 0, len = summaries.length; i < len; i++) {
                var summary = summaries[i];
                self.accountSummaries[summary._id] = summary.value;
            }
        }
    };
    self.addToAccountSummaries = function (account, value) {
        if (!self.accountSummaries[account]) {
            self.accountSummaries[account] = value;
        } else {
            self.accountSummaries[account] += value;
        }
    };
    self.getAccountSummaries = function (account) {
        return self.accountSummaries[account] ? self.accountSummaries[account] : 0;
    };
    self.getAccountName = function(id) {
        return getName(id, self.accounts());
    };
    self.queryAccounts = function () {
        $.getJSON(accountsUrl, self.accounts);
    };
    self.queryAccounts();

    // helpers
    function getName(id, array) {
        for(var i = 0, len = array.length; i < len; i++) {
            if(array[i].id === id) { return array[i].name; }
        }
        return undefined;
    }
}

var vm = new AppViewModel();
ko.applyBindings(vm);