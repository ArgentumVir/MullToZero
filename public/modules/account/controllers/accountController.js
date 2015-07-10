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
		$scope.signup = function() {
			var email = document.getElementById("email").value;
			var password = document.getElementById("password").value;
			var passwordConfirm = document.getElementById("passwordConfirm").value;
			var errorMessage = document.getElementById("errorMessage");
			var emailStringJSON = JSON.parse('{"email": "' + email + '"}');
			var combinedStringJSON = JSON.parse('{"email": "' + email + '", "password": "' + password + '"}');
			var validEmailRegex =/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}\b/;

			// Check to make sure signup input is valid
			if(!email || !password || !passwordConfirm){
				showError(errorMessage, "Please fill out all fields. ");
			} else if (password.length < 6 ) {
				showError(errorMessage, "Password must be at least 6 characters. ");
			} else if (password.length > 128) {
				showError(errorMessage, "Password is too long. (Max 128 characters)");
			} else if(email.length > 255){
				showError(errorMessage, "Email is too long. (Max 255 characters)");
			} else if(!validEmailRegex.exec(email)) {
				showError(errorMessage, "Invalid email address.");
			} else {
				$http.post('/signupCheck', emailStringJSON).success(function(data) {
					if(data){
						showError(errorMessage, "Email is already in use.");
					} else {
						$http.post('/signup', combinedStringJSON).success(function(data) {
							// Global work around is probably not the best idea
							$rootScope.$broadcast('userLoggedIn', {user: email});
							window.location = data;
						});			
					}
				});
			}
		};

		//Debuggin function
		$scope.checkAuth = function() {
			$http.post('/authCheck').success(function(data) {
				console.log(data);
			});
		};

		$scope.login = function() {
			var email = document.getElementById("email").value;
			var password = document.getElementById("password").value;
			var errorMessage = document.getElementById("errorMessage");
			var combinedStringJSON = JSON.parse('{"email": "' + email + '", "password": "' + password + '"}');
			var validEmailRegex =/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}\b/;

			if(!email || !password){
				showError(errorMessage, "Please fill out all fields. ");
			} else if (password.length < 6 ) {
				showError(errorMessage, "Password must be at least 6 characters. ");
			} else if (password.length > 128) {
				showError(errorMessage, "Password is too long. (Max 128 characters)");
			} else if(email.length > 255){
				showError(errorMessage, "Email is too long. (Max 255 characters)");
			} else if(!validEmailRegex.exec(email)) {
				showError(errorMessage, "Invalid email address.");
			} else {
				$http.post('/loginCheck', combinedStringJSON).success(function(data) {
					if(!data){
						showError(errorMessage, "Invalid email or password. ");
					} else {
						$http.post('/login', combinedStringJSON).success(function(data) {
							// Global work around is probably not the best idea
							$rootScope.$broadcast('userLoggedIn', {user: email});
							window.location = data;
						});		
					}
				});			
			}
		};

		function showError(errorMessage, errorString) {
    		errorMessage.style.display = "block";
    		errorMessage.innerHTML = errorString;
		}
	}
]);