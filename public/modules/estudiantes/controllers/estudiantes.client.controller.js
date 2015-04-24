'use strict';

// Estudiantes controller
angular.module('estudiantes').controller('EstudiantesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Estudiantes', '$upload', '$q',
	function($scope, $stateParams, $location, Authentication, Estudiantes, $upload, $q) {
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
        $scope.sexos = [{nombre: 'Masculino'}, {nombre: 'Femenino'}];

        $scope.provincia = $scope.options[0];
        $scope.canton =  $scope.provincia.cantones[0];
        $scope.distrito = $scope.canton.distritos[0];
        $scope.sexo = $scope.sexos[0];
        $scope.foto = '';
        $scope.selectedFile = [];

        $scope.provincia_change = function() {
            $scope.canton =  $scope.provincia.cantones[0];
            $scope.distrito = $scope.canton.distritos[0];
        };

        $scope.canton_change = function(){
            $scope.distrito = $scope.canton.distritos[0];
        };

        $scope.onFileSelect = function ($files) {
            if($files !== [])
                $scope.selectedFile = $files;
        };

		// Create new Estudiante
		$scope.create = function() {
            //Uploads photo
            var file = $scope.selectedFile[0];
            $scope.upload = $upload.upload({
                url: '/upload',
                method: 'POST',
                file: file
            }).success(function(data) {
                $scope.foto = data.name;
                insertarEstudiante();
            });

            function insertarEstudiante(){
                // Create new Estudiante object
                var estudiante = new Estudiantes ({
                    name: $scope.name,
                    primer_apellido: $scope.primer_apellido,
                    segundo_apellido: $scope.segundo_apellido,
                    nacionalidad: $scope.nacionalidad,
                    sexo: $scope.sexo.nombre,
                    fecha_de_nacimiento: $scope.fecha_de_nacimiento,
                    telefono_casa: $scope.telefono_casa,
                    celular: $scope.celular,
                    correo: $scope.correo,
                    provincia: $scope.provincia.nombre,
                    canton: $scope.canton.nombre,
                    distrito: $scope.distrito.nombre,
                    barrio: $scope.barrio,
                    direccion_exacta: $scope.direccion_exacta,
                    foto: $scope.foto,
                    colegio_procedencia: $scope.colegio_procedencia,
                    adecuacion_sig: $scope.adecuacion_sig,
                    adecuacion_nsig: $scope.adecuacion_nsig
                });

                // Redirect after save
                estudiante.$save(function(response) {
                    $location.path('estudiantes/' + response._id);

                    // Clear form fields
                    $scope.name = '';
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            }
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