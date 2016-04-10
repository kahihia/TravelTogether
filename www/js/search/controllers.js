/**
 * beginnings of a controller to login to system
 * here for the purpose of showing how a service might
 * be used in an application
 */
angular.module('search.controllers', [])
  .controller('SearchCtrl', [
    '$state', '$scope', '$stateParams', 'SearchService', // <-- controller dependencies
    function($state, $scope, $stateParams, SearchService) {
      $scope.search = function(query) {
        SearchService.search(query).then(function(results) {
          console.log(JSON.stringify(results));
          $scope.results = results;
        });
      }
    }
  ]);
