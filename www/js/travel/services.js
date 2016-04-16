angular.module('travel.services', [])

.service('TravelService', ['$q', 'ParseConfiguration',
  function($q, ParseConfiguration) {
    return {
      findCurTravelDetails: function(_travelID) {
        var defered = $q.defer();
        var Travel = Parse.Object.extend('Travel');
        var travel = new Parse.Query(Travel);
        travel.get(_travelID, {
          success: function(travel) {
            defered.resolve(travel);
          },
          error: function(err) {
            defered.reject(err);
          }
        });
        return defered.promise;
      },
      findMyTravels: function(_user) {
        var defered = $q.defer();
        var Travel = Parse.Object.extend('Travel');
        var travel = new Parse.Query(Travel);
        travel.equalTo("user_id", _user.id);
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
        console.log(JSON.stringify(travelParams));
        var defered = $q.defer();
        var Travel = Parse.Object.extend('Travel');
        var myTravel = new Travel();
        myTravel.set('from', travelParams.from);
        myTravel.set('to', travelParams.to);
        myTravel.set('seats', parseInt(travelParams.seats));
        myTravel.set('allowsPets', travelParams.allowsPets);
        myTravel.set('allowsSmoking', travelParams.allowsSmoking);
        myTravel.set('price', parseInt(travelParams.price));
        myTravel.set('user_id', _user.id);
        var newACL = new Parse.ACL();
        newACL.setWriteAccess(_user.id,  true);
        newACL.setReadAccess("*",  true);
        myTravel.setACL(newACL);
        myTravel.save(null, {
          success: function(travel) {
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
  }
]);
