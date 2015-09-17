'use strict';

// Estudiantes controller
angular.module('estudiantes').controller('EstudiantesController', ['$scope', '$stateParams', '$location', '$filter', '$http', '$sce', 'Authentication', 'Estudiantes', '$upload', 'Notas', 'GetNotas', 'GetAdmitidos', 'Decimo', 'Undecimo', 'Nacionalidad',
	function($scope, $stateParams, $location, $filter, $http, $sce, Authentication, Estudiantes, $upload, Notas, GetNotas, GetAdmitidos, Decimo, Undecimo, Nacionalidad) {
		$scope.authentication = Authentication;
        $scope.options = $http.get('codigo-postal.json').then(function(data){
            $scope.options = data.data;
            $scope.provincia = $scope.options[0];
            $scope.canton =  $scope.provincia.cantones[0];
            $scope.distrito = $scope.canton.distritos[0];
        });
        $scope.sexos = [{nombre: 'Masculino'}, {nombre: 'Femenino'}];
        $scope.adecuaciones = [{nombre: 'Tiene'}, {nombre: 'No tiene'}];
        $scope.consultas = [{nombre: 'Nombre'}, {nombre: 'Cedula'}, {nombre: 'Colegio de Procedencia'}];
        $scope.consultas_genero = [{sexo: 'Masculino'}, {sexo: 'Femenino'}, {sexo: 'Ambos'}];
        $scope.consultas_grado = [{grado: 'Décimo'}, {grado: 'Undécimo'}, {grado: 'Décimo y Undécimo'}];
        $scope.consultas_estado = [{estado: 'Todos'}, {estado: 'Egresado'}, {estado: 'Trasladado'}];
        $scope.consulta = $scope.consultas[0];
        $scope.consulta_sexo = $scope.consultas_genero[0];
        $scope.consulta_grado = $scope.consultas_grado[0];
        $scope.consulta_estado = $scope.consultas_estado[0];
        $scope.sexo = $scope.sexos[0];
        $scope.adSignificativa = $scope.adecuaciones[0];
        $scope.adNoSignificativa = $scope.adecuaciones[0];
        $scope.foto = '';
        $scope.editable = false;
        $scope.selectedFile = [];
        $scope.selected_certificacion_nacimiento = [];
        $scope.selected_certificacion_notas = [];
        $scope.selected_inf_hogar = [];
        $scope.selected_vacunas = [];
        $scope.generacion = 0;

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
        $scope.on_select_cer_nacimiento = function ($files) {
            if($files !== [])
                $scope.selected_certificacion_nacimiento = $files;
        };
        $scope.on_select_cer_notas = function ($files) {
            if($files !== [])
                $scope.selected_certificacion_notas = $files;
        };
        $scope.on_select_infor_hogar = function ($files) {
            if($files !== [])
                $scope.selected_inf_hogar = $files;
        };
        $scope.on_select_tarje_vacunas = function ($files) {
            if($files !== [])
                $scope.selected_vacunas = $files;
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
                var eg = 0;
                if($scope.generacion < new Date().getFullYear()-1){
                    eg = 1;
                }
                var ad = 0;
                if($scope.generacion < new Date().getFullYear()){
                    ad = 1;
                }
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
                    admitido: ad,
                    foto: $scope.foto,
                    anno_ingreso: $scope.generacion,
                    colegio_procedencia: $scope.colegio_procedencia,
                    adecuacion_sig: $scope.adecuacion_sig,
                    adecuacion_nsig: $scope.adecuacion_nsig,
                    graduado: eg
                });


                // Redirect after save
                estudiante.$save(function(response) {

                    for(var i = 0; i < $scope.notas_septimo.length; i++) {



                        var notaS = new Notas ({
                            cedula_estudiante: $scope.nacionalidad,
                            grado: 'septimo',
                            curso: $scope.notas_septimo[i].curso,
                            nota: $scope.notas_septimo[i].nota,
                            anno: estudiante.anno_ingreso-3,
                            semestre: 0
                        });


                        var notaO = new Notas ({
                            cedula_estudiante: $scope.nacionalidad,
                            grado: 'octavo',
                            curso: $scope.notas_octavo[i].curso,
                            nota: $scope.notas_octavo[i].nota,
                            anno: estudiante.anno_ingreso-2,
                            semestre: 0
                        });

                        var notaN = new Notas ({
                            cedula_estudiante: $scope.nacionalidad,
                            grado: 'noveno',
                            curso: $scope.notas_noveno[i].curso,
                            nota: $scope.notas_noveno[i].nota,
                            anno: estudiante.anno_ingreso-1,
                            semestre: 0
                        });


                        notaS.$save(function(response) {
                        }, function(errorResponse) {
                            $scope.error = errorResponse.data.message;
                        });


                        notaO.$save(function(response) {
                        }, function(errorResponse) {
                            $scope.error = errorResponse.data.message;
                        });


                        notaN.$save(function(response) {
                        }, function(errorResponse) {
                            $scope.error = errorResponse.data.message;
                        });



                    }
                    for(var j = 0; j < $scope.notas_decimo_1.length; j++) {
                        var notaD1 = new Notas ({
                            cedula_estudiante: $scope.nacionalidad,
                            grado: 'decimo',
                            curso: $scope.notas_decimo_1[j].curso,
                            nota: $scope.notas_decimo_1[j].nota,
                            anno: estudiante.anno_ingreso,
                            semestre: 1
                        });
                        var notaD2 = new Notas ({
                            cedula_estudiante: $scope.nacionalidad,
                            grado: 'decimo',
                            curso: $scope.notas_decimo_2[j].curso,
                            nota: $scope.notas_decimo_2[j].nota,
                            anno: estudiante.anno_ingreso,
                            semestre: 2
                        });
                        var notaU1 = new Notas ({
                            cedula_estudiante: $scope.nacionalidad,
                            grado: 'undecimo',
                            curso: $scope.notas_undecimo_1[j].curso,
                            nota: $scope.notas_undecimo_1[j].nota,
                            anno: estudiante.anno_ingreso + 1,
                            semestre: 1
                        });
                        var notaU2 = new Notas ({
                            cedula_estudiante: $scope.nacionalidad,
                            grado: 'undecimo',
                            curso: $scope.notas_undecimo_2[j].curso,
                            nota: $scope.notas_undecimo_2[j].nota,
                            anno: estudiante.anno_ingreso + 1,
                            semestre: 2
                        });
                        notaD1.$save(function(response) {
                        }, function(errorResponse) {
                            $scope.error = errorResponse.data.message;
                        });
                        notaD2.$save(function(response) {
                        }, function(errorResponse) {
                            $scope.error = errorResponse.data.message;
                        });
                        notaU1.$save(function(response) {
                        }, function(errorResponse) {
                            $scope.error = errorResponse.data.message;
                        });
                        notaU2.$save(function(response) {
                        }, function(errorResponse) {
                            $scope.error = errorResponse.data.message;
                        });
                    }
                    $location.path('estudiantes/' + response._id);
                    // Clear form fields
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
                var notas = $scope.notas;
                angular.forEach(notas, function (nota) {
                    Notas.remove({ notaId: nota._id }, nota);
                });
			}
		};

		// Update existing Estudiante
		$scope.update = function() {
            var file = $scope.selectedFile[0];
            $scope.upload = $upload.upload({
                url: '/upload',
                method: 'POST',
                file: file
            }).success(function(data) {
                $scope.foto = data.name;
                $scope.updateEstudiantes();
            });
		};

        $scope.updateEstudiantes = function() {
            var estudiante = $scope.estudiante;
            estudiante.foto = $scope.foto;
            if($scope.sexo.nombre === 'Masculino'){
                estudiante.sexo = true;
            }
            else{
                estudiante.sexo = false;
            }
            if($scope.adSignificativa.nombre === 'Tiene'){
                estudiante.adSignificativa = true;
            }
            else{
                estudiante.adSignificativa = false;
            }
            if($scope.adNoSignificativa.nombre === 'Tiene'){
                estudiante.adNoSignificativa = true;
            }
            else{
                estudiante.adNoSignificativa = false;
            }
            estudiante.provincia = $scope.provincia.nombre;
            estudiante.canton = $scope.canton.nombre;
            estudiante.distrito = $scope.distrito.nombre;
            estudiante.$update(function() {
                $location.path('estudiantes/' + estudiante._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
            var notas = $scope.notas;
            angular.forEach(notas, function (nota) {
                for(var i = 0;i < $scope.notas_septimo.length; i++){
                    if(($scope.notas_septimo.grado===nota.grado)&&($scope.notas_septimo.curso===nota.curso)){
                        nota.nota = $scope.notas_septimo.nota;
                    }
                    else if(($scope.notas_octavo.grado===nota.grado)&&($scope.notas_octavo.curso===nota.curso)){
                        nota.nota = $scope.notas_octavo.nota;
                    }
                    else if(($scope.notas_noveno.grado===nota.grado)&&($scope.notas_noveno.curso===nota.curso)){
                        nota.nota = $scope.notas_noveno.nota;
                    }
                }
                Notas.update({ notaId: nota._id }, nota);
            });
        };

        $scope.estudiantes = [];
		// Find a list of Estudiantes/Cuando el parametro viene en true es para los estudiantes matriculados
		$scope.find = function(matriculado) {
			$scope.estudiantes = Estudiantes.query();
            $scope.ngGridEstudiantes(matriculado);
		};

        $scope.admitidos = function(admitido) {
            console.log(admitido);
            $scope.estudiantes = GetAdmitidos.query({admitido: admitido});
            console.log($scope.estudiantes);
            $scope.ngGridEstudiantes(admitido);
        };

		// Find existing Estudiante
		$scope.findOne = function(edit) {
            $scope.estudiante = Estudiantes.get({
                estudianteId: $stateParams.estudianteId
            });
            $scope.notas_septimo = [];
            $scope.notas_octavo =[];
            $scope.notas_noveno = [];
            $scope.editable = edit;
            $scope.estudiante.$promise.then(function(estudiante) {
                $scope.sexo = $scope.sexos[$scope.find($scope.sexos, $scope.estudiante.sexo, 0)];
                if(edit){

                    if($scope.adecuaciones[0].nombre === $scope.estudiante.adecuacion_sig){
                        $scope.adSignificativa = $scope.adecuaciones[0];
                    }
                    else{
                        $scope.adSignificativa = $scope.adecuaciones[1];
                    }
                    if($scope.adecuaciones[0].nombre === $scope.estudiante.adecuacion_nsig){
                        $scope.adNoSignificativa = $scope.adecuaciones[0];
                    }
                    else{
                        $scope.adNoSignificativa = $scope.adecuaciones[1];
                    }

                    var arr = $scope.findprovincia($scope.estudiante.provincia,$scope.estudiante.canton,$scope.estudiante.distrito);
                    $scope.provincia = $scope.options[arr[0]];
                    $scope.canton = $scope.options[arr[0]].cantones[arr[1]];
                    $scope.distrito = $scope.options[arr[0]].cantones[arr[1]].distritos[arr[2]];

                }
                $scope.notas = GetNotas.query({
                    cedula_estudiante: estudiante.nacionalidad
                });
                $scope.notas.$promise.then(function(notas) {
                    angular.forEach(notas, function (nota) {
                        if(nota.grado==='septimo'){
                            $scope.notas_septimo.push(nota);
                        }
                        else if(nota.grado==='octavo'){
                            $scope.notas_octavo.push(nota);
                        }
                        else if(nota.grado==='noveno'){
                            $scope.notas_noveno.push(nota);
                        }
                    });
                }, function(error) {
                    console.log('Failed: ' + error);
                });
            }, function(error) {
                console.log('Failed: ' + error);
            });
            $scope.initGridOptions();
		};

        $scope.find = function(arr, obj, val){
            var com = '';
            if(val === 0){
                if(obj){
                    com = 'Masculino';
                }
                else{
                    com = 'Femenino';
                }
            }
            else if(val === 1){
                if(obj){
                    com = 'Tiene';
                }
                else{
                    com = 'No Tiene';
                }
            }
            for(var i = 0;i < arr.length; i++){
                if(arr[i].nombre===com){
                    return i;
                }
            }
        };

        $scope.findprovincia = function(prov, can, dis){
            var retorno = [];
            var arr = $scope.options;
            var i = 0;
            for(i;i<arr.length;i++){
                if(arr[i].nombre === prov){
                    var j = 0;
                    for(j;j<arr[i].cantones.length;j++){
                        if(arr[i].cantones[j].nombre === can){
                            var g = 0;
                            for(g;g<arr[i].cantones[j].distritos.length;g++){
                                if(arr[i].cantones[j].distritos[g].nombre === dis){
                                    retorno.push(i);
                                    retorno.push(j);
                                    retorno.push(g);
                                    return retorno;
                                }
                            }
                        }
                    }
                }
            }
        };

        //Notas de los cursos
        $scope.initNotas = function(){
            var estudiante = $scope.estudiante;
            $scope.editable = true;
            $scope.notas_septimo = [
                {curso: 'Inglés', nota: 0, semestre: 0 },
                {curso: 'Matemática', nota: 0, semestre: 0},
                {curso: 'Ciencias', nota: 0, semestre: 0},
                {curso: 'Cívica', nota: 0, semestre: 0},
                {curso: 'Español', nota: 0, semestre: 0},
                {curso: 'Estudios Sociales', nota: 0, semestre: 0},
                {curso: 'Conducta', nota: 0, semestre: 0}];
            $scope.notas_octavo = [
                {curso: 'Inglés', nota: 0, semestre: 0},
                {curso: 'Matemática', nota: 0, semestre: 0},
                {curso: 'Ciencias', nota: 0, semestre: 0},
                {curso: 'Cívica', nota: 0, semestre: 0},
                {curso: 'Español', nota: 0, semestre: 0},
                {curso: 'Estudios Sociales', nota: 0, semestre: 0},
                {curso: 'Conducta', nota: 0, semestre: 0}];
            $scope.notas_noveno = [
                {curso: 'Inglés', nota: 0, semestre: 0},
                {curso: 'Matemática', nota: 0, semestre: 0},
                {curso: 'Ciencias', nota: 0, semestre: 0},
                {curso: 'Cívica', nota: 0, semestre: 0},
                {curso: 'Español', nota: 0, semestre: 0},
                {curso: 'Estudios Sociales', nota: 0, semestre: 0},
                {curso: 'Conducta', nota: 0}];
            $scope.notas_decimo_1 = [
                {curso: 'Español', nota: 0, semestre: 1},
                {curso: 'Matemáticas', nota: 0, semestre: 1},
                {curso: 'Física', nota: 0, semestre: 1},
                {curso: 'Química', nota: 0, semestre: 1},
                {curso: 'Biología', nota: 0, semestre: 1},
                {curso: 'Bioteclogía', nota: 0, semestre: 1},
                {curso: 'Computación', nota: 0, semestre: 1},
                {curso: 'Robótica', nota: 0, semestre: 1},
                {curso: 'Dibujo Técnico', nota: 0, semestre: 1},
                {curso: 'Inglés', nota: 0, semestre: 1},
                {curso: 'Investigación', nota: 0, semestre: 1},
                {curso: 'Historia', nota: 0, semestre: 1},
                {curso: 'Geografía', nota: 0, semestre: 1},
                {curso: 'Educ. Religiosa', nota: 0, semestre: 1},
                {curso: 'Educ. Cívica', nota: 0, semestre: 1},
                {curso: 'Educ. Física', nota: 0, semestre: 1},
                {curso: 'Matemática(PROF.)', nota: 0, semestre: 1},
                {curso: 'Física(PROF.)', nota: 0, semestre: 1},
                {curso: 'Química(PROF.)', nota: 0, semestre: 1},
                {curso: 'Biología(PROF.)', nota: 0, semestre: 1},
                {curso: 'Conducta', nota: 0, semestre: 1},
                {curso: 'Promedio', nota: 0, semestre: 1}];
            $scope.notas_decimo_2 = [
                {curso: 'Español', nota: 0, semestre: 2},
            {curso: 'Matemáticas', nota: 0, semestre: 2},
            {curso: 'Física', nota: 0, semestre: 2},
            {curso: 'Química', nota: 0, semestre: 2},
            {curso: 'Biología', nota: 0, semestre: 2},
            {curso: 'Bioteclogía', nota: 0, semestre: 2},
            {curso: 'Computación', nota: 0, semestre: 2},
            {curso: 'Robótica', nota: 0, semestre: 2},
            {curso: 'Dibujo Técnico', nota: 0, semestre: 2},
            {curso: 'Inglés', nota: 0, semestre: 2},
            {curso: 'Investigación', nota: 0, semestre: 2},
            {curso: 'Historia', nota: 0, semestre: 2},
            {curso: 'Geografía', nota: 0, semestre: 2},
            {curso: 'Educ. Religiosa', nota: 0, semestre: 2},
            {curso: 'Educ. Cívica', nota: 0, semestre: 2},
            {curso: 'Educ. Física', nota: 0, semestre: 2},
            {curso: 'Matemática(PROF.)', nota: 0, semestre: 2},
            {curso: 'Física(PROF.)', nota: 0, semestre: 2},
            {curso: 'Química(PROF.)', nota: 0, semestre: 2},
            {curso: 'Biología(PROF.)', nota: 0, semestre: 2},
            {curso: 'Conducta', nota: 0, semestre: 2},
            {curso: 'Promedio', nota: 0, semestre: 2}];
            $scope.notas_undecimo_1 = [
                {curso: 'Español', nota: 0, semestre: 1},
                {curso: 'Matemáticas', nota: 0, semestre: 1},
                {curso: 'Física', nota: 0, semestre: 1},
                {curso: 'Química', nota: 0, semestre: 1},
                {curso: 'Biología', nota: 0, semestre: 1},
                {curso: 'Bioteclogía', nota: 0, semestre: 1},
                {curso: 'Computación', nota: 0, semestre: 1},
                {curso: 'Robótica', nota: 0, semestre: 1},
                {curso: 'Dibujo Técnico', nota: 0, semestre: 1},
                {curso: 'Inglés', nota: 0, semestre: 1},
                {curso: 'Investigación', nota: 0, semestre: 1},
                {curso: 'Historia', nota: 0, semestre: 1},
                {curso: 'Geografía', nota: 0, semestre: 1},
                {curso: 'Educ. Religiosa', nota: 0, semestre: 1},
                {curso: 'Educ. Cívica', nota: 0, semestre: 1},
                {curso: 'Educ. Física', nota: 0, semestre: 1},
                {curso: 'Matemática(PROF.)', nota: 0, semestre: 1},
                {curso: 'Física(PROF.)', nota: 0, semestre: 1},
                {curso: 'Química(PROF.)', nota: 0, semestre: 1},
                {curso: 'Biología(PROF.)', nota: 0, semestre: 1},
                {curso: 'Conducta', nota: 0, semestre: 1},
                {curso: 'Promedio', nota: 0, semestre: 1}];
            $scope.notas_undecimo_2 = [
                {curso: 'Español', nota: 0, semestre: 2},
                {curso: 'Matemáticas', nota: 0, semestre: 2},
                {curso: 'Física', nota: 0, semestre: 2},
                {curso: 'Química', nota: 0, semestre: 2},
                {curso: 'Biología', nota: 0, semestre: 2},
                {curso: 'Bioteclogía', nota: 0, semestre: 2},
                {curso: 'Computación', nota: 0, semestre: 2},
                {curso: 'Robótica', nota: 0, semestre: 2},
                {curso: 'Dibujo Técnico', nota: 0, semestre: 2},
                {curso: 'Inglés', nota: 0, semestre: 2},
                {curso: 'Investigación', nota: 0, semestre: 2},
                {curso: 'Historia', nota: 0, semestre: 2},
                {curso: 'Geografía', nota: 0, semestre: 2},
                {curso: 'Educ. Religiosa', nota: 0, semestre: 2},
                {curso: 'Educ. Cívica', nota: 0, semestre: 2},
                {curso: 'Educ. Física', nota: 0, semestre: 2},
                {curso: 'Matemática(PROF.)', nota: 0, semestre: 2},
                {curso: 'Física(PROF.)', nota: 0, semestre: 2},
                {curso: 'Química(PROF.)', nota: 0, semestre: 2},
                {curso: 'Biología(PROF.)', nota: 0, semestre: 2},
                {curso: 'Conducta', nota: 0, semestre: 2},
                {curso: 'Promedio', nota: 0, semestre: 2}];
            $scope.initGridOptions();
        };

        $scope.initGridOptions = function(){
            $scope.gridOptionsS = $scope.getGridOptionsNotas('notas_septimo');
            $scope.gridOptionsO = $scope.getGridOptionsNotas('notas_octavo');
            $scope.gridOptionsN = $scope.getGridOptionsNotas('notas_noveno');
            $scope.gridOptionsD1 = $scope.getGridOptionsNotas('notas_decimo_1');
            $scope.gridOptionsD2 = $scope.getGridOptionsNotas('notas_decimo_2');
            $scope.gridOptionsU1 = $scope.getGridOptionsNotas('notas_undecimo_1');
            $scope.gridOptionsU2 = $scope.getGridOptionsNotas('notas_undecimo_2');
        };

        $scope.getGridOptionsNotas = function(data){
            return {
                data: data,
                enableCellSelection: true,
                enableRowSelection: false,

                enableCellEditOnFocus: $scope.editable,
                columnDefs: [{field: 'curso', displayName: 'Curso', enableCellEdit: false},
                    {field:'nota', displayName:'Nota', enableCellEdit: $scope.editable,
                        editableCellTemplate:'<input type="number" ng-class="\'colt\' + col.index"  min="1" max="100" ng-input="COL_FIELD" ng-model="COL_FIELD" >',
                        cellTemplate:'<div class="ngCellText" ng-class="{\'red\' : row.getProperty(\'nota\') <65 && row.getProperty(\'nota\') != 0,   \'green\' : row.getProperty(\'nota\') >=65 && row.getProperty(\'nota\') != 0  }">{{ row.getProperty(col.field) }}</div>'}]
            };
        };




        $scope.notes_c_c = function(){
            $scope.notas_decimo_1 = [];
            $scope.notas_decimo_2 = [];
            $scope.notas_undecimo_1 = [];
            $scope.notas_undecimo_2 = [];
            $scope.editable = true;
            var estudiante = Estudiantes.get({
                estudianteId: $stateParams.estudianteId
            });
            estudiante.$promise.then(function(estudiante) {
                $scope.notas = GetNotas.query({
                    cedula_estudiante: estudiante.nacionalidad
                });
                $scope.notas.$promise.then(function (notas) {
                    angular.forEach(notas, function (nota) {
                        if ((nota.grado === 'decimo') && (nota.semestre === 1)) {
                            $scope.notas_decimo_1.push(nota);
                        }
                        else if ((nota.grado === 'decimo') && (nota.semestre === 2)) {
                            $scope.notas_decimo_2.push(nota);
                        }
                        else if ((nota.grado === 'undecimo') && (nota.semestre === 1)) {
                            $scope.notas_undecimo_1.push(nota);
                        }
                        else if ((nota.grado === 'undecimo') && (nota.semestre === 2)) {
                            $scope.notas_undecimo_2.push(nota);
                        }
                    });
                }, function (error) {
                    console.log('Failed: ' + error);
                });
            });
            $scope.initGridOptions();
        };

        $scope.ngGridEstudiantes = function(matriculado){
            if(matriculado)
            {
                $scope.gridOptionsList = {
                    data: 'estudiantes',
                    enableCellSelection: true,
                    enableRowSelection: false,
                    enableCellEditOnFocus: false,
                    columnDefs: [{ field: 'name', displayName:'Nombre'},
                        { field: 'nacionalidad', displayName:'Cédula'},
                        { field: 'admitido', displayName:'Admitido', cellTemplate: '<input type="checkbox" ng-model="row.entity.admitido">'},
                        { field: '_id', displayName:'Ver', cellTemplate: '<a data-ng-href="#!/estudiantes/{{row.entity._id}}">ver</a>'}]
                };
            }
            else{
                $scope.gridOptionsList = {
                    data: 'estudiantes',
                    enableCellSelection: true,
                    enableRowSelection: false,
                    enableCellEditOnFocus: false,
                    columnDefs: [{ field: 'name', displayName:'Nombre'},
                        { field: 'nacionalidad', displayName:'Cédula'},
                        { field: 'anno_ingreso', displayName:'Año',cellTemplate: '<div class="ngCellText">{{row.getProperty(col.field) | anno}}</div>'},
                        { field: 'traladado', displayName:'Trasladar', cellTemplate: '<input type="checkbox" ng-model="row.entity.traladado">'},
                        { field: '_id', displayName:'Ver', cellTemplate: '<a data-ng-href="#!/estudiantes/{{row.entity._id}}">ver</a>'}]
                };
            }
        };

        $scope.matricular = function(){
            var estudiantes = $scope.estudiantes;
            angular.forEach(estudiantes, function (estudiante) {
                if(estudiante.admitido)
                    Estudiantes.update({ estudianteId: estudiante._id }, estudiante).$promise.then(function(estudiante) {
                        location.reload();
                    });
            });
        };

        $scope.trasladar = function(){
            var estudiantes = $scope.estudiantes;
            angular.forEach(estudiantes, function (estudiante) {
                console.log(estudiante._id);
                if(estudiante.traladado) {
                    estudiante.fecha_traladado = new Date(). getDate();
                    Estudiantes.update({ estudianteId: estudiante._id }, estudiante).$promise.then(function (estudiante) {
                        location.reload();
                    });
                }
            });
        };

        $scope.asignar_notas = function(){
            var estudiante = Estudiantes.get({
                estudianteId: $stateParams.estudianteId
            });
            var notas = $scope.notas;
            angular.forEach(notas, function (nota) {
                for(var i = 0;i < $scope.notas_decimo_1.length; i++){
                    if(($scope.notas_decimo_1.grado===nota.grado)&&($scope.notas_decimo_1.curso===nota.curso)){
                        nota.nota = $scope.notas_decimo_1.nota;
                    }
                    else if(($scope.notas_decimo_2.grado===nota.grado)&&($scope.notas_decimo_2.curso===nota.curso)){
                        nota.nota = $scope.notas_decimo_2.nota;
                    }
                    else if(($scope.notas_undecimo_1.grado===nota.grado)&&($scope.notas_undecimo_1.curso===nota.curso)){
                        nota.nota = $scope.notas_undecimo_1.nota;
                    }
                    else if(($scope.notas_undecimo_2.grado===nota.grado)&&($scope.notas_undecimo_2.curso===nota.curso)){
                        nota.nota = $scope.notas_undecimo_2.nota;
                    }
                }
                Notas.update({ notaId: nota._id }, nota);
            });
            $location.path('estudiantes/' + $stateParams.estudianteId);
        };

        $scope.subir_archivos = function(){
            var file = $scope.selected_certificacion_nacimiento[0];
            $scope.upload = $upload.upload({
                url: '/upload',
                method: 'POST',
                file: file
            }).success(function(data) {
                var estudiante = $scope.estudiante;
                estudiante.certificacion_nacimiento = data.name;
                estudiante.$update(function() {
                    $location.path('estudiantes/' + estudiante._id);
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            });
            file = $scope.selected_certificacion_notas[0];
            $scope.upload = $upload.upload({
                url: '/upload',
                method: 'POST',
                file: file
            }).success(function(data) {
                var estudiante = $scope.estudiante;
                estudiante.certificacion_notas = data.name;
                estudiante.$update(function() {
                    $location.path('estudiantes/' + estudiante._id);
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            });
            file = $scope.selected_inf_hogar[0];
            $scope.upload = $upload.upload({
                url: '/upload',
                method: 'POST',
                file: file
            }).success(function(data) {
                var estudiante = $scope.estudiante;
                estudiante.informe_hogar = data.name;
                estudiante.$update(function() {
                    $location.path('estudiantes/' + estudiante._id);
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            });
            file = $scope.selected_vacunas[0];
            $scope.upload = $upload.upload({
                url: '/upload',
                method: 'POST',
                file: file
            }).success(function(data) {
                var estudiante = $scope.estudiante;
                estudiante.tarjeta_vacunas = data.name;
                estudiante.$update(function() {
                    location.reload();
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            });
        };
        //-----------------------------------------------------------------CONSULTAS DE ESTUDIANTES-------------------------------------------------------------------------
        $scope.init_generaciones = function(){
            $scope.estudiantes = Estudiantes.query();
            console.log($scope.estudiantes);
        };

        $scope.column = '';
        $scope.filterOptions = {
            filterText:'',
            useExternalFilter: false
        };


        $scope.gridOptionsGeneracion = {
            data: 'estudiantes',
            enableCellSelection: true,
            enableRowSelection: false,
            enableCellEditOnFocus: false,
            columnDefs: [{ field: 'name', displayName:'Nombre'},
                { field: 'primer_apellido', displayName:'Primer Apellido'},
                { field: 'segundo_apellido', displayName:'Segundo Apellido'},
                { field: 'nacionalidad', displayName:'Cédula'},
                { field: 'anno_ingreso', displayName:'Generación'},
                { field: 'colegio_procedencia', displayName:'Colegio de Procedencia'},
                { field: 'anno_ingreso', displayName:'Año de ingreso'},
                { field: 'sexo', displayName:'Sexo',cellTemplate: '<div class="ngCellText">{{row.getProperty(col.field) | sexo}}</div>'},
                { field: 'traladado', displayName:'Trasladado',cellTemplate: '<div class="ngCellText">{{row.getProperty(col.field) | true_false}}</div>'},
                { field: '_id', displayName:'Ver', cellTemplate: '<a data-ng-href="#!/estudiantes/{{row.entity._id}}">ver</a>'}],
            filterOptions: $scope.filterOptions
        };

        $scope.filterOptions.filterText = '';
        $scope.$watchCollection('[filteringText, consulta_sexo, consulta_grado, consulta_estado]', function(values) {
            console.log(values);
            var searchQuery = '';
            if(values[0] === ''){
                $scope.filterOptions.filterText = '';
            }
            else if (values[0]) {
                if($scope.consulta.nombre === 'Nombre') {
                    searchQuery = 'name: ' + values[0] + ';';
                }
                else if($scope.consulta.nombre === 'Cedula') {
                    searchQuery = 'nacionalidad: ' + values[0] + ';';
                }
                else if($scope.consulta.nombre === 'Colegio de Procedencia') {
                    searchQuery = 'colegio_procedencia: ' + values[0] + ';';
                }
                else if($scope.consulta.nombre === 'Trasladado') {
                    searchQuery = 'traladado: '+ true +';';
                }
            }

            if(values[1]){
                if ($scope.consulta_sexo.sexo === 'Masculino')
                    searchQuery = searchQuery + 'sexo: ' + true +';';
                else if ($scope.consulta_sexo.sexo === 'Femenino')
                    searchQuery = searchQuery + 'sexo: ' + false +';';
            }

            if(values[2]){
                if ($scope.consulta_grado.grado === 'Décimo')
                    searchQuery = searchQuery + 'anno_ingreso: ' + new Date().getFullYear() +';';
                else if ($scope.consulta_grado.grado === 'Undécimo')
                    searchQuery = searchQuery + 'anno_ingreso: ' + (new Date().getFullYear() - 1) +';';
                else
                    searchQuery = searchQuery + 'anno_ingreso: ' + (new Date().getFullYear() - 1) +'|'+ new Date().getFullYear()+';';
            }

            if(values[3]){
                if($scope.consulta_estado.estado === 'Egresado'){
                    searchQuery = searchQuery + 'graduado: ' + true +';';
                }

                else if($scope.consulta_estado.estado === 'Trasladado')
                    searchQuery = searchQuery + 'traladado: ' + true +';';
            }

            $scope.filterOptions.filterText = searchQuery;
        });


        //-----------------------------------------------------------------REPORTE DE ESTUDIANTES-------------------------------------------------------------------------
        $scope.get_all_students = function(){
            $scope.estudiantes = Estudiantes.query();
        };

        $scope.lista_reportes = [{nombre: 'Lista ausencias', val : 1}, {nombre: 'Lista cédula, carné, apellidos, nombre, telefono, correo', val : 2}, {nombre: 'Lista ciencia para bachillerato', val : 3}, {nombre: 'Lista Correos', val : 4}, {nombre: 'Lista escogencia de la ciencia para bachillerato', val : 5}, {nombre: 'Lista para la biblioteca', val: 6}, {nombre: 'Lista participación en olimpiadas', val : 7}, {nombre: 'Reporte de notas', val : 8}];
        $scope.reporte = $scope.lista_reportes[0];
        $scope.ced_estudiante = '';
        $scope.visibl = false;

        $scope.$watch('ced_estudiante', function(ced_estudiante){
            if(ced_estudiante.length === 11){
                $scope.show = true;
                $scope.reporte_notas(false);
                console.log('-');
            }
            else{
                $scope.show = false;
            }

        });

        $scope.$watch('reporte', function(reporte){
            var reporte = $scope.reporte;
            var columns = [];
            var data = [];
            var data2 = [];
            var estudiantes_decimo = [];
            var estudiantes_undecimo = [];
            if(reporte.val === 1){
                $scope.visibl = false;
                $scope.show = true;
                columns = [
                    {title: 'Cédula', key: 'ced'},
                    {title: 'Nombre', key: 'nom'},
                    {title: 'Del__ al __', key: 'i'},
                    {title: 'Del__ al __', key: 'ii'},
                    {title: 'Del__ al __', key: 'iii'},
                    {title: 'Del__ al __', key: 'iiii'}
                ];
                data = [];
                estudiantes_decimo = Decimo.query();
                estudiantes_decimo.$promise.then(function(estudiantes) {
                    var m = 0;
                    var h = 0;
                    angular.forEach(estudiantes, function (estudiante_decimo) {

                        if ((estudiante_decimo.admitido) && (!estudiante_decimo.traladado)) {
                            if(estudiante_decimo.sexo === true){
                                h++;
                            }
                            else{
                                m += 1;
                            }
                            data.push({'ced': estudiante_decimo.nacionalidad, 'nom': estudiante_decimo.segundo_apellido + ' ' + estudiante_decimo.primer_apellido + ' ' + estudiante_decimo.name, 'i': '', 'ii': '', 'iii': '', 'iiii': ''});
                        }
                    });
                    var t = m + h;
                    var encabezado =
                        'Colegio Científico de Costa Rica                     Mujeres: ' + m + '\n' +
                        'Sede Regional San Carlos                             Hombres: ' + h + '\n' +
                        'Telefax: 2475-7089,Tel: 2401-3122                    Total: ' + t + '\n';
                    var titulo = '                   CONTROL DE AUSENCIAS DÉCIMO AÑO ' + new Date().getFullYear() +'\n' +
                        'Profesor: __________________                         Mes:________________ \n' +
                        'Asignatura: ________________                         A = Ausencia, T = Tardía';
                    if(data.length > 0) {
                        $scope.generatePDF('Lista de ausencias décimo', encabezado, titulo, columns, data, 130, false);
                    }

                    h = 0;
                    t = 0;
                    m = 0;
                });
                data2 = [];
                estudiantes_undecimo = Undecimo.query();
                estudiantes_undecimo.$promise.then(function(estudiantes){
                    var m = 0;
                    var h = 0;
                    angular.forEach(estudiantes, function(estudiante_undecimo){
                        console.log(estudiante_undecimo.name+estudiante_undecimo.segundo_apellido+estudiante_undecimo.primer_apellido);
                        if((estudiante_undecimo.admitido) && (!estudiante_undecimo.traladado)) {
                            if(estudiante_undecimo.sexo === true){
                                h++;
                            }
                            else{
                                m++;
                            }
                            data2.push({'ced': estudiante_undecimo.nacionalidad, 'nom': estudiante_undecimo.segundo_apellido + ' ' + estudiante_undecimo.primer_apellido + ' ' + estudiante_undecimo.name, 'i': '', 'ii': '', 'iii': '', 'iiii': ''});
                        }
                    });
                    var t = m + h;
                    var encabezado =
                        'Colegio Científico de Costa Rica                     Mujeres: ' + m + '\n' +
                        'Sede Regional San Carlos                             Hombres: ' + h + '\n' +
                        'Telefax: 2475-7089,Tel: 2401-3122                    Total: ' + t + '\n';
                    var titulo = '                   CONTROL DE AUSENCIAS UNDÉCIMO AÑO ' + new Date().getFullYear() +'\n' +
                        'Profesor: __________________                         Mes:________________ \n' +
                        'Asignatura: ________________                         A = Ausencia, T = Tardía';
                    if(data2.length > 0) {
                        $scope.generatePDF('Lista de ausencias undécimo', encabezado, titulo, columns, data2, 130, false);
                    }


                });
            }
            else if(reporte.val === 2){
                $scope.visibl = false;
                $scope.show = true;
                columns = [
                    {title: 'Cédula', key: 'ced'},
                    {title: 'I Apellido', key: 'i'},
                    {title: 'II Apellido', key: 'ii'},
                    {title: 'Nombre', key: 'nom'},
                    {title: 'Teléfono', key: 'tel'},
                    {title: 'E-mail', key: 'mail'}

                ];
                data = [];
                estudiantes_decimo = Decimo.query();
                estudiantes_decimo.$promise.then(function(estudiantes) {
                    var m = 0;
                    var h = 0;
                    angular.forEach(estudiantes, function (estudiante_decimo) {

                        if ((estudiante_decimo.admitido) && (!estudiante_decimo.traladado)) {
                            if(estudiante_decimo.sexo === true){
                                h++;
                            }
                            else{
                                m += 1;
                            }
                            data.push({'ced': estudiante_decimo.nacionalidad, 'i': estudiante_decimo.primer_apellido, 'ii': estudiante_decimo.segundo_apellido, 'nom':estudiante_decimo.name, 'tel': estudiante_decimo.celular, 'mail': estudiante_decimo.correo});
                        }
                    });
                    var t = m + h;
                    var encabezado =
                        'Colegio Científico de Costa Rica\n' +
                        'Instituto Tecnológico de Costa Rica, Sede Regional San Carlos\n' +
                        'Telefax: 2475-7089,Tel: 2401-3122\n';
                    var titulo = '';
                    if(data.length > 0) {
                        $scope.generatePDF('Lista cedula carne y apellidos undécimo', encabezado, titulo, columns, data, 70, false);
                    }

                    h = 0;
                    t = 0;
                    m = 0;
                });
                data2 = [];
                estudiantes_undecimo = Undecimo.query();
                estudiantes_undecimo.$promise.then(function(estudiantes) {
                    var m = 0;
                    var h = 0;
                    angular.forEach(estudiantes, function (estudiante_undecimo) {
                        if ((estudiante_undecimo.admitido) && (!estudiante_undecimo.traladado)) {
                            if (estudiante_undecimo.sexo === true) {
                                h++;
                            }
                            else {
                                m++;
                            }
                            data2.push({'ced': estudiante_undecimo.nacionalidad, 'i': estudiante_undecimo.primer_apellido, 'ii': estudiante_undecimo.segundo_apellido, 'nom': estudiante_undecimo.name, 'tel': estudiante_undecimo.celular, 'mail': estudiante_undecimo.correo});
                        }
                    });
                    var t = m + h;
                    var encabezado =
                        'Colegio Científico de Costa Rica\n' +
                        'Instituto Tecnológico de Costa Rica, Sede Regional San Carlos\n' +
                        'Telefax: 2475-7089,Tel: 2401-3122\n';
                    var titulo = '';
                    if (data2.length > 0) {
                        $scope.generatePDF('Lista cedula carne y apellidos undécimo', encabezado, titulo, columns, data2, 70, false);
                    }
                });
            }
            else if(reporte.val === 3){
                $scope.visibl = false;
                $scope.show = true;
                columns = [
                    {title: 'Cédula', key: 'ced'},
                    {title: 'Nombre', key: 'nom'},
                    {title: 'Ciencia', key: 'cie'},
                    {title: 'Firma', key: 'fir'}
                ];
                data = [];
                estudiantes_decimo = Decimo.query();
                estudiantes_decimo.$promise.then(function(estudiantes) {
                    var m = 0;
                    var h = 0;
                    angular.forEach(estudiantes, function (estudiante_decimo) {
                        if ((estudiante_decimo.admitido) && (!estudiante_decimo.traladado)) {
                            if(estudiante_decimo.sexo === true){
                                h++;
                            }
                            else{
                                m += 1;
                                console.log(m);
                            }
                            data.push({'ced':estudiante_decimo.nacionalidad,'nom': estudiante_decimo.segundo_apellido + ' ' + estudiante_decimo.primer_apellido + ' ' + estudiante_decimo.name, 'cie': '','fir': ''});
                        }
                    });
                    var t = m + h;
                    var encabezado =
                        'Colegio Científico de Costa Rica                     Mujeres: ' + m + '\n' +
                        'Sede Regional San Carlos                             Hombres: ' + h + '\n' +
                        'Telefax: 2475-7089,Tel: 2401-3122                    Total: ' + t + '\n';
                    var titulo = '              LISTA CIENCIA PARA BACHILLERATO DÉCIMO AÑO ' + new Date().getFullYear() +'\n';
                    if(data.length > 0) {
                        $scope.generatePDF('Lista ciencia para bachillerato décimo', encabezado, titulo, columns, data, 95, false);
                    }

                    h = 0;
                    t = 0;
                    m = 0;
                });
                data2 = [];
                estudiantes_undecimo = Undecimo.query();
                estudiantes_undecimo.$promise.then(function(estudiantes){
                    var m = 0;
                    var h = 0;
                    angular.forEach(estudiantes, function(estudiante_undecimo){

                        if((estudiante_undecimo.admitido) && (!estudiante_undecimo.traladado)) {
                            if(estudiante_undecimo.sexo === true){
                                h++;
                            }
                            else{
                                m++;
                            }
                            data2.push({'ced':estudiante_undecimo.nacionalidad,'nom': estudiante_undecimo.segundo_apellido + ' ' + estudiante_undecimo.primer_apellido + ' ' + estudiante_undecimo.name, 'cie': '','fir': ''});
                        }
                    });
                    var t = m + h;
                    var encabezado =
                        'Colegio Científico de Costa Rica                     Mujeres: ' + m + '\n' +
                        'Sede Regional San Carlos                             Hombres: ' + h + '\n' +
                        'Telefax: 2475-7089,Tel: 2401-3122                    Total: ' + t + '\n';
                    var titulo = '              LISTA CIENCIA PARA BACHILLERATO UNDÉCIMO AÑO ' + new Date().getFullYear() +'\n';
                    if(data2.length > 0) {
                        $scope.generatePDF('Lista ciencia para bachillerato undécimo', encabezado, titulo, columns, data, 95, false);
                    }
                });
            }
            else if(reporte.val === 4){
                $scope.visibl = false;
                $scope.show = true;
                columns = [
                    {title: 'Cédula', key: 'ced'},
                    {title: 'Nombre', key: 'nom'},
                    {title: 'E-mail', key: 'mail'}
                ];
                data = [];
                estudiantes_decimo = Decimo.query();
                estudiantes_decimo.$promise.then(function(estudiantes) {
                    angular.forEach(estudiantes, function (estudiante_decimo) {
                        if ((estudiante_decimo.admitido) && (!estudiante_decimo.traladado)){
                            data.push({'ced':estudiante_decimo.nacionalidad, 'nom':estudiante_decimo.segundo_apellido + estudiante_decimo.primer_apellido + estudiante_decimo.name, 'mail': estudiante_decimo.correo});
                        }
                    });
                    var encabezado =
                        'Colegio Científico de Costa Rica\n' +
                        'Instituto Tecnológico de Costa Rica, Sede Regional San Carlos\n' +
                        'Telefax: 2475-7089,Tel: 2401-3122\n';
                    var titulo = '';
                    if(data.length > 1) {
                        $scope.generatePDF('Lista correos décimo', encabezado, titulo, columns, data, 70, false);
                    }
                });
                data2 = [];
                estudiantes_undecimo = Undecimo.query();
                estudiantes_undecimo.$promise.then(function(estudiantes){
                    angular.forEach(estudiantes, function(estudiante_undecimo){
                        if((estudiante_undecimo.admitido) && (!estudiante_undecimo.traladado)) {
                            data2.push({'ced':estudiante_undecimo.nacionalidad, 'nom':estudiante_undecimo.segundo_apellido + estudiante_undecimo.primer_apellido + estudiante_undecimo.name, 'mail': estudiante_undecimo.correo});
                        }
                    });
                    var encabezado =
                        'Colegio Científico de Costa Rica\n' +
                        'Instituto Tecnológico de Costa Rica, Sede Regional San Carlos\n' +
                        'Telefax: 2475-7089,Tel: 2401-3122\n';
                    var titulo = '';
                    if(data2.length > 0) {
                        $scope.generatePDF('Lista correos undécimo', encabezado, titulo, columns, data2, 70, false);
                    }
                });
            }
            else if(reporte.val === 5){
                $scope.visibl = false;
                $scope.show = true;
                columns = [
                    {title: 'Cédula', key: 'ced'},
                    {title: 'Nombre', key: 'nom'},
                    {title: 'Biología', key: 'bio'},
                    {title: 'Química', key: 'quim'},
                    {title: 'Física', key: 'fis'}
                ];
                data = [];
                estudiantes_undecimo = Undecimo.query();
                estudiantes_undecimo.$promise.then(function(estudiantes){
                    var m = 0;
                    var h = 0;
                    angular.forEach(estudiantes, function(estudiante_undecimo){
                        if((estudiante_undecimo.admitido) && (!estudiante_undecimo.traladado)) {
                            if(estudiante_undecimo.sexo === true){
                                h++;
                            }
                            else{
                                m++;
                            }
                            data.push({'ced':estudiante_undecimo.nacionalidad,'nom': estudiante_undecimo.segundo_apellido + ' ' + estudiante_undecimo.primer_apellido + ' ' + estudiante_undecimo.name, 'bio': '','quim': '', 'fis': ''});
                        }
                    });
                    var t = m + h;
                    var encabezado =
                        'Colegio Científico de Costa Rica                     Mujeres: ' + m + '\n' +
                        'Sede Regional San Carlos                             Hombres: ' + h + '\n' +
                        'Telefax: 2475-7089,Tel: 2401-3122                    Total: ' + t + '\n';
                    var titulo = '\n'+'              ESCOGENCIA DE CIENCIA BACHILLERATO ' + new Date().getFullYear() +'\n';
                    titulo += '\nProfesores:\nAsignaturas:';
                    if(data.length > 0) {
                        $scope.generatePDF('Escogencia de ciencia bachierato', encabezado, titulo, columns, data, 165, false);
                    }
                });
            }
            else if(reporte.val === 6){
                $scope.visibl = false;
                $scope.show = true;
                columns = [
                    {title: 'Cédula', key: 'ced'},
                    {title: 'Nombre', key: 'nom'},
                    {title: 'Email', key: 'email'},
                    {title: 'Dirección', key: 'dir'},
                    {title: 'Fecha de nacimiento', key: 'nac'},
                    {title: 'Edad', key: 'edad'}
                ];
                data = [];
                estudiantes_decimo = Decimo.query();
                estudiantes_decimo.$promise.then(function(estudiantes) {
                    var m = 0;
                    var h = 0;
                    var t = 0;
                    angular.forEach(estudiantes, function (estudiante_decimo) {
                        if ((estudiante_decimo.admitido) && (!estudiante_decimo.traladado)) {
                            if(estudiante_decimo.sexo === true){
                                h++;
                            }
                            else{
                                m += 1;
                                console.log(m);
                            }
                            var fecha_split = estudiante_decimo.fecha_de_nacimiento.split('-');
                            var f = new Date();
                            if(fecha_split[2].length === 4)
                                f = new Date(fecha_split[2], fecha_split[1], fecha_split[0]);
                            else
                                f = new Date(fecha_split[0], fecha_split[1], fecha_split[2]);
                            var edad = new Date().getFullYear() - f.getFullYear();
                            data.push({'ced':estudiante_decimo.nacionalidad,'nom': estudiante_decimo.segundo_apellido + ' ' + estudiante_decimo.primer_apellido + ' ' + estudiante_decimo.name,
                                'email': estudiante_decimo.correo, 'dir': estudiante_decimo.direccion_exacta, 'nac': estudiante_decimo.fecha_de_nacimiento, 'edad': edad});
                        }
                    });
                    t = m + h;
                    var encabezado =
                        'Colegio Científico de Costa Rica                     Mujeres: ' + m + '\n' +
                        'Sede Regional San Carlos                             Hombres: ' + h + '\n' +
                        'Telefax: 2475-7089,Tel: 2401-3122                    Total: ' + t + '\n';
                    var titulo = '              LISTA DE CORREOS DÉCIMO AÑO ' + new Date().getFullYear() +'\n';
                    if(data.length > 0) {
                        $scope.generatePDF('Lista para la biblioteca décimo', encabezado, titulo, columns, data, 95 , false);
                    }
                });
                estudiantes_undecimo = Undecimo.query();
                estudiantes_undecimo.$promise.then(function(estudiantes){
                    data = [];
                    var m = 0;
                    var h = 0;
                    var t = 0;
                    angular.forEach(estudiantes, function(estudiante_undecimo){
                        if((estudiante_undecimo.admitido) && (!estudiante_undecimo.traladado)) {
                            if(estudiante_undecimo.sexo === true){
                                h++;
                            }
                            else{
                                m++;
                            }
                            var fecha_split = estudiante_undecimo.fecha_de_nacimiento.split('-');
                            var f = new Date();
                            if(fecha_split[2].length === 4)
                                f = new Date(fecha_split[2], fecha_split[1], fecha_split[0]);
                            else
                                f = new Date(fecha_split[0], fecha_split[1], fecha_split[2]);
                            var edad = new Date().getFullYear() - f.getFullYear();
                            data.push({'ced':estudiante_undecimo.nacionalidad,'nom': estudiante_undecimo.segundo_apellido + ' ' + estudiante_undecimo.primer_apellido + ' ' + estudiante_undecimo.name,
                                'email': estudiante_undecimo.correo, 'dir': estudiante_undecimo.direccion_exacta, 'nac': estudiante_undecimo.fecha_de_nacimiento, 'edad': edad});
                        }
                    });
                    t = m + h;
                    var encabezado =
                        'Colegio Científico de Costa Rica                     Mujeres: ' + m + '\n' +
                        'Sede Regional San Carlos                             Hombres: ' + h + '\n' +
                        'Telefax: 2475-7089,Tel: 2401-3122                    Total: ' + t + '\n';
                    var titulo = '\n'+'              LISTA DE CORREOS UNDÉCIMO AÑO ' + new Date().getFullYear() +'\n';
                    if(data.length > 0) {
                        $scope.generatePDF('Lista para la biblioteca undécimo', encabezado, titulo, columns, data, 95, false);
                    }

                });
            }
            else if(reporte.val === 7){
                $scope.visibl = false;
                $scope.show = true;
                columns = [
                    {title: 'Cédula', key: 'ced'},
                    {title: 'Nombre', key: 'nom'},
                    {title: 'Participación Olimpiada', key: 'par'}
                ];
                data = [];
                estudiantes_decimo = Decimo.query();
                estudiantes_decimo.$promise.then(function(estudiantes) {
                    var m = 0;
                    var h = 0;
                    var t = 0;
                    angular.forEach(estudiantes, function (estudiante_decimo) {
                        if ((estudiante_decimo.admitido) && (!estudiante_decimo.traladado)) {
                            if(estudiante_decimo.sexo === true){
                                h++;
                            }
                            else{
                                m += 1;
                                console.log(m);
                            }
                            data.push({'ced':estudiante_decimo.nacionalidad,'nom': estudiante_decimo.segundo_apellido + ' ' + estudiante_decimo.primer_apellido + ' ' + estudiante_decimo.name,
                                'par': ''});
                        }
                    });
                    t = m + h;
                    var encabezado =
                        'Colegio Científico de Costa Rica                     Mujeres: ' + m + '\n' +
                        'Sede Regional San Carlos                             Hombres: ' + h + '\n' +
                        'Telefax: 2475-7089,Tel: 2401-3122                    Total: ' + t + '\n';
                    var titulo = '\n'+'              LISTA INTERESADOS OLIMPIADA DÉCIMO AÑO ' + new Date().getFullYear() +'\n';
                    titulo += '\nProfesores:\nAsignaturas:';
                    if(data.length > 0) {
                        $scope.generatePDF('Lista participación olimpiadas décimo', encabezado, titulo, columns, data, 165, false);
                    }
                });
                estudiantes_undecimo = Undecimo.query();
                estudiantes_undecimo.$promise.then(function(estudiantes){
                    data = [];
                    var m = 0;
                    var h = 0;
                    var t = 0;
                    angular.forEach(estudiantes, function(estudiante_undecimo){
                        if((estudiante_undecimo.admitido) && (!estudiante_undecimo.traladado)) {
                            if(estudiante_undecimo.sexo === true){
                                h++;
                            }
                            else{
                                m++;
                            }
                            data.push({'ced':estudiante_undecimo.nacionalidad,'nom': estudiante_undecimo.segundo_apellido + ' ' + estudiante_undecimo.primer_apellido + ' ' + estudiante_undecimo.name,
                                'par': ''});
                        }
                    });
                    t = m + h;
                    var encabezado =
                        'Colegio Científico de Costa Rica                     Mujeres: ' + m + '\n' +
                        'Sede Regional San Carlos                             Hombres: ' + h + '\n' +
                        'Telefax: 2475-7089,Tel: 2401-3122                    Total: ' + t + '\n';
                    var titulo = '\n'+'              LISTA INTERESADOS OLIMPIADA UNDÉCIMO AÑO ' + new Date().getFullYear() +'\n';
                    titulo += '\nProfesores:\nAsignaturas:';
                    if(data.length > 0) {
                        $scope.generatePDF('Lista participación olimpiadas undécimo', encabezado, titulo, columns, data, 165, false);
                    }

                });
            }
            else if(reporte.val === 8){
                $scope.visibl = true;
                $scope.show = false;
            }
        });

        $scope.generar_reporte = function(){
            var reporte = $scope.reporte;
            var columns = [];
            var data = [];
            var data2 = [];
            var estudiantes_decimo = [];
            var estudiantes_undecimo = [];
            if(reporte.val === 1){
                columns = [
                    {title: 'Cédula', key: 'ced'},
                    {title: 'Nombre', key: 'nom'},
                    {title: 'Del__ al __', key: 'i'},
                    {title: 'Del__ al __', key: 'ii'},
                    {title: 'Del__ al __', key: 'iii'},
                    {title: 'Del__ al __', key: 'iiii'}
                ];
                data = [];
                estudiantes_decimo = Decimo.query();
                estudiantes_decimo.$promise.then(function(estudiantes) {
                    var m = 0;
                    var h = 0;
                    angular.forEach(estudiantes, function (estudiante_decimo) {

                        if ((estudiante_decimo.admitido) && (!estudiante_decimo.traladado)) {
                            if(estudiante_decimo.sexo === true){
                                h++;
                            }
                            else{
                                m += 1;
                            }
                            data.push({'ced': estudiante_decimo.nacionalidad, 'nom': estudiante_decimo.segundo_apellido + ' ' + estudiante_decimo.primer_apellido + ' ' + estudiante_decimo.name, 'i': '', 'ii': '', 'iii': '', 'iiii': ''});
                        }
                    });
                    var t = m + h;
                    var encabezado =
                        'Colegio Científico de Costa Rica                     Mujeres: ' + m + '\n' +
                        'Sede Regional San Carlos                             Hombres: ' + h + '\n' +
                        'Telefax: 2475-7089,Tel: 2401-3122                    Total: ' + t + '\n';
                    var titulo = '                   CONTROL DE AUSENCIAS DÉCIMO AÑO ' + new Date().getFullYear() +'\n' +
                        'Profesor: __________________                         Mes:________________ \n' +
                        'Asignatura: ________________                         A = Ausencia, T = Tardía';
                    if(data.length > 0) {
                        $scope.generatePDF('Lista de ausencias décimo', encabezado, titulo, columns, data, 130, true);
                    }

                    h = 0;
                    t = 0;
                    m = 0;
                });
                data2 = [];
                estudiantes_undecimo = Undecimo.query();
                estudiantes_undecimo.$promise.then(function(estudiantes){
                    var m = 0;
                    var h = 0;
                    angular.forEach(estudiantes, function(estudiante_undecimo){
                        console.log(estudiante_undecimo.name+estudiante_undecimo.segundo_apellido+estudiante_undecimo.primer_apellido);
                        if((estudiante_undecimo.admitido) && (!estudiante_undecimo.traladado)) {
                            if(estudiante_undecimo.sexo === true){
                                h++;
                            }
                            else{
                                m++;
                            }
                            data2.push({'ced': estudiante_undecimo.nacionalidad, 'nom': estudiante_undecimo.segundo_apellido + ' ' + estudiante_undecimo.primer_apellido + ' ' + estudiante_undecimo.name, 'i': '', 'ii': '', 'iii': '', 'iiii': ''});
                        }
                    });
                    var t = m + h;
                    var encabezado =
                        'Colegio Científico de Costa Rica                     Mujeres: ' + m + '\n' +
                        'Sede Regional San Carlos                             Hombres: ' + h + '\n' +
                        'Telefax: 2475-7089,Tel: 2401-3122                    Total: ' + t + '\n';
                    var titulo = '                   CONTROL DE AUSENCIAS UNDÉCIMO AÑO ' + new Date().getFullYear() +'\n' +
                        'Profesor: __________________                         Mes:________________ \n' +
                        'Asignatura: ________________                         A = Ausencia, T = Tardía';
                    if(data2.length > 0) {
                        $scope.generatePDF('Lista de ausencias undécimo', encabezado, titulo, columns, data2, 130, true);
                    }
                });
            }
            else if(reporte.val === 2){
                columns = [
                    {title: 'Cédula', key: 'ced'},
                    {title: 'I Apellido', key: 'i'},
                    {title: 'II Apellido', key: 'ii'},
                    {title: 'Nombre', key: 'nom'},
                    {title: 'Teléfono', key: 'tel'},
                    {title: 'E-mail', key: 'mail'}

                ];
                data = [];
                estudiantes_decimo = Decimo.query();
                estudiantes_decimo.$promise.then(function(estudiantes) {
                    var m = 0;
                    var h = 0;
                    angular.forEach(estudiantes, function (estudiante_decimo) {

                        if ((estudiante_decimo.admitido) && (!estudiante_decimo.traladado)) {
                            if(estudiante_decimo.sexo === true){
                                h++;
                            }
                            else{
                                m += 1;
                            }
                            data.push({'ced': estudiante_decimo.nacionalidad, 'i': estudiante_decimo.primer_apellido, 'ii': estudiante_decimo.segundo_apellido, 'nom':estudiante_decimo.name, 'tel': estudiante_decimo.celular, 'mail': estudiante_decimo.correo});
                        }
                    });
                    var t = m + h;
                    var encabezado =
                        'Colegio Científico de Costa Rica\n' +
                        'Instituto Tecnológico de Costa Rica, Sede Regional San Carlos\n' +
                        'Telefax: 2475-7089,Tel: 2401-3122\n';
                    var titulo = '';
                    if(data.length > 0) {
                        $scope.generatePDF('Lista cedula carne y apellidos undécimo', encabezado, titulo, columns, data, 70, true);
                    }

                    h = 0;
                    t = 0;
                    m = 0;
                });
                data2 = [];
                estudiantes_undecimo = Undecimo.query();
                estudiantes_undecimo.$promise.then(function(estudiantes) {
                    var m = 0;
                    var h = 0;
                    angular.forEach(estudiantes, function (estudiante_undecimo) {
                        if ((estudiante_undecimo.admitido) && (!estudiante_undecimo.traladado)) {
                            if (estudiante_undecimo.sexo === true) {
                                h++;
                            }
                            else {
                                m++;
                            }
                            data2.push({'ced': estudiante_undecimo.nacionalidad, 'i': estudiante_undecimo.primer_apellido, 'ii': estudiante_undecimo.segundo_apellido, 'nom': estudiante_undecimo.name, 'tel': estudiante_undecimo.celular, 'mail': estudiante_undecimo.correo});
                        }
                    });
                    var t = m + h;
                    var encabezado =
                        'Colegio Científico de Costa Rica\n' +
                        'Instituto Tecnológico de Costa Rica, Sede Regional San Carlos\n' +
                        'Telefax: 2475-7089,Tel: 2401-3122\n';
                    var titulo = '';
                    if (data2.length > 0) {
                        $scope.generatePDF('Lista cedula carne y apellidos undécimo', encabezado, titulo, columns, data2, 70, true);
                    }
                });
            }
            else if(reporte.val === 3){
                columns = [
                    {title: 'Cédula', key: 'ced'},
                    {title: 'Nombre', key: 'nom'},
                    {title: 'Ciencia', key: 'cie'},
                    {title: 'Firma', key: 'fir'}
                ];
                data = [];
                estudiantes_decimo = Decimo.query();
                estudiantes_decimo.$promise.then(function(estudiantes) {
                    var m = 0;
                    var h = 0;
                    angular.forEach(estudiantes, function (estudiante_decimo) {
                        if ((estudiante_decimo.admitido) && (!estudiante_decimo.traladado)) {
                            if(estudiante_decimo.sexo === true){
                                h++;
                            }
                            else{
                                m += 1;
                                console.log(m);
                            }
                            data.push({'ced':estudiante_decimo.nacionalidad,'nom': estudiante_decimo.segundo_apellido + ' ' + estudiante_decimo.primer_apellido + ' ' + estudiante_decimo.name, 'cie': '','fir': ''});
                        }
                    });
                    var t = m + h;
                    var encabezado =
                        'Colegio Científico de Costa Rica                     Mujeres: ' + m + '\n' +
                        'Sede Regional San Carlos                             Hombres: ' + h + '\n' +
                        'Telefax: 2475-7089,Tel: 2401-3122                    Total: ' + t + '\n';
                    var titulo = '              LISTA CIENCIA PARA BACHILLERATO DÉCIMO AÑO ' + new Date().getFullYear() +'\n';
                    if(data.length > 0) {
                        $scope.generatePDF('Lista ciencia para bachillerato décimo', encabezado, titulo, columns, data, 95, true);
                    }


                    h = 0;
                    t = 0;
                    m = 0;
                });
                data2 = [];
                estudiantes_undecimo = Undecimo.query();
                estudiantes_undecimo.$promise.then(function(estudiantes){
                    var m = 0;
                    var h = 0;
                    angular.forEach(estudiantes, function(estudiante_undecimo){

                        if((estudiante_undecimo.admitido) && (!estudiante_undecimo.traladado)) {
                            if(estudiante_undecimo.sexo === true){
                                h++;
                            }
                            else{
                                m++;
                            }
                            data2.push({'ced':estudiante_undecimo.nacionalidad,'nom': estudiante_undecimo.segundo_apellido + ' ' + estudiante_undecimo.primer_apellido + ' ' + estudiante_undecimo.name, 'cie': '','fir': ''});
                        }
                    });
                    var t = m + h;
                    var encabezado =
                        'Colegio Científico de Costa Rica                     Mujeres: ' + m + '\n' +
                        'Sede Regional San Carlos                             Hombres: ' + h + '\n' +
                        'Telefax: 2475-7089,Tel: 2401-3122                    Total: ' + t + '\n';
                    var titulo = '              LISTA CIENCIA PARA BACHILLERATO UNDÉCIMO AÑO ' + new Date().getFullYear() +'\n';
                    if(data2.length > 0) {
                        $scope.generatePDF('Lista ciencia para bachillerato undécimo', encabezado, titulo, columns, data, 95, true);
                    }
                });
            }
            else if(reporte.val === 4){
                columns = [
                    {title: 'Cédula', key: 'ced'},
                    {title: 'Nombre', key: 'nom'},
                    {title: 'E-mail', key: 'mail'}
                ];
                data = [];
                estudiantes_decimo = Decimo.query();
                estudiantes_decimo.$promise.then(function(estudiantes) {
                    angular.forEach(estudiantes, function (estudiante_decimo) {
                        if ((estudiante_decimo.admitido) && (!estudiante_decimo.traladado)){
                            data.push({'ced':estudiante_decimo.nacionalidad, 'nom':estudiante_decimo.segundo_apellido + estudiante_decimo.primer_apellido + estudiante_decimo.name, 'mail': estudiante_decimo.correo});
                        }
                    });
                    var encabezado =
                        'Colegio Científico de Costa Rica\n' +
                        'Instituto Tecnológico de Costa Rica, Sede Regional San Carlos\n' +
                        'Telefax: 2475-7089,Tel: 2401-3122\n';
                    var titulo = '';
                    if(data.length > 1) {
                        $scope.generatePDF('Lista correos décimo', encabezado, titulo, columns, data, 70, true);
                    }
                });
                data2 = [];
                estudiantes_undecimo = Undecimo.query();
                estudiantes_undecimo.$promise.then(function(estudiantes){
                    angular.forEach(estudiantes, function(estudiante_undecimo){
                        if((estudiante_undecimo.admitido) && (!estudiante_undecimo.traladado)) {
                            data2.push({'ced':estudiante_undecimo.nacionalidad, 'nom':estudiante_undecimo.segundo_apellido + estudiante_undecimo.primer_apellido + estudiante_undecimo.name, 'mail': estudiante_undecimo.correo});
                        }
                    });
                    var encabezado =
                        'Colegio Científico de Costa Rica\n' +
                        'Instituto Tecnológico de Costa Rica, Sede Regional San Carlos\n' +
                        'Telefax: 2475-7089,Tel: 2401-3122\n';
                    var titulo = '';
                    if(data2.length > 0) {
                        $scope.generatePDF('Lista correos undécimo', encabezado, titulo, columns, data2, 70, true);
                    }
                });
            }
            else if(reporte.val === 5){
                columns = [
                    {title: 'Cédula', key: 'ced'},
                    {title: 'Nombre', key: 'nom'},
                    {title: 'Biología', key: 'bio'},
                    {title: 'Química', key: 'quim'},
                    {title: 'Física', key: 'fis'}
                ];
                data = [];
                estudiantes_undecimo = Undecimo.query();
                estudiantes_undecimo.$promise.then(function(estudiantes){
                    var m = 0;
                    var h = 0;
                    angular.forEach(estudiantes, function(estudiante_undecimo){
                        if((estudiante_undecimo.admitido) && (!estudiante_undecimo.traladado)) {
                            if(estudiante_undecimo.sexo === true){
                                h++;
                            }
                            else{
                                m++;
                            }
                            data.push({'ced':estudiante_undecimo.nacionalidad,'nom': estudiante_undecimo.segundo_apellido + ' ' + estudiante_undecimo.primer_apellido + ' ' + estudiante_undecimo.name, 'bio': '','quim': '', 'fis': ''});
                        }
                    });
                    var t = m + h;
                    var encabezado =
                        'Colegio Científico de Costa Rica                     Mujeres: ' + m + '\n' +
                        'Sede Regional San Carlos                             Hombres: ' + h + '\n' +
                        'Telefax: 2475-7089,Tel: 2401-3122                    Total: ' + t + '\n';
                    var titulo = '\n'+'              ESCOGENCIA DE CIENCIA BACHILLERATO ' + new Date().getFullYear() +'\n';
                    titulo += '\nProfesores:\nAsignaturas:';
                    if(data.length > 0) {
                        $scope.generatePDF('Escogencia de ciencia bachierato', encabezado, titulo, columns, data, 165, true);
                    }
                });
            }
            else if(reporte.val === 6){
                columns = [
                    {title: 'Cédula', key: 'ced'},
                    {title: 'Nombre', key: 'nom'},
                    {title: 'Email', key: 'email'},
                    {title: 'Dirección', key: 'dir'},
                    {title: 'Fecha de nacimiento', key: 'nac'},
                    {title: 'Edad', key: 'edad'}
                ];
                data = [];
                estudiantes_decimo = Decimo.query();
                estudiantes_decimo.$promise.then(function(estudiantes) {
                    var m = 0;
                    var h = 0;
                    var t = 0;
                    angular.forEach(estudiantes, function (estudiante_decimo) {
                        if ((estudiante_decimo.admitido) && (!estudiante_decimo.traladado)) {
                            if(estudiante_decimo.sexo === true){
                                h++;
                            }
                            else{
                                m += 1;
                                console.log(m);
                            }
                            var fecha_split = estudiante_decimo.fecha_de_nacimiento.split('-');
                            var f = new Date();
                            if(fecha_split[2].length === 4)
                                f = new Date(fecha_split[2], fecha_split[1], fecha_split[0]);
                            else
                                f = new Date(fecha_split[0], fecha_split[1], fecha_split[2]);
                            var edad = new Date().getFullYear() - f.getFullYear();
                            data.push({'ced':estudiante_decimo.nacionalidad,'nom': estudiante_decimo.segundo_apellido + ' ' + estudiante_decimo.primer_apellido + ' ' + estudiante_decimo.name,
                                'email': estudiante_decimo.correo, 'dir': estudiante_decimo.direccion_exacta, 'nac': estudiante_decimo.fecha_de_nacimiento, 'edad': edad});
                        }
                    });
                    t = m + h;
                    var encabezado =
                        'Colegio Científico de Costa Rica                     Mujeres: ' + m + '\n' +
                        'Sede Regional San Carlos                             Hombres: ' + h + '\n' +
                        'Telefax: 2475-7089,Tel: 2401-3122                    Total: ' + t + '\n';
                    var titulo = '              LISTA DE CORREOS DÉCIMO AÑO ' + new Date().getFullYear() +'\n';
                    if(data.length > 0) {
                        $scope.generatePDF('Lista para la biblioteca décimo', encabezado, titulo, columns, data, 95 , true);
                    }
                });
                estudiantes_undecimo = Undecimo.query();
                estudiantes_undecimo.$promise.then(function(estudiantes){
                    data = [];
                    var m = 0;
                    var h = 0;
                    var t = 0;
                    angular.forEach(estudiantes, function(estudiante_undecimo){
                        if((estudiante_undecimo.admitido) && (!estudiante_undecimo.traladado)) {
                            if(estudiante_undecimo.sexo === true){
                                h++;
                            }
                            else{
                                m++;
                            }
                            var fecha_split = estudiante_undecimo.fecha_de_nacimiento.split('-');
                            var f = new Date();
                            if(fecha_split[2].length === 4)
                                f = new Date(fecha_split[2], fecha_split[1], fecha_split[0]);
                            else
                                f = new Date(fecha_split[0], fecha_split[1], fecha_split[2]);
                            var edad = new Date().getFullYear() - f.getFullYear();
                            data.push({'ced':estudiante_undecimo.nacionalidad,'nom': estudiante_undecimo.segundo_apellido + ' ' + estudiante_undecimo.primer_apellido + ' ' + estudiante_undecimo.name,
                                'email': estudiante_undecimo.correo, 'dir': estudiante_undecimo.direccion_exacta, 'nac': estudiante_undecimo.fecha_de_nacimiento, 'edad': edad});
                        }
                    });
                    t = m + h;
                    var encabezado =
                        'Colegio Científico de Costa Rica                     Mujeres: ' + m + '\n' +
                        'Sede Regional San Carlos                             Hombres: ' + h + '\n' +
                        'Telefax: 2475-7089,Tel: 2401-3122                    Total: ' + t + '\n';
                    var titulo = '\n'+'              LISTA DE CORREOS UNDÉCIMO AÑO ' + new Date().getFullYear() +'\n';
                    if(data.length > 0) {
                        $scope.generatePDF('Lista para la biblioteca undécimo', encabezado, titulo, columns, data, 95, true);
                    }
                });
            }
            else if(reporte.val === 7){
                columns = [
                    {title: 'Cédula', key: 'ced'},
                    {title: 'Nombre', key: 'nom'},
                    {title: 'Participación Olimpiada', key: 'par'}
                ];
                data = [];
                estudiantes_decimo = Decimo.query();
                estudiantes_decimo.$promise.then(function(estudiantes) {
                    var m = 0;
                    var h = 0;
                    var t = 0;
                    angular.forEach(estudiantes, function (estudiante_decimo) {
                        if ((estudiante_decimo.admitido) && (!estudiante_decimo.traladado)) {
                            if(estudiante_decimo.sexo === true){
                                h++;
                            }
                            else{
                                m += 1;
                                console.log(m);
                            }
                            data.push({'ced':estudiante_decimo.nacionalidad,'nom': estudiante_decimo.segundo_apellido + ' ' + estudiante_decimo.primer_apellido + ' ' + estudiante_decimo.name,
                                'par': ''});
                        }
                    });
                    t = m + h;
                    var encabezado =
                        'Colegio Científico de Costa Rica                     Mujeres: ' + m + '\n' +
                        'Sede Regional San Carlos                             Hombres: ' + h + '\n' +
                        'Telefax: 2475-7089,Tel: 2401-3122                    Total: ' + t + '\n';
                    var titulo = '\n'+'              LISTA INTERESADOS OLIMPIADA DÉCIMO AÑO ' + new Date().getFullYear() +'\n';
                    titulo += '\nProfesores:\nAsignaturas:';
                    if(data.length > 0) {
                        $scope.generatePDF('Lista participación olimpiadas décimo', encabezado, titulo, columns, data, 165, true);
                    }
                });
                estudiantes_undecimo = Undecimo.query();
                estudiantes_undecimo.$promise.then(function(estudiantes){
                    data = [];
                    var m = 0;
                    var h = 0;
                    var t = 0;
                    angular.forEach(estudiantes, function(estudiante_undecimo){
                        if((estudiante_undecimo.admitido) && (!estudiante_undecimo.traladado)) {
                            if(estudiante_undecimo.sexo === true){
                                h++;
                            }
                            else{
                                m++;
                            }
                            data.push({'ced':estudiante_undecimo.nacionalidad,'nom': estudiante_undecimo.segundo_apellido + ' ' + estudiante_undecimo.primer_apellido + ' ' + estudiante_undecimo.name,
                                'par': ''});
                        }
                    });
                    t = m + h;
                    var encabezado =
                        'Colegio Científico de Costa Rica                     Mujeres: ' + m + '\n' +
                        'Sede Regional San Carlos                             Hombres: ' + h + '\n' +
                        'Telefax: 2475-7089,Tel: 2401-3122                    Total: ' + t + '\n';
                    var titulo = '\n'+'              LISTA INTERESADOS OLIMPIADA UNDÉCIMO AÑO ' + new Date().getFullYear() +'\n';
                    titulo += '\nProfesores:\nAsignaturas:';
                    if(data.length > 0) {
                        $scope.generatePDF('Lista participación olimpiadas undécimo', encabezado, titulo, columns, data, 165, true);
                    }
                });
            }
            else if(reporte.val ===8){
                $scope.reporte_notas(true);
            }
        };
        $scope.show = false;
        $scope.base64 = $sce.trustAsResourceUrl('data:application/pdf;base64,JVBERi0xLjMKMyAwIG9iago8PC9UeXBlIC9QYWdlCi9QYXJlbnQgMSAwIFIKL1Jlc291cmNlcyAyIDAgUgovQ29udGVudHMgNCAwIFI+PgplbmRvYmoKNCAwIG9iago8PC9MZW5ndGggMTYwNT4+CnN0cmVhbQowLjU3IHcKMCBHCnEKcSBCVCA0Mi41MiA3OTUuNjIgVGQKMCAtMjIuNTAgVGQKL0YyIDE1LjAwIFRmIChBYm91dCBqc1BERikgVGoKRVQgUQpxIEJUIDQyLjUyIDc2MS44NyBUZAowIC0xNi44OCBUZAovRjEgMTEuMjUgVGYgKFNpbXBseSBpbmNsdWRlIHRoZSBqc1BERiBsaWJyYXJ5IGluIHlvdXIgPGhlYWQ+LCBnZW5lcmF0ZSB5b3VyIFBERiB1c2luZyB0aGUgbWFueSBidWlsdC1pbikgVGoKMCAtMTYuODggVGQKL0YxIDExLjI1IFRmIChmdW5jdGlvbnMsIHRoZW4gaG9vayB1cCBhIGJ1dHRvbiB0byB0cmlnZ2VyIHRoZSBkb3dubG9hZC4gQWxsIHRoZSBleGFtcGxlcyBoZXJlIHVzZSBqUXVlcnkuKSBUagpFVCBRCnEgQlQgNDIuNTIgNzA5LjM3IFRkCjAgLTIyLjUwIFRkCi9GMiAxNS4wMCBUZiAoQnJvd3NlciBDb21wYXRpYmlsaXR5KSBUagpFVCBRCnEgQlQgNDIuNTIgNjc1LjYyIFRkCjAgLTE2Ljg4IFRkCi9GMSAxMS4yNSBUZiAoanNQREYgd2lsbCB3b3JrIGluIElFNisqLCBGaXJlZm94IDMrLCBDaHJvbWUsIFNhZmFyaSAzKywgT3BlcmEuIEZvciBJRTkgYW5kIGJlbG93LCB3ZSBsYXppbHkgbG9hZCkgVGoKMCAtMTYuODggVGQKL0YxIDExLjI1IFRmIChhIEZsYXNoIHNoaW0gY2FsbGVkIERvd25sb2FkaWZ5IHdoaWNoIGVuYWJsZXMgdGhlIGZpbGVzIHRvIGJlIGRvd25sb2FkZWQuICkgVGoKL0YzIDExLjI1IFRmIChcKEN1cnJlbnQgYnVpbGQgZG9lcykgVGoKMCAtMTYuODggVGQKL0YzIDExLjI1IFRmIChub3QgaGF2ZSBJRTYtOSBzaGltIGVuYWJsZWRcKSkgVGoKRVQgUQpxIEJUIDQyLjUyIDYwNi4yNSBUZAowIC0yMi41MCBUZAovRjIgMTUuMDAgVGYgKENyZWRpdHMpIFRqCkVUIFEKcSBCVCA0Mi41MiA1NzIuNTAgVGQKMCAtMTYuODggVGQKL0YxIDExLjI1IFRmIChCaWcgdGhhbmtzIHRvIERhbmllbCBEb3RzZW5rbyBmcm9tIFdpbGxvdyBTeXN0ZW1zIENvcnBvcmF0aW9uIGZvciBtYWtpbmcgaHVnZSBjb250cmlidXRpb25zIHRvKSBUagowIC0xNi44OCBUZAovRjEgMTEuMjUgVGYgKHRoZSBjb2RlYmFzZS4gVGhhbmtzIHRvIEFqYXhpYW4uY29tIGZvciBmZWF0dXJpbmcgdXMgYmFjayBpbiAyMDA5LiBFdmVyeW9uZSBlbHNlIHRoYXQncykgVGoKMCAtMTYuODggVGQKL0YxIDExLjI1IFRmIChjb250cmlidXRlZCBwYXRjaGVzIG9yIGJ1ZyByZXBvcnRzLCB5b3Ugcm9jay4pIFRqCkVUIFEKcSBCVCA0Mi41MiA1MDMuMTIgVGQKMCAtMjIuNTAgVGQKL0YyIDE1LjAwIFRmIChOZWVkIEhlbHA/KSBUagpFVCBRCnEgQlQgNDIuNTIgNDY5LjM3IFRkCjAgLTE2Ljg4IFRkCi9GMSAxMS4yNSBUZiAoU2VuZCB1cyBhIHR3ZWV0IGFuZCB3ZSdsbCBzZWUgaWYgd2UgY2FuIGhlbHAuKSBUagpFVCBRCnEgQlQgNDIuNTIgNDM3LjUwIFRkCjAgLTE2Ljg4IFRkCi9GMSAxMS4yNSBUZiAoQHBhcmFsbGF4KSBUagovRjEgMTEuMjUgVGYgKCBvciApIFRqCi9GMSAxMS4yNSBUZiAoQE1yUmlvKSBUagpFVCBRCnEgQlQgNDIuNTIgNDA1LjYyIFRkCjAgLTE2Ljg4IFRkCi9GMSAxMS4yNSBUZiAoT3IgY2hlY2sgb3V0ICkgVGoKL0YxIDExLjI1IFRmIChvdXIgZG9jdW1lbnRhdGlvbikgVGoKL0YxIDExLjI1IFRmICguKSBUagpFVCBRClEKZW5kc3RyZWFtCmVuZG9iagoxIDAgb2JqCjw8L1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUiBdCi9Db3VudCAxCi9NZWRpYUJveCBbMCAwIDU5NS4yOCA4NDEuODldCj4+CmVuZG9iago1IDAgb2JqCjw8L0Jhc2VGb250L0hlbHZldGljYS9UeXBlL0ZvbnQKL0VuY29kaW5nL1dpbkFuc2lFbmNvZGluZwovU3VidHlwZS9UeXBlMT4+CmVuZG9iago2IDAgb2JqCjw8L0Jhc2VGb250L0hlbHZldGljYS1Cb2xkL1R5cGUvRm9udAovRW5jb2RpbmcvV2luQW5zaUVuY29kaW5nCi9TdWJ0eXBlL1R5cGUxPj4KZW5kb2JqCjcgMCBvYmoKPDwvQmFzZUZvbnQvSGVsdmV0aWNhLU9ibGlxdWUvVHlwZS9Gb250Ci9FbmNvZGluZy9XaW5BbnNpRW5jb2RpbmcKL1N1YnR5cGUvVHlwZTE+PgplbmRvYmoKOCAwIG9iago8PC9CYXNlRm9udC9IZWx2ZXRpY2EtQm9sZE9ibGlxdWUvVHlwZS9Gb250Ci9FbmNvZGluZy9XaW5BbnNpRW5jb2RpbmcKL1N1YnR5cGUvVHlwZTE+PgplbmRvYmoKOSAwIG9iago8PC9CYXNlRm9udC9Db3VyaWVyL1R5cGUvRm9udAovRW5jb2RpbmcvV2luQW5zaUVuY29kaW5nCi9TdWJ0eXBlL1R5cGUxPj4KZW5kb2JqCjEwIDAgb2JqCjw8L0Jhc2VGb250L0NvdXJpZXItQm9sZC9UeXBlL0ZvbnQKL0VuY29kaW5nL1dpbkFuc2lFbmNvZGluZwovU3VidHlwZS9UeXBlMT4+CmVuZG9iagoxMSAwIG9iago8PC9CYXNlRm9udC9Db3VyaWVyLU9ibGlxdWUvVHlwZS9Gb250Ci9FbmNvZGluZy9XaW5BbnNpRW5jb2RpbmcKL1N1YnR5cGUvVHlwZTE+PgplbmRvYmoKMTIgMCBvYmoKPDwvQmFzZUZvbnQvQ291cmllci1Cb2xkT2JsaXF1ZS9UeXBlL0ZvbnQKL0VuY29kaW5nL1dpbkFuc2lFbmNvZGluZwovU3VidHlwZS9UeXBlMT4+CmVuZG9iagoxMyAwIG9iago8PC9CYXNlRm9udC9UaW1lcy1Sb21hbi9UeXBlL0ZvbnQKL0VuY29kaW5nL1dpbkFuc2lFbmNvZGluZwovU3VidHlwZS9UeXBlMT4+CmVuZG9iagoxNCAwIG9iago8PC9CYXNlRm9udC9UaW1lcy1Cb2xkL1R5cGUvRm9udAovRW5jb2RpbmcvV2luQW5zaUVuY29kaW5nCi9TdWJ0eXBlL1R5cGUxPj4KZW5kb2JqCjE1IDAgb2JqCjw8L0Jhc2VGb250L1RpbWVzLUl0YWxpYy9UeXBlL0ZvbnQKL0VuY29kaW5nL1dpbkFuc2lFbmNvZGluZwovU3VidHlwZS9UeXBlMT4+CmVuZG9iagoxNiAwIG9iago8PC9CYXNlRm9udC9UaW1lcy1Cb2xkSXRhbGljL1R5cGUvRm9udAovRW5jb2RpbmcvV2luQW5zaUVuY29kaW5nCi9TdWJ0eXBlL1R5cGUxPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1Byb2NTZXQgWy9QREYgL1RleHQgL0ltYWdlQiAvSW1hZ2VDIC9JbWFnZUldCi9Gb250IDw8Ci9GMSA1IDAgUgovRjIgNiAwIFIKL0YzIDcgMCBSCi9GNCA4IDAgUgovRjUgOSAwIFIKL0Y2IDEwIDAgUgovRjcgMTEgMCBSCi9GOCAxMiAwIFIKL0Y5IDEzIDAgUgovRjEwIDE0IDAgUgovRjExIDE1IDAgUgovRjEyIDE2IDAgUgo+PgovWE9iamVjdCA8PAo+Pgo+PgplbmRvYmoKMTcgMCBvYmoKPDwKL1Byb2R1Y2VyIChqc1BERiAyMDEyMDYxOSkKL0NyZWF0aW9uRGF0ZSAoRDoyMDE1MDYyMjA5NTAzNykKPj4KZW5kb2JqCjE4IDAgb2JqCjw8Ci9UeXBlIC9DYXRhbG9nCi9QYWdlcyAxIDAgUgovT3BlbkFjdGlvbiBbMyAwIFIgL0ZpdEggbnVsbF0KL1BhZ2VMYXlvdXQgL09uZUNvbHVtbgo+PgplbmRvYmoKeHJlZgowIDE5CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMTc0MiAwMDAwMCBuIAowMDAwMDAyOTcxIDAwMDAwIG4gCjAwMDAwMDAwMDkgMDAwMDAgbiAKMDAwMDAwMDA4NyAwMDAwMCBuIAowMDAwMDAxODI5IDAwMDAwIG4gCjAwMDAwMDE5MTkgMDAwMDAgbiAKMDAwMDAwMjAxNCAwMDAwMCBuIAowMDAwMDAyMTEyIDAwMDAwIG4gCjAwMDAwMDIyMTQgMDAwMDAgbiAKMDAwMDAwMjMwMiAwMDAwMCBuIAowMDAwMDAyMzk2IDAwMDAwIG4gCjAwMDAwMDI0OTMgMDAwMDAgbiAKMDAwMDAwMjU5NCAwMDAwMCBuIAowMDAwMDAyNjg3IDAwMDAwIG4gCjAwMDAwMDI3NzkgMDAwMDAgbiAKMDAwMDAwMjg3MyAwMDAwMCBuIAowMDAwMDAzMTk1IDAwMDAwIG4gCjAwMDAwMDMyNzcgMDAwMDAgbiAKdHJhaWxlcgo8PAovU2l6ZSAxOQovUm9vdCAxOCAwIFIKL0luZm8gMTcgMCBSCj4+CnN0YXJ0eHJlZgozMzgxCiUlRU9G');
        $scope.nombre_reporte_notas_undecimo = '';
        $scope.nombre_reporte_notas_decimo = '';


        $scope.specialElementHandlers = {
            '#editor': function(element, renderer){
                return true;
            }
        };

        $scope.generatePDF = function(filename, encabezado, titulo, columns, data, starty, save){
            var doc = new jsPDF('p', 'pt');
            var img_data = 'data:image/jpeg;base64,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';
            doc.addImage(img_data, 'JPEG',15,15,25,25);
            doc.text(40, 19, encabezado);
            doc.text(15, 80, titulo);
            doc.autoTable(columns, data, {margins: {right: 10, left: 10, top: 100, bottom: 100}, startY: starty});
            if(save) {
                doc.save(filename + '.pdf');
            }
            else{
                $scope.base64 = $sce.trustAsResourceUrl('data:application/pdf;base64,' + btoa(doc.output()));
            }
        };

        $scope.reporte_notas = function(save){
            $scope.notas_decimo_1 = [
                {curso: 'Español', nota: 0, semestre: 1},
                {curso: 'Matemáticas', nota: 0, semestre: 1},
                {curso: 'Física', nota: 0, semestre: 1},
                {curso: 'Química', nota: 0, semestre: 1},
                {curso: 'Biología', nota: 0, semestre: 1},
                {curso: 'Bioteclogía', nota: 0, semestre: 1},
                {curso: 'Computación', nota: 0, semestre: 1},
                {curso: 'Robótica', nota: 0, semestre: 1},
                {curso: 'Dibujo Técnico', nota: 0, semestre: 1},
                {curso: 'Inglés', nota: 0, semestre: 1},
                {curso: 'Investigación', nota: 0, semestre: 1},
                {curso: 'Historia', nota: 0, semestre: 1},
                {curso: 'Geografía', nota: 0, semestre: 1},
                {curso: 'Educ. Religiosa', nota: 0, semestre: 1},
                {curso: 'Educ. Cívica', nota: 0, semestre: 1},
                {curso: 'Educ. Física', nota: 0, semestre: 1},
                {curso: 'Matemática(PROF.)', nota: 0, semestre: 1},
                {curso: 'Física(PROF.)', nota: 0, semestre: 1},
                {curso: 'Química(PROF.)', nota: 0, semestre: 1},
                {curso: 'Biología(PROF.)', nota: 0, semestre: 1},
                {curso: 'Conducta', nota: 0, semestre: 1},
                {curso: 'Promedio', nota: 0, semestre: 1}];
            $scope.notas_undecimo_1 = [
                {curso: 'Español', nota: 0, semestre: 1},
                {curso: 'Matemáticas', nota: 0, semestre: 1},
                {curso: 'Física', nota: 0, semestre: 1},
                {curso: 'Química', nota: 0, semestre: 1},
                {curso: 'Biología', nota: 0, semestre: 1},
                {curso: 'Bioteclogía', nota: 0, semestre: 1},
                {curso: 'Computación', nota: 0, semestre: 1},
                {curso: 'Robótica', nota: 0, semestre: 1},
                {curso: 'Dibujo Técnico', nota: 0, semestre: 1},
                {curso: 'Inglés', nota: 0, semestre: 1},
                {curso: 'Investigación', nota: 0, semestre: 1},
                {curso: 'Historia', nota: 0, semestre: 1},
                {curso: 'Geografía', nota: 0, semestre: 1},
                {curso: 'Educ. Religiosa', nota: 0, semestre: 1},
                {curso: 'Educ. Cívica', nota: 0, semestre: 1},
                {curso: 'Educ. Física', nota: 0, semestre: 1},
                {curso: 'Matemática(PROF.)', nota: 0, semestre: 1},
                {curso: 'Física(PROF.)', nota: 0, semestre: 1},
                {curso: 'Química(PROF.)', nota: 0, semestre: 1},
                {curso: 'Biología(PROF.)', nota: 0, semestre: 1},
                {curso: 'Conducta', nota: 0, semestre: 1},
                {curso: 'Promedio', nota: 0, semestre: 1}];
            //console.log(estudiante);
            var notas_estudiante = GetNotas.query({
                cedula_estudiante: $scope.ced_estudiante
            });
            var columns = [
                {title: 'Asignarura', key: 'asig'},
                {title: '  I  ', key: 'i'},
                {title: '  II  ', key: 'ii'},
                {title: 'PROM.', key: 'prom'},
                {title: 'M', key: 'm'},
                {title: 'I', key: 'iii'},
                {title: 'T', key: 't'},
                {title: 'M', key: 'm2'},
                {title: 'I', key: 'iii2'},
                {title: 'T', key: 't2'}
            ];

            notas_estudiante.$promise.then(function(notas) {
                //
                $scope.estudiante = Nacionalidad.query({
                    cedula: $scope.ced_estudiante
                });
                $scope.estudiante.$promise.then(function(estudiante){
                    var data = [];
                    angular.forEach($scope.notas_decimo_1, function (curso){
                        var notas_cursos = [];
                        for(var i = 0;i<notas.length;i++){
                            if((notas[i].curso === curso.curso) && (notas[i].anno === new Date().getFullYear())){
                                notas_cursos.push(notas[i]);
                            }
                            if(notas_cursos.length === 2){
                                var c = notas_cursos[0].curso;
                                var s1 = notas_cursos[0].nota;
                                var s2 = notas_cursos[1].nota;
                                var p = (notas_cursos[0].nota + notas_cursos[1].nota)/2;
                                data.push({'asig' : c, 'i': s1, 'ii':s2, 'prom': p, 'm': '', 'iii':'', 't':'', 'm2':'', 'iii2':'', 't2':''});
                                break;
                            }
                        }


                    });
                    var doc = new jsPDF('p', 'pt');
                    doc.setFontSize(16);
                    var img_data = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEA3ADcAAD/4QAiRXhpZgAATU0AKgAAAAgAAQESAAMAAAABAAEAAAAAAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCACAAHsDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9/KKKKACijNeL/G/9szw38EvHvhnw/dSW0lx4ke6k+3T3kVtYWMVqyC4Dyt96dd6hYFG9vm/uk0Aes63r1l4a02a91C6t7Kzt13SzTyCOONfUs1eQah+3h8PZNN0+50XUrjxNDrFxfWWm3FhbO1nqF1aWU949vFcMBE58q3mGUZhuQr96vl2//aK+M2o/GbTbXx/8P4fFdh4N8ZXHhfXH8NwtcWd3pV48TQz3mnylmikRVtJ0mRpI/knX5GavbvDv7EGoL4R1TwpNqFtpOh+HfiPH438GXEUX2j7HbvcC6uLJ4srtRmmvoF2t8sVwv93bQBm6V/wUsW88B+DfFE2h6M2k+LF1CXytM1v+0bmzS20t9Riil/dIqzusUqsnzbdv3mrUk/aa+Ingz9mnSfiJrUfhHU7rxwmk2/h7R7GKeKKzu9SniihWe4Z23xIs6s7Ki/cbb2rrPCX7JHw++E/we8B+GtQuPtGl/DS9e90ue9uI4drvFcwYl27UdPIupE2sPmXbmsew/Zv+B/hj4TahFJqUDeB7yIWUYvfEksmmaaqzq6Lal5fLt2SVEZfL2srIMVtGjOUVKMWBy/jv9u/xR8DJvGuheKdF8ParrvhC90SOTU7Oeew0eO11MyqlxcswleFYpIJN+N3ysjfKtfTXhHUrzXvCem3mo2trZX15axT3FvbXX2uGGVkVmVJdi+Yqt0fau7rtrwlP2Vfh78SPA2vaZ4X8ca4v/CUM39u6lY67Fql1rUTwNbeVcS3Czb0WNtq/3eo+avVtW8N33wv+AU2i+A7GO61Dw7of2DQbS4uflkeGHZbo8rHp8qbmaoqUpR0muVgb3hzxxo3jCS8XStU0/UW0+d7W6S2uEla3mRtro4U/KysCCDW5X5pl/EH7JGleCda8M+Ade0nxNoeg3Xh6c6lElvc/EDxPqcq+TBtV/wDSI45/tF087N8qbtv8Vfb/AOy7feONS+EunzeO9QsdU1aRIyl3FpT6VPMnlru+0WrOyxSh9/3G2su07V+7UAem0UUUAFFFFABRRXkv7Vn7Ro/Zq8K+HNWms/MsNW1yDTb2+lgnlh0mAxSzPO6Qo0jFlh8mNVX5pZ4gcLuoAwf25PixffC3wf4U/wCJzdeEvDeveIrfSfEXiW32b/D9pKku2XzJFZIVknWGHznXbH5+7j7y+K+Lv2WdD/aO+PWuL8O/FEY0OzvrTWtV1CFY7xNB8TRJuiv7NzujlnlgVYryH7rLLE/3mavpD4L/AB98I/tWeH/EFpp9jq3kabKNO1bSvEOiT2E5SWFXTfb3CLuilidWXjayt9RXx7/wVy/4K1+C/wDglL8K7XwL8P8ASdEHj7U7dv7K0awt0gsdGibd/pE0SABV3fdRV3M2f9qvc4a4dzDPcwp5XldPnqT/AKu/JGNatClBzmz2L9pf9tP4M/8ABKj4btqPjnxRcah4q1aPdi4lS88Q+I3TdgsFC/IrM23CpFHu2qq/dr8ff2zf+DoD40fG68utP+GNvZ/DPQZGKRXCIl5qkibsbmd18tNw/ur/AMCr5Z+Bf7OPxs/4K8ftFalqEdxea9ql5L52s+ItVldbPTUZvly+3+Fd21EWv2N/Y5/4Il/BP9jTQbfWvEFnZ+NPElmiy3Wsa6i/ZIX/AImSFm8tFX/a3NX6Zx5x94TeCNOOG4i/4Vc4lth4e8oy6Jx2Xzu+yOTC4TH5lrS9yn/MfjFpvgX9p79urU/7Ujsfi98RjcN/yELk3l1bbt23b5znyl/76/hr9Lfjp8AfGfwX/wCDZez8G+LtJvNJ8VWusKs1lLOkkys+qOyLuR2Xcysv8X8VfRHx7/4Ld/s3/s33Emlv4sbxFfWKqn9n+GrP7Yse35divlYF2/3d61y37fH7YOn/ALUn/BDq4+Kfg211DT9N1LWomt7fVbeBrlfKv2jy6Kzqrbk/havmeG/HjxI48zHB/wBp8MLLcsjUjKi3FxcpfZjdqKaabekTeeV4TCxfJX55n436B+xn8ePhv4fvvE2n2viTQf7B/euYdRe1uY0XczOm1/mVVXd8rf3fvV7f+yT/AMF7f2mf2aJ4IbjxXdfELw9Z4WWx8Rp9qZV3fw3P+tVv4fmZl/2a+m/+CZ/xo1b9qT4N64nidoby80u9azlk2MrTRPErKz/7Tbn/AO+Vp3iT/gn/AKJ8NNN1Cz0HQdUudNum+0RXFkkMl1GzNtlt5XdvMaNlZdu1fl2tX7hifE7L8RVxGWcV4Cm6kXaK5fv13ucccLL46cj7X/Y5/wCCw3wR/wCCmPhaw8EfEDRrfwl4p1ja9vouvfLbX8qk7ZbG5bbulVslWXbIrLuXpur6x/al+KOofs3/ALKvizxR4fsP7VvvDGktLYxXcrypkbUEsznLlIwd7sTu2o9fzfft0fC/XG1TTbywmt7jRfB9pFa/Z7ed5LzRd7s+6Zdq7FZ2ZVZPl+Rfu192f8EWP+C6t7bappPwd+OGpfbbS+ZbLQvE1267gzfKtrdlvvbm+VZW/vbW/vV8PxN4Sxr5V/rDw5rT1c6V7uPo+unTf1OinirS5Kh+j+iePtQ/ZUn0PVPih8d/C+teFfEVu6TXniN9P0bbe4Ro/wCz2iVFeBl3/I7PIuFbe3zY+gtM1S31uwgu7WeK5tLqNZYZonDpMhAKupHVSK+Yfix8HtU/Z4+LLfETwT4L8D6xp0fhiHw5pFvqOpJo1n4Qla6neWVP3bL5Fz50Ky+UFk/0WJVVlb5XfsJfFC98EbfhBdaFfXlr4Flm0SfxTDKv2G41ONILqaBbf71vBi8VINzNuWJk+Xau78FO4+qqKKKAKeo6hDo9hNc3E0cNtbo0sssjbUjRfmLE9gBXwf8AGP4hR+MPHfjjVh4k+JUXi2a4S++F2seFZ7q+0DUrZbeDyoEW332j77lZ1lW4X5lf73yrt+nv2yfinqXwe+B82u2U8mn29vqVhFqeoLb/AGn+y7B7qNbm6ZMfdjhLlsj5R838NeN/s16X4H8Q/tx+JtU+G8nhNvDcejpqdxf+DNUlj0+6urn5PK1C3if7JNctteVZVUS7VXc1AGr+1p+0l4b/AOCYP7GPi34marZQp4m1Y/b57Vrp5ZNX1qeJUWJXdmbYpRVUL8qRRfL8q1/On8BPgz8Sf+CwH7b9x/aGoXF1q3iK6bUtf1hkaSPS7Xcu5lXd91VZVRd392vrP/g6Q/bRuPjB+13Y/CfTbxm0H4cW6Pdoj7km1CdFdtw/2Iii/wC8z19sf8EQ/wBjSw/Y0/YptfEOtww2PibxtCuuazdz4ja1tdm6GJmb7qIm5/8Aedq/ZuOOP4eCHhT/AKx4aHNnGa+5hlvKMZbNLyXverSPPwuF/tHG+yl/Dh8R6RrerfB3/gjz+yBG3lx6J4Z0VFhgj4e+1q7Zf72P3k7/AOP3Vr8Tf23P+CpHxg/4KSfERdBsW1DTfDN5deRpHhTR97NNuZtnmsvzTSsv+zt+9tWo/wDgph+214k/4KcfteQ2fh5dQ1Dw7Z3n9k+EtKi3fvt7qnn7P+ekrKv3v4dq/wANfr9/wSf/AOCUHhr9gf4eWmt6za2OrfFDVLVW1PU3RXXTd6qxtbdtvyov8Tr97/dr8KynJ+Ffo+8L0vEbxIpf2lxRmXv0qU/ecHLVaO9rX1dr30R6c54jNK31XB+5QgfnT+yt/wAG2/xU+MGj2uq+PNa034d6dcLv+yPEbzUlRv70Sssat/vPX3d+3B+yHp/7HX/BBW6+G+natda3b6HqaFL24iWKSbzb95TlFbavzPt+9/DWb+3r/wAF/wD4b/sr+IL7wv4Ntf8AhYnizTy0V01vP5em2Mq/eR5l+/Iv91P++t3yrH+0B+1NrX7Zn/Bvu3xB1qxsdP1TXNW/eW9puaKPytRdFVWb/ZQfer63w7468eOM81wfFHH2G+q5TUqR+r0rKPvN3i0vjta+rM8Rhssw0XQwz5p9TnP+CV/7Let/Ar4BpNq00bJ4o8rUksvJ8uW1ZlZdzvu+bdH5X8Py7W/vV9FfEj4Z6h4s+H+taZpOoNo+pahaPBa3qJ5jWrsrKr7d38LUz9hz4hW/xw/Zr8J6wzx/bv7OhgvY0Ty/LmVFVl2t/eXa33v4q9X8V/DdfFHhW80795G1xEyI8c7xMrbflO9GWT5W2/dauvirMMRiM8rYrE/xHN3Ip04qCifmx+zX+wj4tvNF+Knw/wDGd9Il1ssrOLVArTxTQSbp1ZVbbv8AvN8zN+7ZWr5lj/ZXk/Zv/aYh8E+PPB//AAlln4kT7HZ/Y51jl+d2VLiFv4ZF2t8rfdr9Mv2ivjwn7BPwXa48YXP/AAkVxcM1loNmjPJdXjLEzJ5ru3+rVl+Z23N826vyz+K/xQvPi5eXMlvYx6LpUl09/a2aKjSWMr/M6pLs8xY9yr8ittr9z8Nc0z3Mvb0qEeWhOPTSzSVmjlxFOGnc/Zz/AIJg/tK2vxi0jxv+zT8R77/hJ9a8C24toLjUFxLr+kSKoRn/AL0sW4IzL/sN95q9E8d/steMm0DXfhl8LtLsfAHhe+v11q/8a67qFxrOp3+obklR7eJpvMZ1kjiXzZ5dqrHgRvxX4W/s+/tj+KvgT+2P4Z+LWpahNealpN2i6o4Xb9qsmVYpkKr9791lv95Vr97v29v2bbX9sP8AZ80u68M+G/DviLxddS2L6HquobGg0uF54pXmf/nrBtX5ol/1inFfnHirwPWyLF0cS17tdcz/AMS+Jfr8zTDVufTsfQ3gObV7jwbpb69HbQ601rF9vSB98Sz7F37D/d3Zraryj9kT9lrR/wBj74K2fg/RLia8xcS319dyjZ9su5W3SyLEvyRJnAWOMKqqqgV6vX5UdR4D+2P8Mvi94t1HQdW+FGpeF4bzSdO1O0uNP1q+uLOK4lufsyxXCSxRSr5kSRTgCSJl/f8A8O3mP9k3xBqmmfCjxx4i8QaRofhyGHWb0JpWkXMF1b2KWcUcFwpliRFeRrmG5Ztyq3zbTjbXG/taeFdW+NXxyk0PwXoWuXniLwrpVvcX2pW3xF1TwrFAk7ytDAiWb7ZnbY5LSxsvK/8AAWzaxpPgj/glB4q1Pw6muWcK+Htcv7hNXuzeX0eoSy3Ut75s3/LV/tTz/P8AxcMK7Mvw/t8VTov7Uor7yZStG5/Oz8MdGuP2/v8Agqjp0V8zXC/EDx0bu9f7zfZftDSzFf8AdgR/++Vr9j/+C8H7REn7OP8AwT01fT9Kk+w33jKVPDtr5XyMsLKzShf9nykZf+BGvy4/4N8/DcfiD/gpp4YmkXL6XpuoXibv7/kNFu/75lavqr/g6j8T3Fvo/wAG9E3N9lvJ9VvmX+HfEtqit/3zM3/fTV9r9ITLafFP0nOD+BK2uFwtGNXk+zdXl+UEc+V1PY5NiMSt3/X6nmP/AAbSfsj2/wATPjp4k+KmsW8c1h4FiSy0kOm5Wvp1Zi6/7UUS/wDkVf7tfT3/AAcF/wDBRm//AGb/AIX2Hwt8HXzWfirxpA0+o3kT7ZdP0/dtKofvLJK2V3fwqrV2P/BuT4Lg8N/8E6bXUEj23Gua7e3Ep/56bWWJT/3yi1+V3/BYjxpefHD/AIKofECzkmZks9Xh8PWYb5lhSJEiZV/7aM7f8Cr87yPK8P4s/StzXGcRr2mCyODcKb+D900krf4ryOudR4HI4KjpOp+p33/BJD/gjNqX7ecbeOPGV9eaH8Obe4aJGiXbda5KjbXSJm+7Gvzbn2/3lWv1Q/4KDfs9eFv2av8AgjdfeCfCGnf2f4f0fUIVt4WdpW+a8LsWZi3zMzN/31X0B+zb8JtM+BXwH8I+D9Gto7XT/D+lwWkUa/7KLvY/7TMWZv8AaZq85/4K8R7v+CZHiD/sIW//AKUV8NwD9KXiPxS8b6mBr1XDLaErUKEfgiozSTfeVuv3HZVyWjg8Appe/LdnxJ/wRX/aS0nwX481rwN4t1jTdLtfEEFquiJOvl/aLpHdWRX/ALzRsn3v7i1P+0d+2H+054R/ac+JMnhOy1az8JeHdReKKzvdKWe2tbeB9nn79v3ZdjP8rN8r18T2/h+HWLdUk+Vlbcjo21o2X7pVv7y19u/8E8v29ry01XTfgn8VNLbxd4J8YS/2bFq8k7reW/msu2GZ9/zwMxbd8275v+A1/cXHXAkMDj62cRoe2pT3XVd2eNTqXXLseAftcfGrxd+1Z4ksfE+t3WoTaTHYWiwWX2V4rOxu1tUS7WIfxK06y/MzV4umn53p/wACWvrr9tLxHpfwm/aT8ceHfhnpq6X4Ts2XSrvTbnfLbXToVaV0SVvl3NuX5f4V3fxV80+MNbh8U+I5r6PR9P0EXT5+xWO/yY/4fkV3Lfw/3q/XvDmrRhltPD4ajyU5Ruvnr73mcuI+K55n4s0lVk3bPlZa/oO/4ItfGa6+Kf8AwTL8B3BVtQ1PwvZS6C0XmbWmazLRQrvbozRLD8zf3q/Avxjbqsat/Fu2/wDjtfsZ/wAGz+uNrP7GnjDS5m3W+n+KbhVT+Fd8MTGvk/pCYGNfhinibe9SqL8boeF0rcp6p8GP+Cnvi74t/tUaV4En8BeGdI0ubXJdGuLi08RXGrXc3l2FzcPcRGOyS1MUU8K28pE7bZH219rV8BfBPx54k8NeKfC+rx+Ivi5a/Bv+3IdM0e9sdF8M2Oi3CS3awQq8CWbXy2cs7onmrKrN5it8v3q+/a/ic9U+Y/j14X+HPxP/AGm7zRvHTXHhe90zwza3dlrdl4mutDudXtZbi6W4tXeGWPzYomiRtrFtv2njbv8Amo6C1r8bP+CXHiCz0TS9P0vSZNC1zRNHh0+Mx2txZWs91Z2lxCG/5ZTwQxTLn7yyivffiR8FvB/xjtraLxb4Z0HxLHZP5lsmp2EV2IGOMlA4O3OB+Va8vh20i8ONpMdvDDYrB9mS3iQIix7doQAfdXHFdGBxHsMRTrL7Mov7iZRvFo/l2/4IIeME8F/8FP8AwXb3H7ttYt77Tfn/AL7W7uqt/wB+v/Qa+v8A/g6g8G3F54P+EPiJUZrbT7zUtOd/4d86QOq/9827V8D/ABV03Uv+CdP/AAVV1DfHJHJ8N/HC3iJ9z7Rbecsqf8BeB1/4C9ftB/wWA+A8P7bH/BN/Wrzw2v8AaV3ptrD4q0Yxrua4RF3sq/7TRM/3a+5+khmlLhX6Q/BfiZN2wmKpxpOfROV1+VRHLk8XXynEYPrE4H/g23+IVt4o/wCCfLaOjq134b8QXdvOP4l37JU/8devzB/4LQfD+/8AgX/wVG8c37Q+XFqmo2/iGycqyrIsqK7N/wB/Vf8A75r1T/g3X/bMtvgD+1BqXgLW7pbbw/8AEiJIIJJG2xw6hEzeT/wF43dP97ZX3N/wXl/4JuX37X3wbtfHXg20+0+OvA8T5s0X95q1hnc8S/3pEb51/vKzrXwOHzLDeDv0qcwlxD7mXZ7B8tR/B+9s732+K8X2TudrpvH5JH2fx0/0PsD9lL436T+0Z+zt4N8a6Lcx3Njrmlwzbg27bIo2yIf9pXVl/wCAmuH/AOCvp2/8EyfEH/YSt/8A0or8Uf8Agl3/AMFePFX/AATl1y58Ma1ptx4h+H95db73Snfy7rTZtyq8tvu/i+X5kbbu2/wtX6zft1ftO+Gv2sP+CK118QfCsl42h61qETQfaYDFKpS8ZHDL/eVlavkeCfoo8QeF3jZLNow9plWKlzUK0dU+eakovs7ffa6OmedUcZl6p7Tjuj8pdEuPu/NXTeEvCGpfFfxXZ+HdGs5NQ1PVJRb29uo3NI7Nx/wFf9qvNLPxOu1VT86+g/8Agmp4/t/B37a/w/vLpIZLebUfseZV3KrzxPEjr/tKxWv9V+JHLB5RiMY481oPTvofOU/ekon6peHv2EvDviD9lzRfC/xCtbfWPFn2NH1LWlRFvvtOGbiZV3MiM2xd38KrX5d/t0fsj6l+yn8YJrJEvLzw1dfvdN1GRPlkDK26Jm27fMVlb/vmv2e1TxJ5kbfN81fOP7enwZuv2kPgXqGg6fdQ29/DL9tt/MTd5zorMsWd3y7t38Nfxv4c+JOMyvNlTxM/3FSWq6K/Veh6NSipx9D8X/GFwu1V+9/FX7Nf8G1PheXQf2JPEWqzfu4dW8T3Lx7vlXakcSZ/3dytX4s/FbTb/wAF+Jr7SdWt5LG+0t2iuIpPlaN1+8rV/RV/wSj+AjfAn/gnp8OfDupW3l319pQ1LUYJl+ZZbvM7xOPVRLs/4DX7V9IDOKMeGaGHpy5vbTTXotf8jjwsb1uY8d+BH7WvhXU/ig37N+uaXZ+KND0HxPb2Gg6t4Vle6i/0X7LqcLXtupaS3hjnYQ+arNEzW7q2xa+/KxvCfgfR/AelCy0PSdN0ayXn7PY2qW8f/fKAc1s1/GJ6gU2T5kp1I/3aAPwg/wCDrH9hqTQfiD4f+O2i2kjWOtRJoviFo0+WOdP+PeVz/eZPk+b+4lelf8G8f7eVt8dP2fZPhT4ivlbxV4DTbZLK67tQ0xj8m1f4miYsjf7LJX6oftQ/s6eHf2rPgR4l+H/ii1W70bxNZPaSj+OFiPklQ/wujYZW/vKK/lw+Ovwa+KX/AARq/bnSBbiax1vw3dfa9G1JEP2fWLLLKD/tK67kZP8Ae/2a/ccx4NwXjT4YVfD/ABVRQzLB/vMJN73jsl/6S/Kz6Hm068suxv1pfBL4j0f/AILP/wDBOPVP2FP2hD4w8K2dxbfD/wAVXrXml3FtuVdHut29rVmX7jK25k/2Vb+7X39/wSB/4LV6H+0r4X0v4e/E7VbPR/iNZxJa2t/dyCGDxEFVVVs/dFwyj7v8X8P92vZf2U/2u/hL/wAFif2ZLzRNWsLGa8mtRB4h8NXbK01m+P8AWxHO7y93zK6/+y1+XX/BQ/8A4IL/ABF/Zc1m/wDEnw6t7zx14F3tOgtlZtT0lN3yrLEq/Oq/30/u/Ntr8DyniLhnxUyFeDXjnfLs+y/3MPiZ+7zcukffejvpdXs9Gnc9SpQrYKq8wy336U94n6V/t2f8EP8A4S/tqa1c+IraObwP4zvPnl1PS0Hk3zf3pofus3+2u1v726uV/ag/ZSuP2K/+CBcnw7udYt9bm0HVfmvYYmiSRX1F5V+VtzblV1/75r8wv2Zv+C2H7QH7JlvDob61/wAJNpWn/ul07xHA88kO3+BZd3mLt/us1fpX+1R+1vqf7YH/AAb2P8R9V0mz0e+1zUwJ7W0d2gXytRdMqWbdtbZ/E38Vfc+HfhL4x8AZtgMl4ozWGPyVVIewnz8zUr+6tfeS5b6XaMcRjsvxMXUoU+Sp1Pyi0tk+Vnfd/wCO17z+wb4P/wCFpftWeC9KYMbe3vft8+z5dsUCtKzM3+1sVf8AgS18rQ+K3crtbbX1J/wSPh1bWv2uLW6sNQaxtdP0+a4v8KrNcQ7kVYV/3pGT7v8Adav748Qak8Nw7iq83tB/keRh/jVj9ndQ8Sf7W7/gVef/ABp+MOm/CfwDq3iTVrhbfT9Ht3uJX3bW+VflRf8AaZmVf+BLXhv7Xf8AwUQ8Jfsv6Pc281zHqvihk3WulQMzMzsq7WlfbtRdrK3zV+XXxB/aY+J37UfiNdFvNb1rWv7e1BPsujW3zxyTO+2KJEUfNtZl2/7tfw/wd4f5hns/rEY8tGPxSPTrVo00fS37L3hO8/4K5f8ABSrRmk8Pw6b4dtXTUtYSJN22xtmX/XP/ABNKxRPm/vf7Nf0SWdullaxwxrtjjUKB2AAr48/4I4f8E4Y/+Cf/AOz0v9tRW7eP/Fyx3muzJ+8+z7V/dWqv/EsW5v8AeZnavsnrWfiPxJTzLG08HhJXw+HXJDz7y+b/AAQ8PTcY3fUkooor89NwooooA8c+Nn7Va/CL4u+HfB9v4V1vxHea1YzapcS2DR/8S+0inhgkk2M26Vg0wOxPm2qa4L/gol/wTo+Hv/BTz4I/2Lrxjj1C1V5ND8Q2W2WbTpum5W+66FlXcn8WO3WuV/bA/Yv1Lw/Dc+Jfh9qHjO3m1K4ubHUF0+cXU/hjS9QlEuq3GlW+zzHuJZEVtnmNs3yNEm7alee+B/iXqX7H3g3xhqvw7tfD4+FXwjjt9P8AElssE1unifWP3SXSadEz/wCjyRR+VuVV2z3Mrq3zKzV35XmWKy7F08bgKkoVIaqUSKlOM48k9j8O/wBo79k746f8Ed/2h7W5upNU8O6hbzt/ZHiLTGb7DqKbt20P91tyr80Ui/8Ajtffn7E//Byvouv6fZ6H8btFbR9UjAiPiDSIGe1uNu1d8sO7cjN/sfL977q1+s+p+KPg1+27beKvh3qEnhfx0mlzy2er6Re2/mbWR9rlBIvzqsny+bFuVWUru3Cvzb/bM/4NQ/Dfi28vNW+DHiyTwvNIxdNF1dTcWq/Nu2pMP3ir/vbq/aeKMR4YeL2AhgfE7B+xxkVaGKpaSXq1qvR3RwUPrmAnzYOXNH+U9v1D4d/sk/8ABRK3W8a3+GfjS6vF/wBdbyxQal83+6yzq3+8v8Ncj/wVQ+AHhP8AZb/4Ig634L8GafJpfh3S9XhNvbPcSztH5t6zv87s0n3mb7zV+Wnxf/4IEftW/BDUZinw5vPElrD0vPD99DeLJ/uxb1l/8cr7k8e/AD4naZ/wbSWPg7VPBvjQeOLfVG83R5tNuG1FU/tKVlLRbfM2+WR/D93bXx/CvgHhuAM4wONyniyeYYCVWCjh5z5vZ63U/itolb4VudFTNJYqDjOhyT7n5DWeoww//Xr60/4J5/HXw78C/hf8SvGd9Jbx6xpdvDZ2bhWkl/esyoipuXcrSKn/AHw1eP8Awb/4JLftN/HC/WHRPgv48jVjt+0apYf2VB83fzLpkXb/ALtffX7JH/Bqp458QS2958X/ABpp3h2xk2vLpeh5urpvunDTMNit67Vb/er+svEzijhurlcsHiMbB3avGL5nZO70V9zzcNTq3ukfnD4c0vxt+1l8ZEsNG0/VPFfjDxJdblgtomklmdjt3N/Csa/L8zfKu2v3g/4I6f8ABEDTf2LLW38ffEP7LrnxOukzbRD95a6AjD5li/vyt/E/935R/EzfQfwP/Zj/AGfP+CT/AML1bT4/C/ga1uP3VxrmsXUUd5qLr82Gnk+Zz1bYvC87Vqp8efjdN+0b8CfHGm+A7fVtS1XwVrVidb0W1u1t77XtH3wXLm0lR/mjurNm8p1dfM+dN27dX828a+LEsdhP7GyKn9Xwu396fr2XkehRwvLLnnqzsvHX7enw9+EXx41LwP4s8Q+HfCR0nT7e9lvda1i3sftMk7N5cUMUjCSVQqOzOo2rgD+9t9utrlL23SWGSOSOUb1dTuDA9CK+N/gh+zzp/wAUPEvxP0nwlYeLPBfwn8UaRp8FrFqug3Gm3NjeStdLqdvYw38SyQQPB9l3bU8tZGfZ826vr7w1oFn4S8PWGl2MP2ey0u3S0t4hz5cUahEX/vkCvxc7DSooooAKKKKACvEfjF+xL4R8f3Ora7pOlaXpvjKZHutOvJ4pZbCHU1Vvs97NaK6xTPHIVbcy7vlHNe3UUAfJvwx8IS/8E7f2CPEWpT6NfR634O0u7mjgm1htYjurvA3TQzMiyBLm4xK6situdvlrx5v2yvFX7I+hLpOneN4/i8tv4Z0KK7v9Rn+3QWfiC8v4LNk863XzGjdHmuPK+8iwfL96v0LurWO+t3hmjjmjkXa6uu5W+orzn4l/sq+Cvih4e0/Tp9Nk0UaRq0WvafPos76bPZ30aOiXAaIgOyrI/wArhl+blaf+IDnfHP7Vsnwd+B/hTxR4n0WHUNT8Vanb6TZWfh++WS1mmuDIbd/tF6LZYkdEX/W7drPsG9tu7Q1X9r3wr4c+O/gv4Z6tb6ppfi/xtpMurW1nNEjrZqmdsU0qOyLLJsm2KrNu8iXB+WrXx9+A+rfGL4Nf8Ibb+ItPW1vLc2OpS67oaauuoxMmzc8avCqy7jv3r8u5fu15Cn/BLjS7XUrHXm8aeKL7xxoep6Lc6RrVxe3Hl21rpkSQRWstss3kT70a83O6bt19Ljoq0opAdd+z3/wUL8CftK3fhWHwxHqnmeJrrU7CSK6iSCfTLqxVXeCZN3DOmXXbuVlUmtL4PfF3xV8avjR46ZdW0vQ/Cfw98Qy+HJNK+w+Zfak6WsUrXEs7P+6RmnXYqJ92PcW+bavN/DL/AIJseFfhh8ZPA/jqx1XVIdf8GPqqy/Z1EVtrUN4900SXEWTue3W6kWORfm25B/h2+jeI/wBkL4d+MfiXN4u1Dw6smuXjQSXkiXtxFb3zwf6p7i3SRYZ2TC7WlRmXaKNAPz58AeHPjp+1J8BtOtL3T/GOs3vnXXiHwP42uHtYpknZ5otR0iV1dtlvcWzzJBcSou1pEX5tisfrv4X/APBOnT9JuPD9x4o8Rahrc3hfT00CxNijaQ17pMTI9raaiIJNt00EnmsrqqKfNb5fmYt9I6TpVtoenx2tnbw2trCu2OKJAkaD0AFXKrmARRtFLRRUgFFFFAH/2Q==';
                    doc.addImage(img_data, 'JPEG',15,15,25,25);
                    var encabezado = 'Colegio Científico de Costa Rica\nSede San Carlos';
                    var año = 0;
                    var titulo = 'Informe Provicional de Calificaciones Décimo '+ estudiante[0].anno_ingreso;
                    var infoestudiante = 'Cédula: ' + $scope.ced_estudiante +'\nNombre del Alumno: '+ estudiante[0].segundo_apellido + ' ' + estudiante[0].primer_apellido + ' ' + estudiante[0].name;
                    doc.text(40, 19, encabezado);
                    doc.text(120, 60, titulo);
                    doc.text(15, 90, infoestudiante);
                    doc.setFontSize(10);
                    doc.text(327, 140, 'Ausencias I Semestre              Ausencias II Semestre');
                    doc.autoTable(columns, data, {margins: {right: 10, left: 10, top: 40, bottom: 40}, startY: 150});
                    //doc.save('table2.pdf');
                    if(estudiante[0].anno_ingreso < new Date().getFullYear()) {
                        data = [];
                        angular.forEach($scope.notas_undecimo_1, function (curso) {
                            var notas_cursos = [];

                            for (var i = 0; i < notas.length; i++) {
                                if ((notas[i].curso === curso.curso) && (notas[i].anno === new Date().getFullYear())) {
                                    notas_cursos.push(notas[i]);
                                }
                                if (notas_cursos.length === 2) {
                                    var c = notas_cursos[0].curso;
                                    var s1 = notas_cursos[0].nota;
                                    var s2 = notas_cursos[1].nota;
                                    var p = (notas_cursos[0].nota + notas_cursos[1].nota) / 2;
                                    data.push({'asig': c, 'i': s1, 'ii': s2, 'prom': p, 'm': '', 'iii': '', 't': '', 'm2': '', 'iii2': '', 't2': ''});
                                    break;
                                }
                            }
                        });
                        doc.addPage();
                        doc.setFontSize(16);
                        img_data = 'data:image/jpeg;base64,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';
                        doc.addImage(img_data, 'JPEG',15,15,25,25);
                        encabezado = 'Colegio Científico de Costa Rica\nSede San Carlos';
                        año = 0;
                        titulo = 'Informe Provicional de Calificaciones Undécimo '+ (estudiante[0].anno_ingreso + 1);
                        infoestudiante = 'Cédula: ' + $scope.ced_estudiante +'\nNombre del Alumno: '+ estudiante[0].segundo_apellido + ' ' + estudiante[0].primer_apellido + ' ' + estudiante[0].name;
                        doc.text(40, 19, encabezado);
                        doc.text(120, 60, titulo);
                        doc.text(15, 90, infoestudiante);
                        doc.setFontSize(10);
                        doc.text(327, 140, 'Ausencias I Semestre              Ausencias II Semestre');
                        doc.autoTable(columns, data, {margins: {right: 10, left: 10, top: 40, bottom: 40}, startY: 150});
                        //doc.text("Notas undécimo", 10, 50);
                        //doc.autoTable(columns, data, {margins: {right: 10, left: 10, top: 40, bottom: 40}, startY: 70});
                    }
                    if(save) {
                        doc.save('Reporte de notas ' + estudiante[0].segundo_apellido + ' ' + estudiante[0].primer_apellido + ' ' + estudiante[0].name + '.pdf');
                    }
                    else{
                        $scope.base64 = $sce.trustAsResourceUrl('data:application/pdf;base64,' + btoa(doc.output()));
                    }
                });
            }, function(error) {
                console.log('Failed: ' + error);
            });
        };
	}
]).filter('true_false', function() {
    return function(text, length, end) {
        if (text) {
            return 'Si';
        }
        return 'No';
    };
}).filter('sexo', function() {
    return function(text, length, end) {
        if (text) {
            return 'Masculino';
        }
        return 'Femenino';
    };
}).filter('anno', function() {
    return function(text, length, end) {
        console.log(text);
        if (parseInt(text) === (new Date().getFullYear()-1)) {
            return 'Undécimo';
        }
        return 'Décimo';
    };
});
