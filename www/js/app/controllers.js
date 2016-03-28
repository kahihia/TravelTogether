/**
 * beginnings of a controller to login to system
 * here for the purpose of showing how a service might
 * be used in an application
 */
angular.module('app.controllers', [])
  .controller('AccountCtrl', [
    '$state', '$scope', 'UserService', // <-- controller dependencies
    function($state, $scope, UserService) {
      UserService.currentUser().then(function(_user) {
        $scope.user = _user;
      });

      $scope.doLogoutAction = function() {
        UserService.logout().then(function() {
          $state.go('app-login');
        }, function(_error) {
          alert("error logging in " + _error.debug);
        })
      };
    }
  ]);
