angular.module('travel.controllers', [])
  .controller('TravelListCtrl', [
    '$scope', '$interval', 'TravelService', // <-- controller dependencies
    function($scope, $interval, TravelService) {
      $scope.cities = TravelService.cities;
      $scope.params = {};

      function getTravels() {
        if ($scope.params.from && $scope.params.to) {
          TravelService.findTravelBetweenCities($scope.params.from, $scope.params.to).then(function(travels) {
            $scope.travelList = travels;
            console.log("between cities");
          });
        } else {
          TravelService.findAllTravels().then(function(travels) {
            $scope.travelList = travels;
          });
        }
      }
      var interval;
      $scope.$on("$ionicView.afterLeave", function(event, data) {
        $interval.cancel(interval);
      });
      $scope.$on("$ionicView.enter", function(event, data) {
        interval = $interval(getTravels, 2000);
      });
    }
  ])
  .controller('TravelDetailCtrl', [
    '$state', '$scope', '$stateParams', 'UserService', 'TravelService', // <-- controller dependencies
    function($state, $scope, $stateParams, UserService, TravelService) {
      TravelService.findCurTravelDetails($stateParams.travelId).then(function(details) {
        $scope.Details = details;
        console.log("Results:" + JSON.stringify(details));
      })
    }
  ])
  .controller('TravelCreateCtrl', [
    '$state', '$scope', '$stateParams', 'UserService', 'TravelService', 'AppService', // <-- controller dependencies
    function($state, $scope, $stateParams, UserService, TravelService, AppService) {
      $scope.cities = TravelService.cities;
      $scope.travel = {
        seats: 4,
        allowsPets: false,
        allowsSmoking: false,
        price: 10
      };
      $scope.createTravel = function() {
        if (!validateTravel($scope.travel)) {
          return;
        }
        UserService.currentUser()
          .then(function(_user) {
            return TravelService.createTravel(_user, $scope.travel);
          })
          .then(function(travel) {
            AppService.alertSuccess("Your travel was created!");
            console.log("Successfully created travel: " + JSON.stringify(travel));
            $state.go('travel.list');
          });
      };

      function validateTravel(travel) {
        if (!(travel.from && travel.from != "" && travel.to && travel.to != "")) {
          AppService.alertError("Please fill travel destinations");
          return false;
        }
        return true;
      }
    }
  ]);
