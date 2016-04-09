angular.module('app.services', [])
  .service('AppService', ['$q', 'ParseConfiguration',
    function($q, ParseConfiguration) {
      return {
        /**
         * params: profile - profile of current user, params - params from input
         * if no profile for user, create new one
         */
        saveProfile: function(profile, params) {
          var defered = $q.defer();
          profile.set('age', params.age);
          profile.set('gender', params.gender);
          profile.set('avatar', params.avatar);
          profile.save(null, {
            success: function(profile) {
              console.log("Profile: Saved " + JSON.stringify(profile));
              defered.resolve(profile);
            },
            error: function(profile, error) {
              alert('Failed to save profile ' + error.message);
              defered.reject(error);
            }
          });
          return defered.promise;
        },
        /**
         * params: _user - parent of profile
         * if no profile for user, create new one
         */
        getProfile: function(_user) {
          var defered = $q.defer();
          var Profile = Parse.Object.extend('Profile');
          var profile = new Parse.Query(Profile);
          profile.equalTo("parent", _user);
          profile.find({
            success: function(profile) {
              if (profile.length == 0) {
                console.log("Profile: Not found. Create New");
                var p = new Profile();
                p.set("parent", _user);
                defered.resolve(p)
              } else {
                console.log("Profile: Found: " + JSON.stringify(profile[0]));
                defered.resolve(profile[0])
              }
              defered.resolve(profile);
            },
            error: function(profile, err) {
              console.log("Profile:  Error: " + JSON.stringify(err));
              defered.reject(profile);
            }

          });
          return defered.promise;
        }
      }
    }
  ])
  .factory('Camera', function($q) {
    return {
      getPicture: function(options) {
        var q = $q.defer();
        navigator.camera.getPicture(function(result) {
          q.resolve(result);
        }, function(err) {
          q.reject(err);
        }, options);
        return q.promise;
      }
    }
  });
