require(['jquery',
    'knockout/dist/knockout',
    'chartjs/Chart',
    'bootstrap-datepicker/dist/js/bootstrap-datepicker'],
    function ($, ko, Chart) {
        var $form = $('#query'),
            $from = $('#from'),
            $by = $('#by'),
            url = '/api/transaction',
            peopleUrl = '/api/person',
            accountsUrl = '/api/account',
            ctx = $('#report-chart').get(0).getContext('2d'),
            chart;

        ko.bindingHandlers.jqCalendar = {
            init: function (element) {
                $(element).datepicker();
            }
        };

        function AppViewModel() {
            // Data
            var self = this;
            self.people = ko.observableArray();
            self.accounts = ko.observableArray();

            // Transaction related
            self.processTransactions = function (transactions) {
                $.getJSON(url, 'aggregates=true&from=' + $from.val(), function (aggregateData) {
                    var data = {};
                    data.labels = processDataLabels(transactions);
                    
                    data.datasets = initDatasetArrays(transactions, aggregateData.personSummaries, 'person', data.labels);
                    
                    // ToDo: optimize this filtering
                    if($by.val()) {
                        data.datasets = [data.datasets[$by.val()]];
                    }
                    
                    if (chart) {
                        chart.destroy();
                    }

                    chart = new Chart(ctx).Line(data, { responsive: true });
                });
            };
            self.queryTransactions = function () {
                $.getJSON(url, $form.serialize(), self.processTransactions);
            };

            // People related
            $.getJSON(peopleUrl, self.people);

            // Accounts related
            $.getJSON(accountsUrl, self.accounts);

            // Helpers
            function processDataLabels(data) {
                var dates = [], minDate, maxDate, val, d;

                for (var i = 0, len = data.length; i < len; i++) {
                    val = data[i];
                    d = new Date(val.date).setHours(0, 0, 0, 0);

                    if (!minDate || d < minDate) { minDate = new Date(d); }

                    if (!maxDate || d > maxDate) { maxDate = new Date(d); }
                }

                dates.push(new Date(minDate).toLocaleDateString());
                while (minDate < maxDate) {
                    minDate.setDate(minDate.getDate() + 1);
                    dates.push(new Date(minDate).toLocaleDateString());
                }

                return dates;
            }

            function initDatasetArrays(data, aggregateData, field, labels) {
                var arr = {}, sum = 0, elemData, val, d, dateString, idx;
                for (var i = 0, len = data.length; i < len; i++) {
                    val = data[i];
                    if (!arr[val[field]]) {
                        arr[val[field]] = {
                            label: val[field],
                            fillColor: "rgba(220,220,220,0.1)",
                            strokeColor: "rgba(220,220,220,1)",
                            pointColor: "rgba(220,220,220,1)",
                            pointStrokeColor: "#fff",
                            pointHighlightFill: "#fff",
                            pointHighlightStroke: "rgba(220,220,220,1)",
                            data: Array.apply(null, new Array(labels.length)).map(Number.prototype.valueOf, 0)
                        };
                    }

                    d = new Date(val.date).setHours(0, 0, 0, 0);
                    dateString = new Date(d).toLocaleDateString();
                    idx = labels.indexOf(dateString);
                    arr[val[field]].data[idx] += val.amount / 100;
                }

                for (var i = 0, len = aggregateData.length; i < len; i++) {
                    arr[aggregateData[i]._id].start = aggregateData[i].value / 100;
                }

                for (var arrIdx in arr) {
                    if (arr.hasOwnProperty(arrIdx)) {
                        sum = arr[arrIdx].start;
                        elemData = arr[arrIdx].data;
                        for (var i = 0, len = elemData.length; i < len; i++) {
                            sum += elemData[i];
                            elemData[i] = sum;
                        }
                    }
                }

                return arr;
            }
        }

        var vm = new AppViewModel();
        ko.applyBindings(vm);
    }
    );