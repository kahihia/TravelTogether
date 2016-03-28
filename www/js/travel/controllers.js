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
  function($state, $scope, $stateParams, UserService) {
    $scope.travel = {
      from: "Lovech",
      to: "Sofia",
      seats: 4
    };
    $scope.createTravel = function() {
      UserService.currentUser().then(function(_user) {
        var Travel = Parse.Object.extend('Travel');
        var myTravel = new Travel();
        myTravel.set('from', $scope.travel.from);
        myTravel.set('to', $scope.travel.to);
        myTravel.set('seats', parseInt($scope.travel.seats));
        myTravel.set('parent', _user);
        myTravel.save(null, {
          success: function(travel) {
            alert("Your travel was created!Travel Id: " + travel.id);
            $state.go('travel.list');
          },
          error: function(travel, error) {
            alert('Failed to create new travel, with error code: ' + error.message);
          }
        });
      });
    };
  }
]);
