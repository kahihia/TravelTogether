angular.module('messages.controllers', [])
  .controller('MessagesCtrl', [
    '$state', '$scope', '$stateParams', 'SearchService', // <-- controller dependencies
    function($state, $scope, $stateParams, SearchService) {
      $scope.search = function(query) {
        query = query.trim();
        if (query === '' || query.length < 2) {
          return;
        }
        SearchService.searchProfiles(query).then(function(results) {
          console.log(JSON.stringify(results));
          $scope.results = results;
        });
      }
    }
  ])
  .controller('SendMessageCtrl', [
    '$state', '$scope', '$stateParams', '$interval', 'AppService', 'MessagesService', 'UserService', // <-- controller dependencies
    function($state, $scope, $stateParams, $interval, AppService, MessagesService, UserService) {
      console.log("SendMessageCtrl");
      $scope.data = {};
      AppService.getProfileById($stateParams.profileId).then(function(profile) {
        console.log(profile);
        $scope.toProfile = profile;
      });
      var getMessages;
      UserService.currentUser().then(function(_user) {
        $scope.user = _user;
        AppService.getProfile(_user).then(function(profile) {
          $scope.fromProfile = profile;
          getMessages = $interval(function() {
            MessageService.getMessages($stateParams.profileId, profile.id).then(function(messageList) {
              $scope.messageList = messageList;
            });
          }, 1000);

          //$interval.cancel(getMessages);
        });
      });
      $scope.sendMessage = function() {
        console.log($scope.data.text);
        MessagesService.sendMessage($scope.fromProfile.id, $scope.toProfile.id, $scope.data.text);
      }
    }
  ]);
