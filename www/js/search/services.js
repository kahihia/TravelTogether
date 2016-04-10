angular.module('search.services', [])
.service('SearchService', ['$q',
  function($q) {
    var results = {};
    return {
      search: function(text) {
        var defered = $q.defer();
        var User = Parse.Object.extend('User');
        var user = new Parse.Query(User);
        user.contains("first_name", text);
        user.find({
          success: function(profiles) {
            console.log(profiles);
            results.profiles = profiles;
            defered.resolve(results);
          },
          error: function(err) {
            defered.reject(err);
          }
        });
        return defered.promise;
      }
    }
  }
]);
