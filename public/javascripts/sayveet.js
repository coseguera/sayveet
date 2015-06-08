require.config({
	shim: {
		'bootstrap': { 'deps': [ 'jquery' ] }
	},
	paths: {
		'jquery': '/lib/jquery/dist/jquery.min',
		'bootstrap': '/lib/bootstrap/dist/js/bootstrap.min'
	}
});

require(['jquery', 'bootstrap'], function ($) { });