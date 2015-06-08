require.config({
	baseUrl: '/lib',
	shim: {
		'bootstrap': { 'deps': [ 'jquery' ] }
	},
	paths: {
		'jquery': 'jquery/dist/jquery.min',
		'bootstrap': 'bootstrap/dist/js/bootstrap.min',
		'app': '/javascripts'
	}
});