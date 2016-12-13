/*global angular */
angular = require('angular');

angular.module('myApp')
  .factory('FlagFactory', function FlagFactory() {
    'use strict';
    var service = {
      flags: [],

      SaveState: function () {
        sessionStorage.flags = angular.toJson(service.flags);
      },

      RestoreState: function () {
        service.flags = angular.fromJson(sessionStorage.flags);
      }
    };

    return service;
  });
