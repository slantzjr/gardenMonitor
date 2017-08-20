angular.module('gardenMonitor').controller('measurementHistoryController', ['$location', '$scope', '$http', 'toastr', function($location, $scope, $http, toastr) {
  // Set up $scope.videos as an empty array to ensure it always exists.
    $scope.measurements = [];

    // First, show a loading spinner
    $scope.measurementsLoading = true;
    console.log('hellow');
      // Get the existing videos.
      $http({method: 'GET', url: '/measurement'}).then(function whenServerResponds(response) {
        $scope.measurementsLoading = false;
        var data = [];
        console.log(response.data);
        if (response.data) {
          data = response.data.map(
            point => {
              dateObject = new Date(Date.parse(point.createdAt));
              point.createdAt = dateObject.toDateString()
              return point;
            }
          );
        }
        $scope.measurements = data;
      });
}]);