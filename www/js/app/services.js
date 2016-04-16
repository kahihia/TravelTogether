angular.module('app.services', [])
  .service('AppService', ['$q', 'ParseConfiguration', '$ionicPopup',
    function($q, ParseConfiguration, $ionicPopup) {
      function alert(title, content){
        $ionicPopup.alert({
          title: title,
          content: content
        });
      };
      return {
        alertSuccess: function(content) {
          alert('Success', content);
        },
        alertError: function(content) {
          alert('Error', content);
        },
        /**
         * params: profile - profile of current user, params - params from input
         * if no profile for user, create new one
         */
        saveProfile: function(profile, params) {
          var defered = $q.defer();
          profile.set('age', params.age);
          profile.set('gender', params.gender);
          profile.set('avatar', params.avatar);
          profile.set('city', params.city);
          profile.set('car', params.car);
          profile.set('first_name', params.first_name);
          profile.set('last_name', params.last_name);
          profile.save(null, {
            success: function(profile) {
              console.log("Profile: Saved " + JSON.stringify(profile));
              defered.resolve(profile);
            },
            error: function(profile, error) {
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
          profile.equalTo("user_id", _user.id);
          profile.find({
            success: function(profiles) {
              if (profiles.length == 0) {
                console.log("Profile: Not found. Create New");
                var newProfile = new Profile();
                newProfile.set("user_id", _user.id);
                var newACL = new Parse.ACL();
                newACL.setWriteAccess(_user.id, true);
                newACL.setReadAccess("*", true);
                newProfile.setACL(newACL);
                defered.resolve(newProfile);
              } else {
                console.log("Profile: Found: " + JSON.stringify(profiles[0]));
                defered.resolve(profiles[0])
              }
            },
            error: function(profiles, err) {
              console.log("Profile:  Error: " + JSON.stringify(err));
              defered.reject(profiles);
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
