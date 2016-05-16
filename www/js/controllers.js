angular.module('starter.controllers', ['ngMap'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
})

.controller('JourneyCtrl', function($scope, NgMap, $ionicPopup) {
  var vm = this;

  $scope.waypts = [];

  $scope.addNewWaypoint = function() {
    $scope.waypts.push({location: '', stopover: true});
  };

  $scope.removeWaypoint = function(id) {
    $scope.waypts.splice(id, 1);
  };

  $scope.calculateJourney = function() {
    directionsService = new google.maps.DirectionsService;
    directionsDisplay = new google.maps.DirectionsRenderer;

    origin = angular.element(document.getElementById('origin')).val();
    destination = angular.element(document.getElementById('destination')).val();

    waypoints = [];
    $scope.waypts.forEach(function(item){
      waypoints.push({
        location: item.location,
        stopover: item.stopover
      })
    });

    directionsDisplay.setMap(vm.map);

    directionsService.route({
      origin: origin,
      destination: destination,
      waypoints: waypoints,
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.BICYCLING
    }, function(response, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
        var route = response.routes[0];
        var summaryPanel = document.getElementById('directions-panel');
        summaryPanel.innerHTML = '';
        // For each route, display summary information.
        for (var i = 0; i < route.legs.length; i++) {
          var routeSegment = i + 1;
          summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment +
            '</b><br>';
          summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
          summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
          summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';
        }
      } else {
        var alertPopup = $ionicPopup.alert({
          title: 'Directions request failed',
          template: '<center>' + status + '</center>'
        });
      }
    });
  };

  $scope.disableTap = function() {
    container = document.getElementsByClassName('pac-container');
    angular.element(container).attr('data-tap-disabled', 'true');
    angular.element(container).on("click", function() {
      document.getElementById('searchBar').blur();
    });
  };

  vm.placeChanged = function() {
    vm.place = this.getPlace();
    console.info("mudou para" +  this.getPlace());
  }

  NgMap.getMap().then(function(map) {
    vm.map = map;
  });
});
