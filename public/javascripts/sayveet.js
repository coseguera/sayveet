require(['/javascripts/require-config.js'], function () {
	require(['jquery', 'bootstrap'], function ($) {
		var $script = $('#require');
		if($script.data('load')) {
			require([$script.data('load')]);
		}
	});
});