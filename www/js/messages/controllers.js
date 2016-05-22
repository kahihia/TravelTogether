angular.module('messages.controllers', [])
  .controller('MessagesCtrl', [
    '$state', '$scope', '$stateParams', 'SearchService', 'MessagesService',
    function($state, $scope, $stateParams, SearchService, MessagesService) {
      $scope.search = function(query) {
        query = query.trim();
        if (query === '' || query.length < 2) {
          MessagesService.getLastConversations().then(function(results) {
            $scope.results = results;
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
    '$state', '$scope', '$stateParams', '$interval', 'AppService', 'MessagesService', 'UserService', '$ionicScrollDelegate',
    function($state, $scope, $stateParams, $interval, AppService, MessagesService, UserService, $ionicScrollDelegate) {
      $scope.data = {};
      AppService.getProfileById($stateParams.profileId).then(function(profile) {
        $scope.toProfile = profile;
      });
      var interval;
      $scope.$on("$ionicView.enter", function(event, data) {
        UserService.currentUser().then(function(_user) {
          $scope.user = _user;
          AppService.getOrCreateProfile(_user.id, _user.get('Email')).then(function(profile) {
            $scope.fromProfile = profile;
            var getMessages = function() {
              MessagesService.getMessages($stateParams.profileId).then(function(messageList) {
                $scope.messageList = messageList;
                console.log("get messages");
              });
            }
            getMessages();
            interval = $interval(function() {
              getMessages();
            }, 1000);
          });
        });
      });
      $scope.$on("$ionicView.afterLeave", function(event, data) {
        $interval.cancel(interval);
      });
      $scope.sendMessage = function() {
        MessagesService.sendMessage($scope.toProfile.id, $scope.data.text);
        $scope.data = {};
      }

      $scope.doRefresh = function() {
        $http.get('/new-items')
          .success(function(newItems) {
            $scope.items = newItems;
          })
          .finally(function() {
            // Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');
          });
      };
    }
  ]);
