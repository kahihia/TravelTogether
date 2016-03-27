/**
 * beginnings of a controller to login to system
 * here for the purpose of showing how a service might
 * be used in an application
 */
angular.module('travel.controllers', [])
  .controller('TravelCreateCtrl', [
    '$state', '$scope', '$stateParams', 'TravelService', // <-- controller dependencies
    function($state, $scope, $stateParams, UserService) {
      $scope.createTravel = function() {
        $state.go('travel-create');
      };
    }
  ]);
