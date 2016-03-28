/**
 * beginnings of a controller to login to system
 * here for the purpose of showing how a service might
 * be used in an application
 */
angular.module('travel.controllers', [])
  .controller('TravelListCtrl', [
    '$state', '$scope', '$stateParams', 'UserService', 'TravelService', // <-- controller dependencies
    function($state, $scope, $stateParams, UserService, TravelService) {
      TravelService.findAllTravels().then(function(travels) {
        console.log(travels.length);
        $scope.travelList = travels;
      })
    }
  ])
  .controller('TravelCreateCtrl', [
    '$state', '$scope', '$stateParams', 'UserService', 'TravelService', // <-- controller dependencies
    function($state, $scope, $stateParams, UserService, TravelService) {
      $scope.travel = {
        from: "Lovech",
        to: "Sofia",
        seats: 4
      };
      $scope.createTravel = function() {
        UserService.currentUser()
          .then(function(_user) {
            return TravelService.createTravel(_user, $scope.travel)
          })
          .then(function(travel) {
            console.log("Successfully created travel: " + JSON.stringify(travel))
            $state.go('travel.list');
          });
      };
    }
  ]);
