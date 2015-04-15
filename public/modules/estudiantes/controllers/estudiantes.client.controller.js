'use strict';

// Estudiantes controller
angular.module('estudiantes').controller('EstudiantesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Estudiantes',
	function($scope, $stateParams, $location, Authentication, Estudiantes) {
		$scope.authentication = Authentication;

		// Create new Estudiante
		$scope.create = function() {
			// Create new Estudiante object
			var estudiante = new Estudiantes ({
				name: this.name
			});

			// Redirect after save
			estudiante.$save(function(response) {
				$location.path('estudiantes/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Estudiante
		$scope.remove = function(estudiante) {
			if ( estudiante ) { 
				estudiante.$remove();

				for (var i in $scope.estudiantes) {
					if ($scope.estudiantes [i] === estudiante) {
						$scope.estudiantes.splice(i, 1);
					}
				}
			} else {
				$scope.estudiante.$remove(function() {
					$location.path('estudiantes');
				});
			}
		};

		// Update existing Estudiante
		$scope.update = function() {
			var estudiante = $scope.estudiante;

			estudiante.$update(function() {
				$location.path('estudiantes/' + estudiante._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Estudiantes
		$scope.find = function() {
			$scope.estudiantes = Estudiantes.query();
		};

		// Find existing Estudiante
		$scope.findOne = function() {
			$scope.estudiante = Estudiantes.get({ 
				estudianteId: $stateParams.estudianteId
			});
		};
	}
]);