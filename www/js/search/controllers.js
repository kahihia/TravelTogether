/**
 * beginnings of a controller to login to system
 * here for the purpose of showing how a service might
 * be used in an application
 */
angular.module('search.controllers', ['ionic'])
  .controller('MessageCtrl', function($scope, $ionicLoading, $compile) {
    function initialize() {
      var myLatlng = new google.maps.LatLng(43.07493, -89.381388);

      var mapOptions = {
        center: myLatlng,
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      var map = new google.maps.Map(document.getElementById("map"),
        mapOptions);

      //Marker + infowindow + angularjs compiled ng-click
      var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
      var compiled = $compile(contentString)($scope);

      var infowindow = new google.maps.InfoWindow({
        content: compiled[0]
      });

      var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title: 'Uluru (Ayers Rock)'
      });

      google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map, marker);
      });

      $scope.map = map;
    }
    google.maps.event.addDomListener(window, 'load', initialize);

    $scope.centerOnMe = function() {
      if (!$scope.map) {
        return;
      }

      $scope.loading = $ionicLoading.show({
        content: 'Getting current location...',
        showBackdrop: false
      });

      navigator.geolocation.getCurrentPosition(function(pos) {
        var myLatlng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
        $scope.map.setCenter(myLatlng);
        var marker = new google.maps.Marker({
          position: myLatlng,
          map: $scope.map,
          title: 'Your position'
        });
        $scope.loading.hide();
      }, function(error) {
        alert('Unable to get location: ' + error.message);
      });
    };

    $scope.clickTest = function() {
      alert('Example of infowindow with ng-click')
    };
    initialize();
  })
  .controller('SearchCtrl', [
    '$state', '$scope', '$stateParams', 'SearchService', // <-- controller dependencies
    function($state, $scope, $stateParams, SearchService) {
      $scope.search = function(query) {
        SearchService.search(query).then(function(results) {
          console.log(JSON.stringify(results));
          $scope.results = results;
        });
      }
    }
  ]);
