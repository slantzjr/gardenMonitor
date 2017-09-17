angular.module('gardenMonitor').controller('measurementHistoryController', ['$location', '$scope', '$http', 'toastr', function($location, $scope, $http, toastr) {
  // Set up $scope.measurements as an empty array to ensure it always exists.
  $scope.measurements = [];

  $scope.tempOptions = {
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
      "text": "Last 5 days",
      "css": {
        "text-align": "center",
        "margin": ""
      }
    },
  };

  $scope.lightOptions = {
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
        "axisLabel": "Light Intensity (lx)",
        "axisLabelDistance": -10
      }
    },
    "title": {
      "enable": false,
      "text": ""
    },
    "subtitle": {
      "enable": true,
      "text": "Last 5 days",
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
      var preppedTempData = response.data.map(
        function(point) {
          return {x: new Date(point.createdAt).getTime(), y: parseInt(point.temperature)};
        }
      );
      var preppedLightData = response.data.map(
        function(point) {
          return {x: new Date(point.createdAt).getTime(), y: parseInt(point.lightIntensity)};
        }
      );
      $scope.tempData = [{
        key: "Temperature",
        values: preppedTempData
      }];
      $scope.lightData = [{
        key: "Light Intensity",
        values: preppedLightData
      }];
      console.log($scope.lightData);
    }
  });
}]);