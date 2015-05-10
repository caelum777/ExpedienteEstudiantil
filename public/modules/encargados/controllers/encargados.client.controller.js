'use strict';

// Encargados controller
angular.module('encargados').controller('EncargadosController', ['$scope', '$stateParams', '$location', 'Authentication', 'Encargados',
	function($scope, $stateParams, $location, Authentication, Encargados) {
		$scope.authentication = Authentication;

		// Create new Encargado
		$scope.create = function() {
			// Create new Encargado object
			var encargado = new Encargados ({
				name: this.name
			});

			// Redirect after save
			encargado.$save(function(response) {
				$location.path('encargados/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Encargado
		$scope.remove = function(encargado) {
			if ( encargado ) { 
				encargado.$remove();

				for (var i in $scope.encargados) {
					if ($scope.encargados [i] === encargado) {
						$scope.encargados.splice(i, 1);
					}
				}
			} else {
				$scope.encargado.$remove(function() {
					$location.path('encargados');
				});
			}
		};

		// Update existing Encargado
		$scope.update = function() {
			var encargado = $scope.encargado;

			encargado.$update(function() {
				$location.path('encargados/' + encargado._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Encargados
		$scope.find = function() {
			$scope.encargados = Encargados.query();
		};

		// Find existing Encargado
		$scope.findOne = function() {
			$scope.encargado = Encargados.get({ 
				encargadoId: $stateParams.encargadoId
			});
		};
	}
]);