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

      var AUTOPLAY_TIMER = 15000,
        ANSWER_TIMER = 5000;

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
        if (!vm.autoPlayRun) {
          vm.showAnswer = !vm.showAnswer;
        }
      };

      vm.nextFlag = function () {
        if (vm.autoPlayRun) {
          vm.disableAutoPlay();
        }
        vm.randomizeFlag();
      };

      vm.disableAutoPlay = function () {
        $timeout.cancel(vm.autoPlayInstance);
        $interval.cancel(vm.randomizeInstance);
        vm.autoPlayRun = false;
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
        }, 200);
      };

      vm.autoPlay = function () {
        vm.autoPlayRun = true;
        var expire = new Date(Date.now() + AUTOPLAY_TIMER);
        vm.timer = Math.round((expire.getTime() - Date.now()) / 1000);
        if (vm.showAnswer) {
          vm.randomizeFlag();
        }
        vm.randomizeInstance = $interval(function () {
          vm.timer = Math.round((expire.getTime() - Date.now()) / 1000);
          if (vm.timer <= 0) {
            vm.showAnswer = true;
            vm.autoPlayInstance = $timeout(function () {
              vm.autoPlay();
            }, ANSWER_TIMER);
            $interval.cancel(vm.randomizeInstance);
          }
        }, 1000);
      };
    }
  );