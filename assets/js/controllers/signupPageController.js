angular.module('gardenMonitor').controller('signupPageController', ['$scope', '$http', 'toastr', function($scope, $http, toastr){
  // set-up loading state
  $scope.signupForm = {
    loading: false
  };

  $scope.submitSignupForm = function() {

    // Set the loading state (i.e. show loading spinner)
    $scope.signupForm.loading = true;
    // Submit a POST request to Sails. [The signup action has been created.]
    $.get('/csrfToken', function( data ) {
      $http.post('/signup', {
        email: $scope.signupForm.email,
        username: $scope.signupForm.username.replace(/\s+/g, '-'),
        password: $scope.signupForm.password,
        _csrf: data._csrf,
      }, {withCredentials: true})
      .then(function onSuccess(sailsResponse){
        window.location = '/';
      })
      .catch(function onError(sailsResponse){
        // Handle known error type(s).
        if (sailsResponse.status == 409) {
          toastr.error(sailsResponse.data);
          $scope.signupForm.errorMsg = 'An unexpected error occurred: ' + (sailsResponse.data || sailsResponse.status);
          return;
        }

        // Handle unknown error type(s).
        $scope.signupForm.errorMsg = 'An unexpected error occurred: ' + (sailsResponse.data || sailsResponse.status);
      })
      .finally(function eitherWay() {
        $scope.signupForm.loading = false;
      });
    });
  };

}]);
