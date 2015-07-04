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
			if(email == null || email == "" || password == null || password == "" || passwordConfirm == null || passwordConfirm == ""){
				errorMessage.style.display = "block";
				errorMessage.innerHTML = "Please fill out all fields. ";
			} else if (password.length < 6 ) {
				errorMessage.style.display = "block";
				errorMessage.innerHTML = "Password must be at least 6 characters. ";
			} else if (password.length > 128) {
				errorMessage.style.display = "block";
				errorMessage.innerHTML = "Password is too long. (Max 128 characters)";
			} else if(email.length > 255){
				errorMessage.style.display = "block";
				errorMessage.innerHTML = "Email is too long. (Max 255 characters)";
			} else if(validEmailRegex.exec(email) == null ) {
				errorMessage.style.display = "block";
				errorMessage.innerHTML = "Invalid email address. ";
			} else {
				$http.post('/signupCheck', emailStringJSON).success(function(data, status, headers, config) {
					if(data == true){
						errorMessage.style.display = "block";
						errorMessage.innerHTML = "Email is already in use. ";
					} else {
						$http.post('/signup', combinedStringJSON).success(function(data, status, headers, config) {
							// May want to add something here on success
						});			
					}
				});
			}
		}
	}
]);