angular.module('travel.controllers', [])
  .controller('TravelListCtrl', [
    '$scope', '$interval', 'TravelService', // <-- controller dependencies
    function($scope, $interval, TravelService) {
      $scope.cities = TravelService.cities;
      $scope.params = {};

      $scope.doRefresh = function() {
        //force get travels
        getTravels();
        // Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
      };

      function getTravels() {
        if ($scope.params.from && $scope.params.to) {
          TravelService.findTravelBetweenCities($scope.params.from, $scope.params.to).then(function(travels) {
            $scope.travelList = travels;
          });
        } else {
          TravelService.findAllTravels().then(function(travels) {
            $scope.travelList = travels;
          });
        }
      }
      var interval;
      $scope.$on("$ionicView.afterLeave", function(event, data) {
        $interval.cancel(interval);
      });
      $scope.$on("$ionicView.enter", function(event, data) {
        getTravels();
        interval = $interval(getTravels, 2000);
      });
    }
  ])
  .controller('TravelDetailCtrl', [
    '$state', '$scope', '$stateParams', '$interval', 'AppService', 'TravelService', 'UserService', // <-- controller dependencies
    function($state, $scope, $stateParams, $interval, AppService, TravelService, UserService) {
      TravelService.findCurTravelDetails($stateParams.travelId).then(function(details) {
        $scope.details = details;
        $scope.profile = details.get('profile');
        console.log("Results:" + JSON.stringify(details));
      });
      var getComments = function() {
        TravelService.findCommentsForTravel($stateParams.travelId).then(function(comments) {
          $scope.comments = comments;
          console.log(JSON.stringify(comments[comments.length - 1]));
        });
      }
      $scope.comment = {};
      $scope.addComment = function() {
        UserService.currentUser()
          .then(function(_user) {
            $scope.user = _user;
            return AppService.getOrCreateProfile(_user.id, _user.get('Email'));
          })
          .then(function(profile) {
            text = $scope.comment.text;
            $scope.comment = {};
            return TravelService.addCommentToTravel(profile, $stateParams.travelId, text);
          })
          .then(getComments);
      };
      var interval;
      $scope.$on("$ionicView.afterLeave", function(event, data) {
        $interval.cancel(interval);
      });
      $scope.$on("$ionicView.enter", function(event, data) {
        getComments();
        interval = $interval(getComments, 2000);
      });
    }
  ])
  .controller('TravelCreateCtrl', [
    '$state', '$scope', '$stateParams', 'UserService', 'TravelService', 'AppService', // <-- controller dependencies
    function($state, $scope, $stateParams, UserService, TravelService, AppService) {
      $scope.cities = TravelService.cities;
      $scope.travel = {
        seats: 4,
        allowsPets: false,
        allowsSmoking: false,
        price: 10
      };
      $scope.createTravel = function() {
        if (!validateTravel($scope.travel)) {
          return;
        }
        UserService.currentUser()
          .then(function(_user) {
            AppService.getOrCreateProfile(_user.id, _user.get('Email'))
              .then(function(profile) {
                $scope.fromProfile = profile;
              });
          });

        UserService.currentUser()
          .then(function(_user) {
            return AppService.getOrCreateProfile(_user.id, _user.get('Email'))
          })
          .then(function(profile) {
            return TravelService.createTravel(profile, $scope.travel);
          })
          .then(function(travel) {
            AppService.alertSuccess("Your travel was created!");
            console.log("Successfully created travel: " + JSON.stringify(travel));
            $state.go('travel.list');
          });
      };

      function validateTravel(travel) {
        if (!(travel.from && travel.from != "" && travel.to && travel.to != "")) {
          AppService.alertError("Please fill travel destinations");
          return false;
        }
        return true;
      }
    }
  ]);
