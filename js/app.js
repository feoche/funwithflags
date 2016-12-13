/*global angular */
angular = require('angular');
require('angular-route');

angular.module('myApp', ['ngRoute'])
	.config(function ($routeProvider) {
		'use strict';

		var routeConfig = {
			controller: 'AppCtrl as vm',
			templateUrl: './partials/app-index.html'
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