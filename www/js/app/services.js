angular.module('app.services', [])
  .service('AppService', ['$q', 'ParseConfiguration', '$ionicPopup',
    function($q, ParseConfiguration, $ionicPopup) {
      var MyProfile;

      function alert(title, content) {
        $ionicPopup.alert({
          title: title,
          content: content
        });
      };

      function createFullName(firstName, lastName) {
        var name = "";
        if (firstName) {
          name = name + firstName + " ";
        }
        if (lastName) {
          name = name + lastName;
        }
        return name.toLowerCase();
      }
      var Profile = Parse.Object.extend('Profile');
      return {
        alertSuccess: function(content) {
          alert('Success', content);
        },
        alertError: function(content) {
          alert('Error', content);
        },
        getProfileById: function(profileId) {
          var defered = $q.defer();
          var profileQuery = new Parse.Query(Profile);
          profileQuery.get(profileId, {
            success: function(profile) {
              defered.resolve(profile);
            },
            error: function(err) {
              defered.reject(err);
            }
          });
          return defered.promise;
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
          profile.set('full_name_lowercase', createFullName(params.first_name, params.last_name));
          profile.save(null, {
            success: function(profile) {
              console.log("Profile: Saved " + JSON.stringify(profile));
              MyProfile = profile;
              defered.resolve(profile);
            },
            error: function(profile, error) {
              defered.reject(error);
            }
          });
          return defered.promise;
        },
        getOrCreateProfile: function(_userId, _userEmail) {
          var defered = $q.defer();
          console.log(MyProfile);
          if (MyProfile) {
            console.log("cachedProfile");
            defered.resolve(MyProfile);
            return defered.promise;
          }
          var profile = new Parse.Query(Profile);
          profile.equalTo("user_id", _userId);
          profile.find({
            success: function(profiles) {
              if (profiles.length == 0) {
                console.log("Profile: Not found. Create New");
                var newProfile = new Profile();
                newProfile.set("user_id", _userId);
                var newACL = new Parse.ACL();
                newACL.setWriteAccess(_userId, true);
                newACL.setReadAccess("*", true);
                newProfile.setACL(newACL);
                newProfile.set("avatar", "http://res.cloudinary.com/kulinski/image/upload/v1460879219/07-512_iv9e3q.png");
                newProfile.set("first_name", _userEmail.substring(0, _userEmail.indexOf('@')));
                newProfile.save(null, {
                  success: function(profile) {
                    console.log("Profile: Saved " + JSON.stringify(profile));
                    MyProfile = profile;
                    defered.resolve(profile);
                  },
                  error: function(profile, error) {
                    defered.reject(error);
                  }
                });
              } else {
                console.log("Profile: Found: " + JSON.stringify(profiles[0]));
                MyProfile = profiles[0];
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
