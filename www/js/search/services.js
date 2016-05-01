angular.module('search.services', [])
.service('SearchService', ['$q',
  function($q) {
    var Profile = Parse.Object.extend('Profile');
    var results = {};
    return {
      searchProfiles: function(text) {
        var defered = $q.defer();
        var query = new Parse.Query(Profile);
        query.contains("full_name_lowercase", text.toLowerCase());
        query.find({
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
