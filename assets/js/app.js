angular.module('gardenMonitor', ['ngRoute', 'toastr', 'compareTo', 'ngPatternRestrict', 'nvd3'])
  .config(['$routeProvider', function($routeProvider) {

  $routeProvider

  // #/    (i.e. ng-view's "home" state)
    .when('/', {
    templateUrl: '/templates/home.html'
  })

  .when('/signup', {
    templateUrl: '/templates/signup.html',
    controller: 'signupPageController'
  })
}]);