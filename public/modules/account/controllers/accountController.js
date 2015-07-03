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
			//$scope.loginMessage = $route.current.params.message;
			//alert("Yup: " + $scope.loginMessage);
		};

		$scope.signup = function() {
			var email = document.getElementById("email").value;
			var password = document.getElementById("password").value;
			var passwordConfirm = document.getElementById("passwordConfirm").value;
			var errorMessage = document.getElementById("errorMessage");
			var emailStringJSON = '{"email": "' + email + '"}';
			var passwordStringJSON = '{"password": "' + password + '"}';

			if(email == null || email == "" || password == null || password == "" || passwordConfirm == null || passwordConfirm == ""){
				errorMessage.style.display = "block";
				errorMessage.innerHTML = "Please fill out all fields. ";
			} else if(email.length > 255){
				errorMessage.style.display = "block";
				errorMessage.innerHTML = "Email is too long. (Max 255 characters)";
			} else {
				$http.post('/signupCheck', JSON.parse(emailStringJSON)).success(function(data, status, headers, config) {
					if(data == true){
						errorMessage.style.display = "block";
						errorMessage.innerHTML = "Email is already in use. ";
					} else {
						// There's the proper way to do something, and then there's this way
						var form = document.createElement("form");
					    form.setAttribute("method", "post");
					    form.setAttribute("action", "/signup");

					    var emailField = document.createElement("input");
			            emailField.setAttribute("type", "hidden");
			            emailField.setAttribute("name", "email");
			            emailField.setAttribute("value", email);
			            var passwordField = document.createElement("input");
			            emailField.setAttribute("type", "hidden");
			            emailField.setAttribute("name", "password");
			            emailField.setAttribute("value", password);

			            form.appendChild(emailField);
			            form.appendChild(passwordField);
			            form.submit();
			            console.log("Form submitted");					
					}
				});
			}


		}
	}
]);