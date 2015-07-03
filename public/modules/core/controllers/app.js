'use strict';

/**
 * @ngdoc overview
 * @name MullToZero
 * @description
 * # Magic The Gathering hand simulation application
 *
 * Main module of the application.
 */
angular
  .module('mullToZeroApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'modules/core/views/welcome.html'
      }) 
      .when('/login/', {
        templateUrl: 'modules/account/views/login.html',
        controller: 'accountController'
      })
      .when('/signup', {
        templateUrl: 'modules/account/views/signup.html',
        controller: 'accountController'
      })
      .when('/profile/:iduser', {
        templateUrl: 'modules/account/views/profile.html',
        controller: 'accountController'
      })
      .when('/select', {
        templateUrl: 'modules/decks/views/selectDeck.html',
        controller: 'decksController'
      })
      .otherwise({
        redirectTo: '/'
      });
  })/*
  .controller('accountController', ['$scope', '$rootScope', '$http', '$route', 
  function($scope, $rootScope, $http, $route) {
    $scope.accountInit = function () {
      $scope.loginMessage = "sure";
    };
  }
])
  .controller('decksController', ['$scope', '$rootScope', '$http',
  function($scope,  $rootScope, $http) {
  }
])*/;