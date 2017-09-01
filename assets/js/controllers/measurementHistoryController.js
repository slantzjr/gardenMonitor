angular.module('gardenMonitor').controller('measurementHistoryController', ['$location', '$scope', '$http', 'toastr', function($location, $scope, $http, toastr) {
  // Set up $scope.measurements as an empty array to ensure it always exists.
  $scope.measurements = [];

  $scope.options = {
    "chart": {
      "type": "lineChart",
      "height": 450,
      "margin": {
        "top": 20,
        "right": 20,
        "bottom": 40,
        "left": 55
      },
      "useInteractiveGuideline": true,
      "dispatch": {},
      "xAxis": {
        "axisLabel": "Time",
        tickFormat: function(d) { return d3.time.format('%b %d')(new Date(d)); }
      },
      "yAxis": {
        "axisLabel": "Temperature (F)",
        "axisLabelDistance": -10
      }
    },
    "title": {
      "enable": false,
      "text": ""
    },
    "subtitle": {
      "enable": true,
      "text": "Last 7 days",
      "css": {
        "text-align": "center",
        "margin": ""
      }
    },
  };

  // First, show a loading spinner
  $scope.measurementsLoading = true;
  // Get the existing measurements.
  $http({method: 'GET', url: '/measurement'}).then(function whenServerResponds(response) {
    $scope.measurementsLoading = false;
    $scope.hasMeasurements = response.data.length > 0;
    var preppedData = [];
    if (response.data) {
      // Hacky fix to get rid of test data until I can get around to making a filter.
      response.data.splice(0, 15);
      var preppedData = response.data.map(
        function(point) {
          console.log(new Date(point.createdAt).getTime());
          return {x: new Date(point.createdAt).getTime(), y: point.temperature};
        }
      );
      $scope.data = [{
        key: "Temperature",
        values: preppedData
      }];
    }
  });
}]);