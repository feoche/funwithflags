/*global angular */
angular = require('angular');

angular.module('myApp')
  .directive('imageOnLoad', function() {
      return {
        restrict: 'A',
        link: function (scope, element) {
          element.bind('load', function () {
            element.addClass('loaded');
          });
        }
      };
    });