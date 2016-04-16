/**
 * beginnings of a controller to login to system
 * here for the purpose of showing how a service might
 * be used in an application
 */
angular.module('app.controllers', ['ngFileUpload'])
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
    }
  ])
  .controller('DetailsCtrl', [
    '$state', '$scope', 'UserService', 'AppService', 'Camera', 'Upload', // <-- controller dependencies
    function($state, $scope, UserService, AppService, Camera, $upload) {
      $scope.saveProfileDetails = function() {
        AppService.saveProfile($scope.profile, $scope.profileParams)
          .then(function(profile) {
            console.log("Successfully created profile: " + JSON.stringify(profile))
            alert("Saved!");
          });
      };
      $scope.getProfileDetails = function() {
        AppService.getProfile($scope.user)
          .then(function(profile) {
            $scope.profile = profile;
            $scope.profileParams = {
              age: profile.get('age'),
              gender: profile.get('gender'),
              avatar: profile.get('avatar'),
              car: profile.get('car'),
              city: profile.get('city'),
              first_name: profile.get('first_name'),
              last_name: profile.get('last_name')
            }
          });
      };
      UserService.currentUser()
        .then(function(_user) {
          $scope.user = _user;
        })
        .then($scope.getProfileDetails);

      $scope.getPicture = function(sourceType) {
        //sourceType - 1 - camera, 0 - album
        var options = {
          quality: 100,
          targetWidth: 300,
          targetHeight: 300,
          sourceType: sourceType,
          destinationType: navigator.camera.DestinationType.DATA_URL
        };
        Camera.getPicture(options).then(function(imageData) {
          $scope.profileParams.avatar = "data:image/jpeg;base64," + imageData;
          $scope.upload("data:image/jpeg;base64," + imageData);
        }, function(err) {
          console.log(err);
        });
      };

      $scope.upload = function(file) {
        $scope.title = "avatar";
        if (file && !file.$error) {
          file.upload = $upload.upload({
            url: "https://api.cloudinary.com/v1_1/kulinski/upload",
            data: {
              upload_preset: "k6xfmhlu",
              tags: 'avatars',
              context: 'photo=' + $scope.title,
              file: file
            }
          }).success(function(data, status, headers, config) {
            $scope.profileParams.avatar = data['secure_url'];
            console.log(JSON.stringify(data));
          }).error(function(data, status, headers, config) {
            console.log(JSON.stringify(data));
            alert('Upload failed!');
          });
        };
      }
    }
  ])
