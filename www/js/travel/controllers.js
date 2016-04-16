/**
 * beginnings of a controller to login to system
 * here for the purpose of showing how a service might
 * be used in an application
 */
angular.module('travel.controllers', [])
  .controller('TravelListCtrl', [
    '$scope', '$interval', 'TravelService', // <-- controller dependencies
    function($scope, $interval, TravelService) {
      function getTravels(){
        TravelService.findAllTravels().then(function(travels) {
          console.log('get travels');
          $scope.travelList = travels;
        });
      }
      getTravels();
      $interval(getTravels,5000);
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
      $scope.travel = {
        from: "Nova Zagora",
        to: "Sofia",
        seats: 4,
        allowsPets: false,
        allowsSmoking: false
      };
      $scope.createTravel = function() {
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
    }
  ]);
