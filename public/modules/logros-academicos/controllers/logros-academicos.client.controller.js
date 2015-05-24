'use strict';

// Logros academicos controller
angular.module('logros-academicos').controller('LogrosAcademicosController', ['$scope', '$stateParams', '$location', 'Authentication', 'LogrosAcademicos','GetLogro',
	function($scope, $stateParams, $location, Authentication, LogrosAcademicos, GetLogro) {
		$scope.authentication = Authentication;
        $scope.name = '';
        $scope.estudiante = '';
        $scope.descripcion = '';
        $scope.premio = '';

		// Create new Logros academico
		$scope.create = function() {
			// Create new Logros academico object
			var logrosAcademico = new LogrosAcademicos ({
				name: $scope.name,
                estudiante: $stateParams.cedulaEstudiante,
                descripcion: $scope.descripcion,
                premio: $scope.premio,
                anno: new Date().getFullYear()
			});

			// Redirect after save
			logrosAcademico.$save(function(response) {
                $location.path('estudiantes/' + $stateParams.estudianteId);

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
					//$location.path('logros-academicos');
                    $location.path('logros-academicos/' + $stateParams.estudianteId+'/'+$stateParams.cedulaEstudiante);
				});
			}
		};

		// Update existing Logros academico
		$scope.update = function() {
			var logrosAcademico = $scope.logrosAcademico;

			logrosAcademico.$update(function() {
				//$location.path('logros-academicos/' + logrosAcademico._id);
                $location.path('logros-academicos/' + $stateParams.estudianteId+'/'+$stateParams.cedulaEstudiante+'/'+logrosAcademico._id);
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
            $scope.cedulaEstudianteUrl = $stateParams.cedulaEstudiante;
            $scope.idEstudianteUrl = $stateParams.estudianteId;
			$scope.logrosAcademico = LogrosAcademicos.get({ 
				logrosAcademicoId: $stateParams.logrosAcademicoId
			});
		};

        $scope.findByEstudiante = function() {
            $scope.cedula = $stateParams.cedulaEstudiante;
            $scope.estudianteID = $stateParams.estudianteId;
            $scope.logrosAcademicosE = GetLogro.query({
                cedula:$scope.cedula
            });
        };
	}
]);