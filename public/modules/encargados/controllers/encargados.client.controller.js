'use strict';

// Encargados controller
angular.module('encargados').controller('EncargadosController', ['$scope', '$stateParams', '$location', 'Authentication', 'Encargados','GetEncargado', 'Utility',
	function($scope, $stateParams, $location, Authentication, Encargados, GetEncargado, Utility) {
		$scope.authentication = Authentication;
        $scope.estudiante = '';
        $scope.name = '';
        $scope.primer_apellido = '';
        $scope.segundo_apellido = '';
        $scope.cedula = '';
        $scope.parentesco = '';
        $scope.ocupacion = '';
        $scope.estado_civil = '';
        $scope.nacionalidad = '';
        $scope.telefono = '';
        $scope.correo = '';
        $scope.direccion = '';
        //$scope.opciones = [{opcion: 'No'}, {opcion: 'Si'}];
        //$scope.eleccion = $scope.opciones[0];

        //Datos para las URL
        $scope.idEstudianteUrl = '';
        $scope.cedulaEstudianteUrl ='';


        // Create new Encargado
		$scope.create = function() {
			// Create new Encargado object
            console.log($scope.parentesco);
			var encargado = new Encargados ({
                estudiante: $stateParams.cedulaEstudiante,
				name: $scope.name,
                primer_apellido:$scope.primer_apellido,
                segundo_apellido: $scope.segundo_apellido,
                cedula: $scope.cedula,
                parentesco: $scope.parentesco.relationship,
                ocupacion: $scope.ocupacion,
                estado_civil: $scope.estado_civil,
                nacionalidad: $scope.nacionalidad,
                telefono: $scope.telefono,
                correo: $scope.correo,
                direccion: $scope.direccion
                //responsable: $scope.eleccion.opcion
			});
            $scope.cedula = $stateParams.cedulaEstudiante;
            $scope.idEtudianteUrl = $stateParams.estudianteId;
            $scope.encargadosE = GetEncargado.query({
                    cedula:$scope.cedula
            });
            $scope.encargadosE.$promise.then(function(){
                if($scope.encargadosE.length < 2){
                    encargado.$save(function (response) {
                        //$location.path('encargados/' + response._id);
                        $location.path('estudiantes/' + $stateParams.estudianteId);

                        // Clear form fields
                        $scope.name = '';
                    }, function (errorResponse) {
                        $scope.error = errorResponse.data.message;
                    });
                }
                else{
                    $scope.error = 'Ya hay más de dos encargados';
                }
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
					//$location.path('encargados');
                    $location.path('encargados/' + $stateParams.estudianteId+'/'+$stateParams.cedulaEstudiante);
				});
			}
		};

		// Update existing Encargado
		$scope.update = function() {
			var encargado = $scope.encargado;
            encargado.parentesco = $scope.parentesco.relationship;
            //encargado.responsable = $scope.eleccion.opcion;
			encargado.$update(function() {
				//$location.path('encargados/' + encargado._id);
                $location.path('encargados/' + $stateParams.estudianteId+'/'+$stateParams.cedulaEstudiante+'/'+encargado._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Encargados
		$scope.find = function() {
			$scope.encargados = Encargados.query();
		};

        $scope.findByEstudiante = function() {
            $scope.cedula = $stateParams.cedulaEstudiante;
            $scope.estudianteID = $stateParams.estudianteId;
            $scope.encargadosE = GetEncargado.query({
                cedula:$scope.cedula
            });
        };

		// Find existing Encargado
		$scope.findOne = function() {
            $scope.cedulaEstudianteUrl = $stateParams.cedulaEstudiante;
            $scope.idEstudianteUrl = $stateParams.estudianteId;
			$scope.encargado = Encargados.get({
				encargadoId: $stateParams.encargadoId
			});

            $scope.encargado.$promise.then(function(estudiante) {
                $scope.parentesco = $scope.setParentescoComboBox(estudiante.parentesco);
            });
		};

        $scope.relationshipStudentList = Utility.getRelationshipList();
        $scope.parentesco = $scope.relationshipStudentList[0];

        $scope.setParentescoComboBox = function(parentesco){
            for(var i = 0; i < $scope.relationshipStudentList.length; i++){
                if ($scope.relationshipStudentList[i].relationship === parentesco){
                    return $scope.relationshipStudentList[i];
                }
            }
        };
       /* $scope.isResponsable = function(value) {
            if (value === true)
                $scope.responsableS = 'Si'
            else
                $scope.responsableS = 'No'
        };*/
	}
]);
