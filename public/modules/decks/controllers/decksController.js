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
		/*$scope.getLists = function() {
			$http.get('/app/json/lists.json').success(function(data, status, headers, config) {
			   $scope.results = data;
			   var listNames = [];
			   for (var i = 0; i < data.length; i++) {
				   listNames[i] = { "name": data[i].name, "id": data[i].id };
			   }
			   $rootScope.listNames = listNames;
			});
		};*/
	}
]);