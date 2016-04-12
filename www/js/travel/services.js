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
    },
    createTravel: function(_user, travelParams) {
      var defered = $q.defer();
      var Travel = Parse.Object.extend('Travel');
      var myTravel = new Travel();
      myTravel.set('from', travelParams.from);
      myTravel.set('to', travelParams.to);
      myTravel.set('seats', parseInt(travelParams.seats));
      myTravel.set('allowsPets',travelParams.allowsPets);
      myTravel.set('allowsSmoking',travelParams.allowsSmoking);
      myTravel.set('parent', _user);
      myTravel.save(null, {
        success: function(travel) {
          alert("Your travel was created!Travel Id: " + travel.id);
          defered.resolve(travel);
        },
        error: function(travel, error) {
          alert('Failed to create new travel, with error code: ' + error.message);
          defered.reject(error);
        }
      });
      return defered.promise;
    }
}
}]);
