
(function() {
  'use strict';

  angular
  .module('timetracker.controllers', [])
  .controller('IndexController', IndexController)
  .controller('TimeSheetController', TimeSheetController)
  .controller('SuggestionController', SuggestionController)
  .controller('LoginController', LoginController);


  SuggestionController.$inject = ['$ionicLoading', 'SuggestionService', '$location', '$ionicPopup'];
  function SuggestionController($ionicLoading, SuggestionService, $location, $ionicPopup) {
    var vm = this;

    vm.send = function() {
      $ionicLoading.show();

        SuggestionService.send( vm.message ).then(
          function(resolve){
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
              title: 'Fatto!',
              template: 'Grazie per il contributo'
            });

            alertPopup.then(function(res) {
              $location.path('/');
            });
          },
          function(reject){
            //console.log( reject )
            $ionicLoading.hide();
          }
        )
    }
  }

  TimeSheetController.$inject = ['$ionicLoading', 'TimeService', '$location', '$stateParams', '$ionicPopup'];
  function TimeSheetController($ionicLoading, TimeService, $location, $stateParams, $ionicPopup) {
    var vm = this;

    vm.canAddAfterward = false;

    vm.timesheetId = $stateParams.timesheetId;
    vm.timesheet = {}; //single element

    vm.timesheetList = []; //list of all element
    vm.timesheetPage = 0; //actual page for list of all element
    vm.timesheetTotal = 0; //total record for the member
    vm.hasMorePages = true;
    vm.closePast = false;

    vm.OpenClosePast = function() {
      vm.closePast = true;
    }
    vm.getAll = function() {
      $ionicLoading.show();
      TimeService.getAll( vm.timesheetPage+1 ).then(
        function(resolve){
          vm.timesheetList = vm.timesheetList.concat(resolve.data);
          vm.timesheetTotal = resolve.total;
          vm.timesheetPage = resolve.page;
          if( vm.timesheetList.length >= resolve.total ){
            vm.hasMorePages = false;
          }
          // $scope.$apply()
          $ionicLoading.hide();
        }
      )
    }

    vm.getOne = function() {
      $ionicLoading.show();
      TimeService.getOne( $stateParams.timesheetId ).then(
        function(resolve){
          vm.timesheet = resolve;
          $ionicLoading.hide();
        }
      )
    }

    vm.closeOne = function() {
      $ionicLoading.show();
      TimeService.closeOne( $stateParams.timesheetId ).then(
        function(resolve){
          $ionicLoading.hide();
        }
      )
    }

    vm.removeOne = function() {
      $ionicLoading.show();
      TimeService.remove( $stateParams.timesheetId ).then(
        function(resolve){
          vm.timesheet = resolve;
          $ionicLoading.hide();
          $location.path('/');
        }
      )
    }

    vm.closeOnePast = function() {
      $ionicLoading.show();
      TimeService.closeOne( $stateParams.timesheetId, vm.closeTo ).then(
        function(resolve){
          vm.timesheet = resolve;
          vm.closePast = false;
          $ionicLoading.hide();
        },
        function(reject){
          var alertPopup = $ionicPopup.alert({
            title: 'Errore!',
            template: reject['data'].message
          });

          alertPopup.then(function(res) {
          });
          $ionicLoading.hide();
        }
      )
    }

    vm.getOpenTimesheet = function() {
      $ionicLoading.show();
      TimeService.getOpen().then(
        function(resolve){
          if( resolve.total > 0){
            vm.openTimeSheetFound = true;
            vm.openTimeSheetLink = '#/timeSheet/'+resolve.data[0]._id;
          } else {
            vm.openTimeSheetFound = false;
          }
          $ionicLoading.hide();
        }
      )
    }

    vm.start = function() {
      $ionicLoading.show();
      TimeService.start().then(
        function(resolve){
          $ionicLoading.hide();
          $location.path('/timeSheet/'+resolve.timesheet._id);
        },
        function(reject){
            $ionicLoading.hide();
        }
      )
    }

    vm.checkCanAddAfterward = function() {
      vm.canAddAfterward = false;
      var fromDate = new Date( vm.afFrom );
      var toDate = new Date( vm.afTo );
      if( ( toDate.getTime() - fromDate.getTime() ) > 0){
        vm.canAddAfterward = true;
      }
    }

    vm.addAfterward = function() {
      $ionicLoading.show();
      var fromDate = new Date( vm.afFrom );
      var toDate = new Date( vm.afTo );
      TimeService.afterward(fromDate, toDate).then(
        function(resolve){
          $ionicLoading.hide();
          $location.path('/timeSheet/'+resolve.timesheet._id);
        },
        function(reject){
          var alertPopup = $ionicPopup.alert({
            title: 'Errore!',
            template: reject['data'].message
          });

          alertPopup.then(function(res) {
          });
          $ionicLoading.hide();
        }
      )
    }

  }

  IndexController.$inject = ['$ionicLoading', 'UserService', '$ionicPopup', 'TimeService'];
  function IndexController($ionicLoading, UserService, $ionicPopup, TimeService) {
    var vm = this;
    vm.isLogged = false;
    activate();

    vm.contact = function() {

      var alertPopup = $ionicPopup.alert({
        title: 'In Sviluppo!',
        template: 'Questa features non &egrave; al momento disponibile'
      });

      alertPopup.then(function(res) {

      });
    }
    vm.website = function() {

      var alertPopup = $ionicPopup.alert({
        title: 'In Sviluppo!',
        template: 'Questa features non &egrave; al momento disponibile'
      });

      alertPopup.then(function(res) {

      });
    }

    vm.startTimesheet = function() {
      $ionicLoading.show();
      TimeService.start().then(
        function(resolve){
          $ionicLoading.hide();
          vm.openTimeSheetFound = true;
          vm.openTimeSheetLink = '#/timeSheet/'+resolve.timesheet._id;
        },
        function(reject){
            $ionicLoading.hide();
        }
      )
    }

    function activate(){
      //console.log( 1 )
      $ionicLoading.show();
      UserService.isLogged().then(
        function(resolve){
          if( resolve && resolve.length>0 ){
            vm.isLogged = true;
            UserService.profile().then(
              function(resolve){
                vm.fullName = (resolve.first)? resolve.first + ' ' + resolve.last : resolve.email;
                vm.company = resolve.company;
                TimeService.getOpen().then(
                  function(resolve){
                    if( resolve.total > 0){
                      vm.openTimeSheetFound = true;
                      vm.openTimeSheetLink = '#/timeSheet/'+resolve.data[0]._id;
                    } else {
                      vm.openTimeSheetFound = false;
                    }
                    $ionicLoading.hide();
                  },
                  function(error){
                    $ionicLoading.hide();
                    var alertPopup = $ionicPopup.alert({
                      title: 'Errore!',
                      template: 'Prova a fare il logout e rientrare'
                    });

                    alertPopup.then(function(res) {

                    });
                  }
                );
              },
              function(reject){
                $ionicLoading.hide();
                //console.log( 'Can not get profile' )
                //console.log( reject )
              }
            );

          } else {
            $ionicLoading.hide();
            vm.isLogged = false;
          }
        },
        function(error){
          $ionicLoading.hide();
          //console.log( 'error login' )
          //console.log( error );
          vm.isLogged = false;
        }
      )
    }
  }

  LoginController.$inject = ['$ionicLoading', '$localForage', 'UserService', '$rootScope', '$state', '$ionicPopup', '$cordovaBarcodeScanner', '$ionicPlatform'];
  function LoginController($ionicLoading, $localForage, UserService, $rootScope, $state, $ionicPopup, $cordovaBarcodeScanner, $ionicPlatform) {
    var vm = this;
    vm.loginError = false;
    vm.scanResults = '';

    vm.qrcodeLogin = function() {

      var alertPopup = $ionicPopup.alert({
        title: 'In Sviluppo!',
        template: 'Questa features non &egrave; al momento disponibile'
      });

      alertPopup.then(function(res) {

      });
    }

    vm.pinLogin = function(){
      $ionicLoading.show();
      var code = '00000'+vm.pincode;
      code = code.substring( code.length - 5);
      UserService.loginWithCode( code ).then(
        function(res) {
          $localForage.setItem('token', res.data.token ).then(function () {
            return $localForage.getItem('token');
          }).then(function (value) {
            //console.log( value)
            $ionicLoading.hide();
            $rootScope.$broadcast('menu.render', '');
            $state.go('index', '')
          }).catch(function (err) {
            $ionicLoading.hide();
            // we got an error
          });
        },
        function(err) {
          $ionicLoading.hide();
          vm.loginError = true;
        }
      );
    }

    vm.logout = function(){
      $localForage.clear().then(
        function(ok){
          $state.go('index');
        },
        function(err){
          //console.log( err );
          $state.go('index');
        }
      );
    }


        vm.scan = function(){
            $ionicPlatform.ready(function() {
                $cordovaBarcodeScanner
                    .scan()
                    .then(function(result) {


                      UserService.loginWithPassword( result.text ).then(
                        function(res){
                          $localForage.setItem('token', res.data.token ).then(function () {
                            return $localForage.getItem('token');
                          }).then(function (value) {
                            //console.log( value)
                            $ionicLoading.hide();
                            $rootScope.$broadcast('menu.render', '');
                            $state.go('index', '')
                          }).catch(function (err) {
                            //console.log( err.toString() )
                            vm.scanResults = 'QRCode non valido';
                            $ionicLoading.hide();
                            // we got an error
                          });
                        },
                        function(err){
                          $ionicLoading.hide();
                          vm.loginError = true;
                          vm.scanResults = 'QRCode non valido';
                        }
                      );
                    }, function(error) {
                        //console.log( error )
                        vm.scanResults = 'QRCode non valido';
                    });
            });
        };

  }
})();
