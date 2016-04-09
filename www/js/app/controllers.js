/**
 * beginnings of a controller to login to system
 * here for the purpose of showing how a service might
 * be used in an application
 */
angular.module('app.controllers', [])
  .controller('AccountCtrl', [
    '$state', '$scope', 'UserService', 'AppService', // <-- controller dependencies
    function($state, $scope, UserService, AppService) {
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
      $scope.saveProfileDetails = function() {
        UserService.currentUser()
          .then(function(_user) {
            return AppService.saveProfile($scope.profile, $scope.profileParams)
          })
          .then(function(profile) {
            console.log("Successfully created profile: " + JSON.stringify(profile))
          });
      };
      $scope.getProfileDetails = function() {
        UserService.currentUser()
          .then(function(_user) {
            return AppService.getProfile(_user)
          })
          .then(function(profile) {
            $scope.profile = profile;
            $scope.profileParams = {
              age: profile.get('age'),
              gender: profile.get('gender'),
              avatar: profile.get('avatar')
            }
          });
      };
      $scope.getProfileDetails();
    }
  ]);
