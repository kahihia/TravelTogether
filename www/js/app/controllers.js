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
              avatar: profile.get('avatar')
            }
          });
      };
      UserService.currentUser()
        .then(function(_user) {
          $scope.user = _user;
        })
        .then($scope.getProfileDetails);
      $scope.takePicture = function(options) {
        var options = {
          quality: 75,
          targetWidth: 200,
          targetHeight: 200,
          sourceType: 1,
          destinationType: navigator.camera.DestinationType.DATA_URL
        };
        Camera.getPicture(options).then(function(imageData) {
          $scope.profileParams.avatar = "data:image/jpeg;base64," + imageData;
          $scope.upload("data:image/jpeg;base64," + imageData);
        }, function(err) {
          console.log(err);
        });
      };
      $scope.getPicture = function(options) {
        var options = {
          quality: 75,
          targetWidth: 200,
          targetHeight: 200,
          sourceType: 0,
          destinationType: navigator.camera.DestinationType.DATA_URL
        };
        Camera.getPicture(options).then(function(imageData) {
          $scope.upload("data:image/jpeg;base64," + imageData);
        }, function(err) {
          console.log(err);
        });
      };

      $scope.upload = function(file) {
        $scope.title = "avatar";
        if (file && !file.$error) {
          console.log(file);
          file.upload = $upload.upload({
            url: "https://api.cloudinary.com/v1_1/kulinski/upload",
            data: {
              upload_preset: "k6xfmhlu",
              tags: 'avatars',
              context: 'photo=' + $scope.title,
              file: file
            }
          }).progress(function(e) {
            console.log("Progress");
            file.progress = Math.round((e.loaded * 100.0) / e.total);
            file.status = "Uploading... " + file.progress + "%";
          }).success(function(data, status, headers, config) {
            $scope.debugMsg = data;
            $scope.profileParams.avatar = data['secure_url'];
            console.log(JSON.stringify(data));
            $rootScope.photos = $rootScope.photos || [];
            data.context = {
              custom: {
                photo: $scope.title
              }
            };
            file.result = data;
            $rootScope.photos.push(data);
          }).error(function(data, status, headers, config) {
            $scope.debugMsg = data;
            console.log(JSON.stringify(data));
            file.result = data;
          });
        };
      }
    }
  ])
