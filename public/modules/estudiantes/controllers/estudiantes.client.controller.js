'use strict';

// Estudiantes controller
angular.module('estudiantes').controller('EstudiantesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Estudiantes',
	function($scope, $stateParams, $location, Authentication, Estudiantes) {
		$scope.authentication = Authentication;
        $scope.options =
        [{
            nombre: 'San Jose',
            cantones: [{
                nombre: 'San Jose',
                distritos: [{nombre: 'Carmen'}, {nombre: 'Merced'}, {nombre: 'Hospital'}]
            }]
        }, {
            nombre: 'Alajuela',
            cantones: [{
                nombre: 'Alajuela',
                distritos: [{nombre: 'Alajuela'}]
            }, {
                nombre: 'San Ramon',
                distritos: [{nombre: 'San Ramon'}]
            }]
        }];
        $scope.provincia = $scope.options[0];
        $scope.canton =  $scope.provincia.cantones[0];
        $scope.distrito = $scope.canton.distritos[0];

        $scope.provincia_change = function() {
            $scope.canton =  $scope.provincia.cantones[0];
            $scope.distrito = $scope.canton.distritos[0];
        };

        $scope.canton_change = function(){
            $scope.distrito = $scope.canton.distritos[0];
        };

		// Create new Estudiante
		$scope.create = function() {
			// Create new Estudiante object
			var estudiante = new Estudiantes ({
				name: this.name,
                primer_apellido: this.primer_apellido,
                segundo_apellido: this.segundo_apellido,
                nacionalidad: this.nacionalidad,
                sexo: this.sexo,
                fecha_de_nacimiento: this.fecha_de_nacimiento,
                telefono_casa: this.telefono_casa,
                celular: this.celular,
                correo: this.correo,
                provincia: this.provincia,
                canton: this.canton,
                distrito: this.distrito,
                barrio: this.barrio,
                direccion_exacta: this.direccion_exacta,
                foto: this.foto,
                colegio_procedencia: this.colegio_procedencia,
                adecuacion_sig: this.adecuacion_sig,
                adecuacion_nsig: this.adecuacion_nsig
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