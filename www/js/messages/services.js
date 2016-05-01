angular.module('messages.services', [])
  .service('MessagesService', ['$q',
    function($q) {
      return {
        getMessages: function(profileId1, profileId2) {
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
  ]);
