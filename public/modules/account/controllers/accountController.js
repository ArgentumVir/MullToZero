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
.module('mullToZeroApp')
.controller('accountController', ['$scope', '$rootScope', '$http', '$route', 
	function($scope, $rootScope, $http, $route) {
		$scope.accountInit = function () {
			$scope.loginMessage = "sure";
		};
	}
]);