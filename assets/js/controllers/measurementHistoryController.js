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
    $scope.measurementsLoading = true;
    $scope.hasMeasurements = response.data.length > 0;
    var preppedTempData = [];
    var preppedLightData = [];
    if (response.data) {
      preppedTempData = response.data.map(
        function(point) {
          return {x: new Date(point.createdAt).getTime(), y: parseFloat(point.temperature)};
        }
      );
      preppedLightData = response.data.map(
        function(point) {
          if (!point.lightIntensity) {
            return {x: new Date(point.createdAt).getTime(), y: null};
          }
          return {x: new Date(point.createdAt).getTime(), y: parseFloat(point.lightIntensity)};
        }
      );
      preppedLightData = preppedLightData.filter(
        function(point) {
          return point.y != null;
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
    }
    $scope.measurementsLoading = false;
  });
}]);
