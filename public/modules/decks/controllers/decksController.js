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
.controller('decksController', ['$scope', '$rootScope', '$http',
	function($scope,  $rootScope, $http) {

		$scope.checkUser = function() {
			$http.post('/authCheck').success(function(data) {
				if(data){
					console.log("data: " + data);
				} else {
					window.location = '#/login';
				}
			});
		};



	}
]);