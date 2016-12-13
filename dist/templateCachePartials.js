(function(module) {
try {
  module = angular.module('appPartials');
} catch (e) {
  module = angular.module('appPartials', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/partials/app-index.html',
    '<div class="flags disabled">\n' +
    '        <span class="flag" ng-repeat="flag in vm.flags">\n' +
    '            <img ng-src="{{flag.flag}}" image-on-load>\n' +
    '        </span>\n' +
    '</div>\n' +
    '<div class="overlay" ng-class="{\'disabled\' : vm.loading}">\n' +
    '    <button class="autoplay-button" ng-if="!vm.autoPlayRun" ng-click="vm.autoPlay()">&#9654;</button>\n' +
    '    <div class="random-flag"\n' +
    '         ng-init="vm.randomizeFlag()"\n' +
    '         ng-class="{\'answer\': vm.showAnswer}"\n' +
    '         ng-click="vm.toggleShowAnswer()">\n' +
    '        <img ng-src="{{vm.randomFlag.flag}}" image-on-load>\n' +
    '        <div class="random-flag_name" ng-bind="vm.randomFlag.name"></div>\n' +
    '        <div class="random-flag_capital" ng-bind="vm.randomFlag.capital"></div>\n' +
    '        <button class="continue-button" ng-click="vm.autoPlayRun = false;vm.randomizeFlag()">Continue</button>\n' +
    '    </div>\n' +
    '</div>\n' +
    '<div class="loading" ng-class="{\'disabled\' : !vm.loading}">\n' +
    '    <div class="loading-wheel"></div>\n' +
    '</div>');
}]);
})();
