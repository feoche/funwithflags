/*global angular */
angular = require('angular');
require('angular-route');
require('angular-sanitize');
require('../dist/templateCachePartials');

angular.module('myApp', ['ngRoute', 'ngSanitize', 'myAppPartials'])
	.config(function ($routeProvider) {
		'use strict';

		var routeConfig = {
			controller: 'AppCtrl as vm',
			templateUrl: '/partials/app-index.html'
		};

		$routeProvider
			.when('/', routeConfig)
			.when('/:status', routeConfig)
			.otherwise({
				redirectTo: '/'
			});
	});

require('AppCtrl');
require('FlagFactory');
require('imageOnLoad');