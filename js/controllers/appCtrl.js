/*global angular */

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the todoStorage service
 * - exposes the model to the template and provides event handlers
 */
angular = require('angular');

angular.module('myApp')
  .controller('AppCtrl', function AppCtrl($http, $timeout, $interval, FlagFactory) {
    'use strict';


    var vm = this;
    vm.loading = 1;
    vm.flags = [];
    vm.randomFlag = {};
    vm.showAnswer = false;

    vm.init = function () {
      vm.loading = 1;
      if (sessionStorage.flags && sessionStorage.flags.length) {
        FlagFactory.RestoreState();
        vm.flags = FlagFactory.flags;
        vm.loading = 0;
      }
      else {
        $http.get('../json/all.json').then(function (data) {
          vm.flags = data && data.data;
          FlagFactory.flags = vm.flags;
          FlagFactory.SaveState();
          vm.loading = 0;
        });
      }
    };
    vm.init();

    vm.toggleShowAnswer = function () {
      vm.showAnswer = !vm.showAnswer;
    };

    vm.randomizeFlag = function () {
      vm.loading = 1;
      $timeout(function () {
        vm.showAnswer = false;
        vm.randomFlag = vm.flags[Math.floor(Math.random() * vm.flags.length)];
        if (vm.randomFlag && vm.randomFlag.code) {
          vm.loading = 0;
        } else {
          vm.randomizeFlag();
        }
      }, 1000);
    };

    vm.autoPlay = function () {
      vm.autoPlayRun = true;
      $interval(function () {
        vm.showAnswer = true;
        $timeout(function () {
          vm.randomizeFlag();
        }, 5000);
      }, 15000);
    };
  });