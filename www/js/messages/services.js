angular.module('messages.services', [])
  .service('MessagesService', ['$q', 'UserService', 'AppService',
    function($q, UserService, AppService) {
      var Message = Parse.Object.extend('Message');
      var myProfile;
      UserService.currentUser().then(function(_user) {
        AppService.getOrCreateProfile(_user.id, _user.get('Email')).then(function(profile) {
          myProfile = profile;
        });
      });
      return {
        getLastConversations: function() {
          var defered = $q.defer();
          var query = new Parse.Query(Message);
          defered.resolve({
            profiles: [myProfile]
          });
          return defered.promise;
        },
        getMessages: function(otherProfileId) {
          var defered = $q.defer();
          var query1 = new Parse.Query(Message);
          query1.equalTo("sender_profile_id", myProfile.id);
          query1.equalTo("recipient_profile_id", otherProfileId);
          var query2 = new Parse.Query(Message);
          query2.equalTo("sender_profile_id", otherProfileId);
          query2.equalTo("recipient_profile_id", myProfile.id);
          var messageQuery = Parse.Query.or(query1, query2);
          messageQuery.find({
            success: function(messages) {
              defered.resolve(messages);
            },
            error: function(err) {
              defered.reject(err);
            }
          });
          return defered.promise;
        },
        sendMessage: function(toProfile, text) {
          var defered = $q.defer();
          var m = new Message();
          m.set('recipient_profile_id', toProfile);
          m.set('sender_profile_id', myProfile.id);
          m.set('text', text);
          m.set('acknowledged', false);
          m.save(null, {
            success: function(message) {
              console.log("Message sent " + JSON.stringify(message));
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
  ]);
