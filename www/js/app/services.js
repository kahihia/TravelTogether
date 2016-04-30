angular.module('app.services', [])
  .service('MessageService', ['$q',
    function($q) {
      return {
        getMessages: function(profileId1, profileId2){
          var defered = $q.defer();
          var Message = Parse.Object.extend('Message');
          var query1 = new Parse.Query(Message);
          console.log(profileId1);
          console.log(profileId2);
          query1.equalTo("sender_profile_id", profileId1);
          query1.equalTo("recipient_profile_id", profileId2);
          var query2 = new Parse.Query(Message);
          query2.equalTo("sender_profile_id", profileId2);
          query2.equalTo("recipient_profile_id", profileId1);

          var messageQuery = Parse.Query.or(query1, query2);
          messageQuery.find({
            success: function(messages) {
              console.log(messages);
              defered.resolve(messages);
            },
            error: function(err) {
              defered.reject(err);
            }
          });
          return defered.promise;
        },
        sendMessage: function(fromProfile, toProfile, text) {
          var defered = $q.defer();
          var Message = Parse.Object.extend('Message');
          var m = new Message();
          m.set('recipient_profile_id', toProfile);
          m.set('sender_profile_id', fromProfile);
          m.set('text', text);
          m.save(null, {
            success: function(message) {
              console.log("Message saved " + JSON.stringify(message));
              defered.resolve(message);
            },
            error: function(message, error) {
              defered.reject(error);
            }
          });
          return defered.promise;
        }
      }
    }
  ])
  .service('AppService', ['$q', 'ParseConfiguration', '$ionicPopup',
    function($q, ParseConfiguration, $ionicPopup) {
      function alert(title, content) {
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
        getProfileById: function(profileId) {
          var defered = $q.defer();
          var Profile = Parse.Object.extend('Profile');
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
                newProfile.set("avatar", "http://res.cloudinary.com/kulinski/image/upload/v1460879219/07-512_iv9e3q.png");
                var email = _user.getEmail();
                newProfile.set("first_name", email.substring(0, email.indexOf('@')));
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
