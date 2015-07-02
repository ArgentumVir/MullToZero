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
      .when('/select', {
        templateUrl: 'modules/decks/views/selectDeck.html',
        controller: 'decksController'
      })/*
      .when('/items/:listId', {
        templateUrl: 'modules/items/views/itemsView.html',
        controller: 'ItemsCtrl'
      })*/
      .otherwise({
        redirectTo: '/'
      });
  });