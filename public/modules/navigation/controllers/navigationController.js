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
.controller('navigationController', ['$scope', '$rootScope', '$http', '$route', 
	function($scope, $rootScope, $http, $route) {

		$scope.$on("userLoggedIn",function(event,args) {
    		if(args){
        		document.getElementById("login").style.display = "none";
        		document.getElementById("signup").style.display = "none";
        		document.getElementById("logout").style.display = "block";
        		document.getElementById("profile").style.display = "block";
        		document.getElementById("select").style.display = "block";
        		document.getElementById("add").style.display = "block";
        		document.getElementById("profile").innerHTML = args.user;
        	}
		});

		$scope.checkUser = function() {
			$http.post('/authCheck').success(function(data) {
				if(data){
					document.getElementById("login").style.display = "none";
        			document.getElementById("signup").style.display = "none";
        			document.getElementById("logout").style.display = "block";
        			document.getElementById("profile").style.display = "block";
        			document.getElementById("select").style.display = "block";
        			document.getElementById("add").style.display = "block";
        			document.getElementById("profile").innerHTML = data.email;
				}

			});
		};

		$scope.logout = function () {
			$http.get('/logout');
			document.getElementById("login").style.display = "block";
    		document.getElementById("signup").style.display = "block";
    		document.getElementById("logout").style.display = "none";
    		document.getElementById("profile").style.display = "none";
    		document.getElementById("select").style.display = "none";
        	document.getElementById("add").style.display = "none";
		};

	}
]);