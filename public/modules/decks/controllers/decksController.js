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

		var iduser = "";

		$scope.checkUser = function() {
			$http.post('/authCheck').success(function(data) {
				if(data){
					iduser = data.iduser;
				} else {
					window.location = '#/login';
				}
			});
		};

		$scope.create = function() {
			var errorMessage = document.getElementById("errorMessage");
			var deckName = document.getElementById("name").value;
			var deckList = document.getElementById("decklist").value;
			var combinedStringJSON = JSON.parse('{"iduser": "' + iduser + '", "name": "' + deckName + '"}');

			$scope.checkUser();

			if(!deckName){
				showError(errorMessage, "Please enter a name for your deck. ");
			} else if (deckName.length > 255){
				showError(errorMessage, "Deck name is too long (Max 255 characters) ");
			} else if (!deckList){
				showError(errorMessage, "Please put at least one card in the deck. ");
			} else {
				$http.post('/getDeck', combinedStringJSON).success(function(data) {
					if(data){
						showError(errorMessage, "You already have a deck with that name. Please choose another. ");
					} else {
						/*
						$http.post('/createDeck', combinedStringJSON).success(function(data) {
							if(data){
								// Yup
							} 
						});	*/
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