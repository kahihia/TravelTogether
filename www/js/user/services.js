angular.module('user.services', [])
  .service('UserService', ['$q', 'ParseConfiguration', 'AppService',
    function($q, ParseConfiguration, AppService) {
      var parseInitialized = false;
      return {
        changePassword: function(username, password, newPassword) {
          var defered = $q.defer();
          Parse.User.logIn(username, password).then(function(_user) {
            _user.setPassword(newPassword);
            _user.save();
            defered.resolve();
          }, function(err) {
            defered.reject("Invalid Password");
          });
          return defered.promise;
        },
        init: function() {
          if (parseInitialized === false) {
            Parse.initialize(ParseConfiguration.applicationId, ParseConfiguration.javascriptKey);
            Parse.serverURL = ParseConfiguration.server;
            parseInitialized = true;
          }
          var currentUser = Parse.User.current();
          if (currentUser) {
            return $q.when(currentUser);
          } else {
            return $q.reject({
              error: "noUser"
            });
          }
        },
        createUser: function(_userParams) {
          var user = new Parse.User();
          user.set("username", _userParams.email);
          user.set("password", _userParams.password);
          user.set("Email", _userParams.email);
          var result = user.signUp(null, {
            success: function(user) {
              AppService.getOrCreateProfile(user.id, user.get('Email'));
            }
          });
          return result;
        },
        currentUser: function(_parseInitUser) {
          // if there is no user passed in, see if there is already an
          // active user that can be utilized
          _parseInitUser = _parseInitUser ? _parseInitUser : Parse.User.current();
          console.log("_parseInitUser " + Parse.User.current());
          if (!_parseInitUser) {
            return $q.reject({
              error: "noUser"
            });
          } else {
            return $q.when(_parseInitUser);
          }
        },
        /**
         *
         * @param _user
         * @param _password
         * @returns {Promise}
         */
        login: function(_user, _password) {
          return Parse.User.logIn(_user, _password);
        },
        /**
         *
         * @returns {Promise}
         */
        logout: function(_callback) {
          var defered = $q.defer();
          Parse.User.logOut();
          defered.resolve();
          return defered.promise;
        }
      }
    }
  ]);
