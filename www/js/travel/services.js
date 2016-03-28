angular.module('travel.services', [])

.service('TravelService', ['$q', 'ParseConfiguration',
  function($q, ParseConfiguration) {
    return {
      findMyTravels: function(_user) {
        var defered = $q.defer();
        var Travel = Parse.Object.extend('Travel');
        var travel = new Parse.Query(Travel);
        travel.equalTo("parent", _user);
        travel.find({
          success: function(travels) {
            defered.resolve(travels);
          },
          error: function(err) {
            defered.reject(travels);
          }
        });
        return defered.promise;
      },
      findAllTravels: function() {
        var defered = $q.defer();
        var Travel = Parse.Object.extend('Travel');
        var travel = new Parse.Query(Travel);
        travel.find({
          success: function(travels) {
            defered.resolve(travels);
          },
          error: function(err) {
            defered.reject(travels);
          }
        });
        return defered.promise;
      }
    }
  }
]);
