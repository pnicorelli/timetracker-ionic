(function() {
    'use strict';

    angular
        .module('timetracker.customRequest', [])
        .factory('myHttpInterceptor', myHttpInterceptor);

        myHttpInterceptor.$inject = ['$localForage'];
        function myHttpInterceptor($localForage) {
          var service = {
            request: request
          }

          return service;

          ///////////////////////////////
          // functions implementations //
          ///////////////////////////////

          function request(config) {
            return $localForage.getItem('token').then(
              function(resolve){
                if( resolve && resolve.length>0){
                  config.headers.Authorization = 'Token ' + resolve;
                } else {
                  // do nothing
                }
                return config;
              },
              function(reject){
                return config;
              }
            );

          }
        }
})();
