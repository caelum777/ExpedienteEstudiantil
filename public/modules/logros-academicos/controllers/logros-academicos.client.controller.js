'use strict';

// Logros academicos controller
angular.module('logros-academicos').controller('LogrosAcademicosController', ['$scope', '$stateParams', '$location', 'Authentication', 'LogrosAcademicos',
	function($scope, $stateParams, $location, Authentication, LogrosAcademicos) {
		$scope.authentication = Authentication;

		// Create new Logros academico
		$scope.create = function() {
			// Create new Logros academico object
			var logrosAcademico = new LogrosAcademicos ({
				name: this.name
			});

			// Redirect after save
			logrosAcademico.$save(function(response) {
				$location.path('logros-academicos/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Logros academico
		$scope.remove = function(logrosAcademico) {
			if ( logrosAcademico ) { 
				logrosAcademico.$remove();

				for (var i in $scope.logrosAcademicos) {
					if ($scope.logrosAcademicos [i] === logrosAcademico) {
						$scope.logrosAcademicos.splice(i, 1);
					}
				}
			} else {
				$scope.logrosAcademico.$remove(function() {
					$location.path('logros-academicos');
				});
			}
		};

		// Update existing Logros academico
		$scope.update = function() {
			var logrosAcademico = $scope.logrosAcademico;

			logrosAcademico.$update(function() {
				$location.path('logros-academicos/' + logrosAcademico._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Logros academicos
		$scope.find = function() {
			$scope.logrosAcademicos = LogrosAcademicos.query();
		};

		// Find existing Logros academico
		$scope.findOne = function() {
			$scope.logrosAcademico = LogrosAcademicos.get({ 
				logrosAcademicoId: $stateParams.logrosAcademicoId
			});
		};
	}
]);