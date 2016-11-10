// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('timetracker',
[
  'ionic',
  'ngCordova',
  'LocalForageModule',
  'ion-datetime-picker',
  'timetracker.controllers',
  'timetracker.customRequest',
  'timetracker.filters',
  'timetracker.services'
])


.constant('config', {
  apiUrl: 'https://timetracker-catenae.rhcloud.com/'
})

.run(function($ionicPlatform, $ionicPickerI18n) {

  $ionicPickerI18n.weekdays = ['Do', 'Lu', 'Ma', 'Me', 'Gi', 'Ve', 'Sa'];
  $ionicPickerI18n.months = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
  $ionicPickerI18n.ok = 'Ok';
  $ionicPickerI18n.cancel = 'Annulla';

  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($httpProvider, $stateProvider, $urlRouterProvider) {

  $httpProvider.interceptors.push('myHttpInterceptor');

  $stateProvider
  .state('index', {
    url: '/',
    cache: false,
    templateUrl: 'views/home.html',
    controller: 'IndexController',
    controllerAs: 'vm'
  })
  .state('login', {
    url: '/login',
    templateUrl: 'views/login.html',
    controller: 'LoginController',
    controllerAs: 'vm'
  })
  .state('logout', {
    url: '/logout',
    templateUrl: 'views/logout.html',
    controller: 'LoginController',
    controllerAs: 'vm'
  })
  .state('loginWithCode', {
    url: '/loginWithCode',
    templateUrl: 'views/loginWithCode.html',
    controller: 'LoginController',
    controllerAs: 'vm'
  })
  .state('loginWithQRCode', {
    url: '/loginWithQRCode',
    templateUrl: 'views/loginWithQRCode.html',
    controller: 'LoginController',
    controllerAs: 'vm'
  })
  .state('newTimeSheet', {
    url: '/newTimeSheet',
    cache: false,
    templateUrl: 'views/timeSheet-new.html',
    controller: 'TimeSheetController',
    controllerAs: 'vm'
  })
  .state('afterwardsTimeSheet', {
    url: '/afterwardsTimeSheet',
    cache: false,
    templateUrl: 'views/afterwards.html',
    controller: 'TimeSheetController',
    controllerAs: 'vm'
  })
  .state('timeSheet', {
    url: '/timeSheet',
    cache: false,
    templateUrl: 'views/timeSheet-list.html',
    controller: 'TimeSheetController',
    controllerAs: 'vm'
  })
  .state('timeSheetDetail', {
    url: '/timeSheet/:timesheetId',
    cache: false,
    templateUrl: 'views/timeSheet-detail.html',
    controller: 'TimeSheetController',
    controllerAs: 'vm'
  })
  .state('suggestion', {
    url: '/suggestion',
    cache: false,
    templateUrl: 'views/suggestion.html',
    controller: 'SuggestionController',
    controllerAs: 'vm'
  })

  $urlRouterProvider.otherwise('/');
})
