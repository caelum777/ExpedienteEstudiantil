'use strict';

// Estudiantes controller
angular.module('estudiantes').controller('EstudiantesController', ['$scope', '$stateParams', '$location', '$filter', '$http', '$sce', 'Authentication', 'Estudiantes', '$upload', 'Notas', 'GetNotas', 'GetAdmitidos', 'Decimo', 'Undecimo', 'Nacionalidad', 'Reports',
	function($scope, $stateParams, $location, $filter, $http, $sce, Authentication, Estudiantes, $upload, Notas, GetNotas, GetAdmitidos, Decimo, Undecimo, Nacionalidad, Reports) {
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
        $scope.anno_ingreso = 0;



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

        $scope.$watch('anno_ingreso',function() {
            if ($scope.anno_ingreso > new Date().getFullYear()) {

                $scope.anno_ingreso_error_mayor_actual = true;
            } else {
                $scope.anno_ingreso_error_mayor_actual = false;
            }

        });



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
                //var graduado
                var graduado = 0;
                /*if($scope.anno_ingreso < new Date().getFullYear()-1){
                    gr = 1;
                }*/
                graduado = $scope.graduado
                var admitido = 0;
                /*if($scope.anno_ingreso < new Date().getFullYear()){
                    admitido = 1;
                }*/

                if ($scope.anno_ingreso>new Date().getFullYear()) {

                    $scope.anno_ingreso_error = true

                    return
                }
                admitido = $scope.anno_ingreso
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
                    admitido: admitido,
                    foto: $scope.foto,
                    anno_ingreso: $scope.anno_ingreso,
                    colegio_procedencia: $scope.colegio_procedencia,
                    adecuacion_sig: $scope.adecuacion_sig,
                    adecuacion_nsig: $scope.adecuacion_nsig,
                    graduado: graduado
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
                { field: 'graduado', displayName:'Graduado',cellTemplate: '<div class="ngCellText">{{row.getProperty(col.field) | true_false}}</div>'},
                { field: 'colegio_procedencia', displayName:'Colegio de Procedencia'},
                { field: 'anno_ingreso', displayName:'Año de ingreso'},
                { field: 'sexo', displayName:'Sexo',cellTemplate: '<div class="ngCellText">{{row.getProperty(col.field) | sexo}}</div>'},
                { field: 'traladado', displayName:'Trasladado',cellTemplate: '<div class="ngCellText">{{row.getProperty(col.field) | true_false}}</div>'},
                { field: 'graduado', displayName:'Graduado',cellTemplate: '<div class="ngCellText">{{row.getProperty(col.field) | true_false}}</div>'},
                { field: '_id', displayName:'Ver', cellTemplate: '<a data-ng-href="#!/estudiantes/{{row.entity._id}}">ver</a>'}],
            filterOptions: $scope.filterOptions
        };

        $scope.filterOptions.filterText = '';
        $scope.$watchCollection('[filteringText, consulta_sexo, consulta_grado, consulta_estado]', function(values) {
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
        $scope.lista_reportes = Reports.getReportsList();
        $scope.grade_reports_list = Reports.getGradesList();
        $scope.reporte = $scope.lista_reportes[0];
        $scope.grade_report = $scope.grade_reports_list[0];
        $scope.ced_estudiante = '';
        $scope.visibl = false;

        $scope.$watch('ced_estudiante', function(ced_estudiante){
                $scope.show = true;
                $scope.reporte_notas();
        });
        $scope.$watch('reporte', function(){
            createReport();
        });
        $scope.$watch('grade_report', function(){
            createReport();
        });

        function createReport(){
            var reporte = $scope.reporte;
            var grade = $scope.grade_report;
            var serviceReport = Reports;
            $scope.visibl = false;
            $scope.show = true;
            $scope.grade_visible = true;
            if(grade.grade_val  === 1){
                serviceReport.studentsList = Decimo.query();
            }
            else if(grade.grade_val === 2){
                serviceReport.studentsList = Undecimo.query();
            }
            serviceReport.studentsList.$promise.then(function (students){
                var pdfReport;
                if (reporte.val === 1){
                    pdfReport = serviceReport.attendanceListReport(students, grade.grade_opt.toUpperCase());
                }
                else if (reporte.val === 2){
                    pdfReport = serviceReport.personalInfoListReport(students);
                }
                else if (reporte.val === 3){
                    pdfReport = serviceReport.scienceForBachelorListReport(students, grade.grade_opt.toUpperCase());
                }
                else if (reporte.val === 4){
                    pdfReport = serviceReport.emailListReport(students, grade.grade_opt.toUpperCase());
                }
                else if (reporte.val === 5){
                    pdfReport = serviceReport.scienceForBachelorChoiceListReport(students);
                }
                else if (reporte.val === 6){
                    pdfReport = serviceReport.StudentsForLibraryListReport(students, grade.grade_opt.toUpperCase());
                }
                else if (reporte.val === 7){
                    pdfReport = serviceReport.OlympicsParticipationListReport(students, grade.grade_opt.toUpperCase());
                }
                else if (reporte.val === 8){
                    $scope.grade_visible = false;
                    $scope.visibl = true;
                    $scope.show = false;
                }
                if (pdfReport != null){
                    if (pdfReport['Data'].length > 0){
                        $scope.generatePDF(pdfReport);
                    }
                }
            });
        }

        $scope.show = false;
        $scope.base64 = $sce.trustAsResourceUrl('');
        $scope.nombre_reporte_notas_undecimo = '';
        $scope.nombre_reporte_notas_decimo = '';

        $scope.generatePDF = function(PDFReport) {
            var doc = new jsPDF('p', 'pt');
            var logo_img = document.getElementById('cc-logo');
            var img_data = getBase64Image(logo_img);
            doc.addImage(img_data, 'JPEG',15,15,25,25);
            doc.text(40, 19, PDFReport['Header']);
            doc.text(15, 80, PDFReport['Title']);
            doc.autoTable(PDFReport['Columns'], PDFReport['Data'], {margins: {right: 10, left: 10, top: 100, bottom: 100}, startY: PDFReport['StartY']});
            $scope.base64 = $sce.trustAsResourceUrl('data:application/pdf;base64,' + btoa(doc.output()));
        };
        $scope.reporte_notas = function(){
            if($scope.ced_estudiante != undefined && $scope.ced_estudiante != ''){
                var serviceReport = Reports;
                serviceReport.studentNotes = GetNotas.query({ cedula_estudiante: $scope.ced_estudiante });
                serviceReport.studentNotes.$promise.then(function(notes){
                    var pdfReport;
                    console.log($scope.ced_estudiante);
                    $scope.estudiante =  Nacionalidad.query( {cedula: $scope.ced_estudiante });
                    $scope.estudiante.$promise.then(function(student){
                        if (student[0] != undefined){
                            fixInvalidCharactersfixInvalidCharacters(notes);
                            pdfReport = serviceReport.notesReport(notes, student);
                            var doc = new jsPDF('p', 'pt');
                            doc.setFontSize(16);
                            var logo_img = document.getElementById('cc-logo');
                            var img_data = getBase64Image(logo_img);
                            doc.addImage(img_data, 'JPEG',15,15,25,25);
                            var infoestudiante = 'Cedula: ' + student[0].nacionalidad +'\nNombre del Alumno: '+ student[0].segundo_apellido + ' ' + student[0].primer_apellido + ' ' + student[0].name;
                            doc.text(40, 19, pdfReport['Header']);
                            doc.text(120, 60, pdfReport['Title'] + ' Decimo ' + student[0].anno_ingreso);
                            doc.text(15, 90, infoestudiante);
                            doc.setFontSize(10);
                            doc.text(327, 140, 'Ausencias I Semestre              Ausencias II Semestre');
                            doc.autoTable(pdfReport['Columns'], pdfReport['Data'][0], {margins: {right: 10, left: 10, top: 40, bottom: 40}, startY: 150});
                            if (student[0].anno_ingreso < new Date().getFullYear()){
                                doc.addPage();
                                doc.setFontSize(16);
                                doc.addImage(img_data, 'JPEG',15,15,25,25);
                                infoestudiante = 'Cédula: ' + $scope.ced_estudiante +'\nNombre del Alumno: '+ student[0].segundo_apellido + ' ' + student[0].primer_apellido + ' ' + student[0].name;
                                doc.text(40, 19, pdfReport['Header']);
                                doc.text(120, 60, pdfReport['Title'] + ' Undecimo ' + (student[0].anno_ingreso+1));
                                doc.text(15, 90, infoestudiante);
                                doc.setFontSize(10);
                                doc.text(327, 140, 'Ausencias I Semestre              Ausencias II Semestre');
                                doc.autoTable(pdfReport['Columns'], pdfReport['Data'][1], {margins: {right: 10, left: 10, top: 40, bottom: 40}, startY: 150});
                            }
                            $scope.base64 = $sce.trustAsResourceUrl('data:application/pdf;base64,' + btoa(doc.output()));
                        }
                    });
                });
            }
        }
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
        if (parseInt(text) === (new Date().getFullYear()-1)) {
            return 'Undécimo';
        }
        return 'Décimo';
    };
});

function fixInvalidCharactersfixInvalidCharacters(noteList){
    var accentMap = { 'á':'a', 'é':'e', 'í':'i','ó':'o','ú':'u', 'ñ': 'n'};
    for(var j = 0; j < noteList.length; j++){
        var ret = '';
        for (var i = 0; i < noteList[j].curso.length; i++) {
            ret += accentMap[noteList[j].curso.charAt(i)] || noteList[j].curso.charAt(i);
        }
        noteList[j].curso = ret;
    }
        return ret;
}

function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    if (img != undefined) {
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
    }
    var dataURL = canvas.toDataURL("image/jpeg");
    return dataURL;
}
