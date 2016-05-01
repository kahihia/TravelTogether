angular.module('user.controllers', [])
  .controller('LoginController', [
    '$state', '$scope', 'UserService', // <-- controller dependencies
    function($state, $scope, UserService) {
      $scope.creds = {
        username: "tsvetelin.kulinski@gmail.com",
        password: "123456"
      };
      $scope.doLoginAction = function() {
        UserService.login($scope.creds.username, $scope.creds.password)
          .then(function(_response) {
            $state.go('travel.list');
          }, function(_error) {
            alert("error logging in " + _error.message);
          })
      };
    }
  ])
  .controller('SignUpController', [
    '$state', '$scope', 'UserService',
    function($state, $scope, UserService) {
      $scope.creds = {};
      $scope.signUpUser = function() {
        UserService.init();
        UserService.createUser($scope.creds).then(function(_data) {
          $scope.user = _data;
          $state.go('travel.list', {});
        }, function(_error) {
          alert("Error Creating User Account " + _error.debug)
        });
      }
    }
  ]);
