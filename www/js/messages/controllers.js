angular.module('messages.controllers', [])
  .controller('MessagesCtrl', [
    '$state', '$scope', '$stateParams', 'SearchService', 'MessagesService',
    function($state, $scope, $stateParams, SearchService, MessagesService) {
      $scope.search = function(query) {
        query = query.trim();
        if (query === '' || query.length < 2) {
          MessagesService.getLastConversations().then(function(results) {
            console.log("myProfile");
            $scope.results = results;
            console.log(results);
          });
        } else {
          SearchService.searchProfiles(query).then(function(results) {
            $scope.results = results;
          });
        }
      }
    }
  ])
  .controller('SendMessageCtrl', [
    '$state', '$scope', '$stateParams', '$interval', 'AppService', 'MessagesService', 'UserService',
    function($state, $scope, $stateParams, $interval, AppService, MessagesService, UserService) {
      $scope.data = {};
      AppService.getProfileById($stateParams.profileId).then(function(profile) {
        $scope.toProfile = profile;
      });
      var getMessages;
      UserService.currentUser().then(function(_user) {
        $scope.user = _user;
        AppService.getProfile(_user).then(function(profile) {
          $scope.fromProfile = profile;
          getMessages = $interval(function() {
            MessagesService.getMessages($stateParams.profileId).then(function(messageList) {
              $scope.messageList = messageList;
            });
          }, 1000);
          //$interval.cancel(getMessages);
        });
      });
      $scope.sendMessage = function() {
        MessagesService.sendMessage($scope.fromProfile.id, $scope.toProfile.id, $scope.data.text);
      }
    }
  ]);
