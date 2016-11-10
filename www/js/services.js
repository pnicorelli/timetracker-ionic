(function() {
    'use strict';

    angular
        .module('timetracker.services', [])

        .service('SuggestionService', SuggestionService)
        .service('UserService', UserService)
        .service('TimeService', TimeService);

    SuggestionService.$inject = ['$http', 'config'];

    /* @ngInject */
    function SuggestionService($http, config) {

      return {
        send: send
      }

      function send(message){
        return $http.post(config.apiUrl+'/v1/members/suggestions', { message: message}).then(
          function(resolve){
            return resolve.data
          }
        )
      }
    }

    TimeService.$inject = ['$http', '$httpParamSerializer', 'config'];

    /* @ngInject */
    function TimeService($http, $httpParamSerializer, config) {

      return {
        getAll: getAll,
        getOpen: getOpen,
        getOne: getOne,
        closeOne: closeOne,
        afterward: afterward,
        remove: remove,
        start: start
      }

      function getAll( page ){
          return $http.get(config.apiUrl+'/v1/members/timesheet?page='+page+'&sort%5Bfrom%5D=-1').then(
            function(resolve){
              return resolve.data
            }
          )
      }

      function getOne(timesheetId){
          return $http.get(config.apiUrl+'/v1/members/timesheet/'+timesheetId).then(
            function(resolve){
              return resolve.data.timesheet
            }
          )
      }

      function remove(timesheetId){
          return $http.delete(config.apiUrl+'/v1/members/timesheet/'+timesheetId).then(
            function(resolve){
              return resolve.data.timesheet
            }
          )
      }

      function closeOne(timesheetId, closeDate){
          var payload = null;
          if( closeDate ){
            payload = {
              to: closeDate
            }
          }
          return $http.put(config.apiUrl+'/v1/members/timesheet/'+timesheetId, payload).then(
            function(resolve){
              return resolve.data.timesheet
            }
          )
      }

      function getOpen(){
          return $http.get(config.apiUrl+'/v1/members/timesheet?filter%5Bstatus%5D=started').then(
            function(resolve){
              return resolve.data
            }
          )
      }

      function start(){
          return $http.post(config.apiUrl+'/v1/members/timesheet').then(
            function(resolve){
              return resolve.data
            }
          )
      }

      function afterward(fromDate, toDate){
          return $http.post(config.apiUrl+'/v1/members/afterwards', {from: fromDate,to: toDate}).then(
            function(resolve){
              return resolve.data
            }
          )
      }

    }

    UserService.$inject = ['$http', 'config', '$localForage'];

    /* @ngInject */
    function UserService($http, config, $localForage) {

        return{
          isLogged: isLogged,
          profile: profile,
          loginWithPassword: loginWithPassword,
          loginWithCode: loginWithCode
        }

        function isLogged(){
          return $localForage.getItem('token');
        }

        function profile(){
          return  $localForage.getItem('profile').then(
            function(resolve){
              if( resolve && resolve.first){
                return resolve;
              } else {
                return $http.get(config.apiUrl+'/v1/members/profile').then(
                  function(resolve){
                    return $localForage.setItem('profile', resolve.data.member).then(
                      function(resolve){
                        return $localForage.getItem('profile');
                      },
                      function(reject){
                        console.log( 'reject member profile ')
                        console.log( reject)
                      }
                    )
                    return ;
                  },
                  function(reject){
                    console.log( 'reject member profile ')
                    console.log( reject)
                  }
                )
              }
            },
            function(reject){
              console.log( 'reject profile' )
              console.log( reject )
            }
          );
        }

        function loginWithCode(code){
          return $http.post(config.apiUrl+'/v1/members/login/code', { code: code});
        }

        function loginWithPassword(password){
          return $http.post(config.apiUrl+'/v1/members/login/password', { password: password});
        }
    }
})();
