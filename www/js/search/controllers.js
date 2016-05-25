angular.module('search.controllers', [])
  .controller('SearchCtrl', [
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
  ]);
