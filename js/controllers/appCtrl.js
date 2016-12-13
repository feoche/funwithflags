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
        $http.get('//www.geognos.com/api/en/countries/info/all.json').then(function (data) {
          var res = data && data.data && data.data.Results;
          angular.forEach(res, function (country) {
            vm.loading++;
            $http.get('//www.geognos.com/api/en/countries/flag/' + (country && country.CountryCodes && country.CountryCodes.iso2) + '.png', {responseType: "blob"}).success(function (data, status, headers, config) {
              var fr = new FileReader();
              fr.onload = function () {
                var res = {
                  code: country && country.CountryCodes && country.CountryCodes.iso2,
                  capital: country && country.Capital && country.Capital.Name,
                  name: country && country.Name,
                  base64: fr.result
                };

                var name = (country && country.CountryCodes && country.CountryCodes.iso2) && ('//flags.fmcdn.net/data/flags/normal/' + country.CountryCodes.iso2.toLowerCase() + '.png');
                $http.get(name).success(function () {
                  res.flag = name;
                }).error(function () {
                  res.flag = fr.result;
                }).finally(function () {
                  vm.flags.push(res);
                });
              };
              fr.readAsDataURL(data);
              FlagFactory.flags = vm.flags;
              FlagFactory.SaveState();
            }).finally(function () {
              vm.loading = 0;
            });
          });
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
          var name = 'http://flags.fmcdn.net/data/flags/normal/' + vm.randomFlag.code.toLowerCase() + '.png';
          $http.get(name).success(function () {
            vm.randomFlag.flag = name;
          }).error(function () {
            vm.randomFlag.flag = vm.randomFlag.flag || vm.randomFlag.base64;
          }).finally(function () {
            FlagFactory.flags = vm.flags;
            FlagFactory.SaveState();
            console.info('Country: ', vm.randomFlag && vm.randomFlag.name, ', Capital: ', vm.randomFlag && vm.randomFlag.capital);
            vm.loading = 0;
          });
        } else {
          vm.randomizeFlag();
        }
      }, 1000);
    };

    vm.autoPlay = function() {
      vm.autoPlayRun = true;
      $interval(function () {
        vm.showAnswer = true;
        $timeout(function () {
          vm.randomizeFlag();
        }, 5000);
      }, 15000);
    };
  });