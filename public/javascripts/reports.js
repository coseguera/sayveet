require(['jquery', 'chartjs/Chart'], function ($, Chart) {
	var ctx = $('#report-chart').get(0).getContext('2d');
	
	var data = {
		labels: [ 1, 2 ],
		datasets: [
			{
				label: 'first dataset',
				data: [ 3, 4 ]
			}
		]
	};
	
	new Chart(ctx).Line(data, { responsive: true });
});