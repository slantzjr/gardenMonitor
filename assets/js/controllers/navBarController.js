angular.module('gardenMonitor').controller('navBarController', ['$location', '$scope', '$http', 'toastr', function($location, $scope, $http, toastr) {

  //Set-up loading state
  $scope.loginForm = {};
  $scope.submitLoginForm = function() {

    // Set the loading state (i.e. show loading spinner)
    $scope.loginForm.loading = true;

    $.get('/csrfToken', function( data ) {
      // Submit request to Sails.
      $http.put(
        '/login', 
        {
          email: $scope.loginForm.login,
          username: $scope.loginForm.login,
          password: $scope.loginForm.password,
          _csrf: data._csrf,
        },
        {withCredentials: true}
      )
      .then(function onSuccess() {
        window.location = '/';
      })
      .catch(function onFailure(sailsResponse) {

        // Handle known error type(s).        
        // Deleted account
        if (sailsResponse.status == 403) {
          toastr.error(sailsResponse.data, 'Error', {
          closeButton: true
        });
          return;
        }


        // Invalid username / password combination.
        if (sailsResponse.status === 400 || 404) {
          // $scope.loginForm.topLevelErrorMessage = 'Invalid email/password combination.';
          toastr.error('Invalid email or username/password combination.', 'Error', {
            closeButton: true
          });
          return;
        }

        toastr.error('An unexpected error occurred, please try again.', 'Error', {
          closeButton: true
        });
        return;

      })
      .finally(function eitherWay() {
        $scope.loginForm.loading = false;
      });
    });
  };
}]);
