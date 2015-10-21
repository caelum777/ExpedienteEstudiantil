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
        $scope.high_schools_list = $http.get('colegios-procedencia.json').then(function(data){
            $scope.high_schools_list = data.data;
            $scope.colegio_procedencia = $scope.high_schools_list[0];
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
                graduado = $scope.graduado;
                var admitido = 0;
                /*if($scope.anno_ingreso < new Date().getFullYear()){
                    admitido = 1;
                }*/

                if ($scope.anno_ingreso>new Date().getFullYear()) {
                    $scope.anno_ingreso_error = true;
                    return;
                }
                admitido = $scope.anno_ingreso;
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
                    colegio_procedencia: $scope.colegio_procedencia.name,
                    adecuacion_sig: $scope.adecuacion_sig,
                    adecuacion_nsig: $scope.adecuacion_nsig,
                    graduado: graduado
                });

                // Redirect after save
                estudiante.$save(function(response) {

                    for(var i = 0; i < $scope.notas_setimo_octavo_noveno.length; i++) {

                        var notaS = new Notas ({
                            cedula_estudiante: $scope.nacionalidad,
                            grado: 'septimo',
                            curso: $scope.notas_setimo_octavo_noveno[i].curso,
                            nota: $scope.notas_setimo_octavo_noveno[i].nota_setimo,
                            anno: estudiante.anno_ingreso-3,
                            semestre: 0
                        });
                        var notaO = new Notas ({
                            cedula_estudiante: $scope.nacionalidad,
                            grado: 'octavo',
                            curso: $scope.notas_setimo_octavo_noveno[i].curso,
                            nota: $scope.notas_setimo_octavo_noveno[i].nota_octavo,
                            anno: estudiante.anno_ingreso-2,
                            semestre: 0
                        });
                        var notaNPT = new Notas ({
                            cedula_estudiante: $scope.nacionalidad,
                            grado: 'noveno',
                            curso: $scope.notas_setimo_octavo_noveno[i].curso,
                            nota: $scope.notas_setimo_octavo_noveno[i].nota_noveno_primer_trimestre,
                            anno: estudiante.anno_ingreso-1,
                            semestre: 1
                        });
                        var notaNST = new Notas ({
                            cedula_estudiante: $scope.nacionalidad,
                            grado: 'noveno',
                            curso: $scope.notas_setimo_octavo_noveno[i].curso,
                            nota: $scope.notas_setimo_octavo_noveno[i].nota_noveno_segundo_trimestre,
                            anno: estudiante.anno_ingreso-1,
                            semestre: 2
                        });
                        notaS.$save(function(response) {
                        }, function(errorResponse) {
                            $scope.error = errorResponse.data.message;
                        });
                        notaO.$save(function(response) {
                        }, function(errorResponse) {
                            $scope.error = errorResponse.data.message;
                        });
                        notaNPT.$save(function(response) {
                        }, function(errorResponse) {
                            $scope.error = errorResponse.data.message;
                        });
                        notaNST.$save(function(response) {
                        }, function(errorResponse) {
                            $scope.error = errorResponse.data.message;
                        });
                    }
                    for(var j = 0; j < $scope.notas_decimo_undecimo.length; j++) {
                        var notaD1 = new Notas ({
                            cedula_estudiante: $scope.nacionalidad,
                            grado: 'decimo',
                            curso: $scope.notas_decimo_undecimo[j].curso,
                            nota: $scope.notas_decimo_undecimo[j].nota_decimo_primer_semestre,
                            anno: estudiante.anno_ingreso,
                            semestre: 1
                        });
                        var notaD2 = new Notas ({
                            cedula_estudiante: $scope.nacionalidad,
                            grado: 'decimo',
                            curso: $scope.notas_decimo_undecimo[j].curso,
                            nota: $scope.notas_decimo_undecimo[j].nota_decimo_segundo_semestre,
                            anno: estudiante.anno_ingreso,
                            semestre: 2
                        });
                        var notaU1 = new Notas ({
                            cedula_estudiante: $scope.nacionalidad,
                            grado: 'undecimo',
                            curso: $scope.notas_decimo_undecimo[j].curso,
                            nota: $scope.notas_decimo_undecimo[j].nota_undecimo_primer_semestre,
                            anno: estudiante.anno_ingreso + 1,
                            semestre: 1
                        });
                        var notaU2 = new Notas ({
                            cedula_estudiante: $scope.nacionalidad,
                            grado: 'undecimo',
                            curso: $scope.notas_decimo_undecimo[j].curso,
                            nota: $scope.notas_decimo_undecimo[j].nota_undecimo_segundo_semestre,
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
            estudiante.colegio_procedencia = $scope.colegio_procedencia.name;
            estudiante.$update(function() {
                $location.path('estudiantes/' + estudiante._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
            var notas = $scope.notas;
            angular.forEach(notas, function (nota) {
                for(var i = 0;i < $scope.notas_setimo_octavo_noveno.length; i++){
                    if((nota.grado === 'septimo')&&($scope.notas_setimo_octavo_noveno[i].curso===nota.curso)){
                        nota.nota = $scope.notas_setimo_octavo_noveno[i].nota_setimo;
                    }
                    else if((nota.grado === 'octavo')&&($scope.notas_setimo_octavo_noveno[i].curso===nota.curso)){
                        nota.nota = $scope.notas_setimo_octavo_noveno[i].nota_octavo;
                    }
                    else if((nota.grado === 'noveno')&&($scope.notas_setimo_octavo_noveno[i].curso===nota.curso)){
                        if(nota.semestre === 1){
                            nota.nota = $scope.notas_setimo_octavo_noveno[i].nota_noveno_primer_trimestre;
                        }
                        else if(nota.semestre === 2){
                            nota.nota = $scope.notas_setimo_octavo_noveno[i].nota_noveno_segundo_trimestre;
                        }
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
            $scope.estudiantes = GetAdmitidos.query({admitido: admitido});
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
            $scope.notas_setimo_octavo_noveno = [];
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
                    $scope.colegio_procedencia = $scope.setColegioProcedenciaComboBox($scope.estudiante.colegio_procedencia);
                }
                $scope.notas = GetNotas.query({
                    cedula_estudiante: estudiante.nacionalidad
                });
                $scope.notas.$promise.then(function(notas) {
                    var temporalNoteRegister = [];
                    angular.forEach(notas, function (nota) {
                        if(nota.grado==='septimo'){
                            temporalNoteRegister.push({materia: nota.curso, grado: nota.grado, calificacion: nota.nota});
                        }
                        else if(nota.grado==='octavo'){
                            temporalNoteRegister.push({materia: nota.curso, grado: nota.grado, calificacion: nota.nota});
                        }
                        else if(nota.grado==='noveno'){
                            temporalNoteRegister.push({materia: nota.curso, grado: nota.grado, calificacion: nota.nota, semestre: nota.semestre});
                        }
                    });
                    var cursos_checked = [];
                    for (var i = 0; i < temporalNoteRegister.length; i++){
                        var curso = temporalNoteRegister[i].materia;
                        var setimo = 0;
                        var octavo = 0;
                        var noveno_primer_trimestre = 0;
                        var noveno_segundo_trimestre = 0;
                        if(cursos_checked.indexOf(curso) === -1){
                            for (var j = 0; j < temporalNoteRegister.length; j++){
                                if (temporalNoteRegister[j].materia === curso){
                                    if(temporalNoteRegister[j].grado === 'septimo'){
                                        setimo = temporalNoteRegister[j].calificacion;
                                    }
                                    else if(temporalNoteRegister[j].grado === 'octavo'){
                                        octavo = temporalNoteRegister[j].calificacion;
                                    }
                                    else if(temporalNoteRegister[j].grado === 'noveno'){
                                        if(temporalNoteRegister[j].semestre === 1){
                                            noveno_primer_trimestre = temporalNoteRegister[j].calificacion;
                                        }
                                        else if (temporalNoteRegister[j].semestre === 2){
                                            noveno_segundo_trimestre = temporalNoteRegister[j].calificacion;
                                        }
                                    }
                                }
                            }
                            cursos_checked.push(curso);
                            $scope.notas_setimo_octavo_noveno.push({curso: curso, nota_setimo: setimo, nota_octavo: octavo, nota_noveno_primer_trimestre: noveno_primer_trimestre, nota_noveno_segundo_trimestre: noveno_segundo_trimestre});
                        }
                    }
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

        $scope.setColegioProcedenciaComboBox = function(colegio){
            for(var i = 0; i < $scope.high_schools_list.length; i++){
                if ($scope.high_schools_list[i].name === colegio){
                    return $scope.high_schools_list[i];
                }
            }
        };

        //Notas de los cursos
        $scope.initNotas = function(){
            var estudiante = $scope.estudiante;
            $scope.editable = true;
            $scope.notas_setimo_octavo_noveno = [
                {curso: 'Inglés', nota_setimo: 0, nota_octavo: 0 , nota_noveno_primer_trimestre: 0, nota_noveno_segundo_trimestre: 0},
                {curso: 'Matemática', nota_setimo: 0, nota_octavo: 0, nota_noveno_primer_trimestre: 0, nota_noveno_segundo_trimestre: 0},
                {curso: 'Ciencias', nota_setimo: 0, nota_octavo: 0, nota_noveno_primer_trimestre: 0, nota_noveno_segundo_trimestre: 0},
                {curso: 'Cívica', nota_setimo: 0, nota_octavo: 0, nota_noveno_primer_trimestre: 0, nota_noveno_segundo_trimestre: 0},
                {curso: 'Español', nota_setimo: 0, nota_octavo: 0, nota_noveno_primer_trimestre: 0, nota_noveno_segundo_trimestre: 0},
                {curso: 'Estudios Sociales', nota_setimo: 0, nota_octavo: 0, nota_noveno_primer_trimestre: 0, nota_noveno_segundo_trimestre: 0},
                {curso: 'Conducta', nota_setimo: 0, nota_octavo: 0, nota_noveno_primer_trimestre: 0, nota_noveno_segundo_trimestre: 0},
                {curso: 'Promedio', nota_setimo: 0, nota_octavo: 0, nota_noveno_primer_trimestre: 0, nota_noveno_segundo_trimestre: 0}];
            $scope.notas_decimo_undecimo = [
                {curso: 'Español', nota_decimo_primer_semestre: 0, nota_decimo_segundo_semestre: 0, nota_undecimo_primer_semestre: 0, nota_undecimo_segundo_semestre: 0},
                {curso: 'Matemáticas', nota_decimo_primer_semestre: 0, nota_decimo_segundo_semestre: 0, nota_undecimo_primer_semestre: 0, nota_undecimo_segundo_semestre: 0},
                {curso: 'Física', nota_decimo_primer_semestre: 0, nota_decimo_segundo_semestre: 0, nota_undecimo_primer_semestre: 0, nota_undecimo_segundo_semestre: 0},
                {curso: 'Química', nota_decimo_primer_semestre: 0, nota_decimo_segundo_semestre: 0, nota_undecimo_primer_semestre: 0, nota_undecimo_segundo_semestre: 0},
                {curso: 'Biología', nota_decimo_primer_semestre: 0, nota_decimo_segundo_semestre: 0, nota_undecimo_primer_semestre: 0, nota_undecimo_segundo_semestre: 0},
                {curso: 'Biotecnología', nota_decimo_primer_semestre: 0, nota_decimo_segundo_semestre: 0, nota_undecimo_primer_semestre: 0, nota_undecimo_segundo_semestre: 0},
                {curso: 'Computación', nota_decimo_primer_semestre: 0, nota_decimo_segundo_semestre: 0, nota_undecimo_primer_semestre: 0, nota_undecimo_segundo_semestre: 0},
                {curso: 'Robótica', nota_decimo_primer_semestre: 0, nota_decimo_segundo_semestre: 0, nota_undecimo_primer_semestre: 0, nota_undecimo_segundo_semestre: 0},
                {curso: 'Dibujo Técnico', nota_decimo_primer_semestre: 0, nota_decimo_segundo_semestre: 0, nota_undecimo_primer_semestre: 0, nota_undecimo_segundo_semestre: 0},
                {curso: 'Inglés', nota_decimo_primer_semestre: 0, nota_decimo_segundo_semestre: 0, nota_undecimo_primer_semestre: 0, nota_undecimo_segundo_semestre: 0},
                {curso: 'Investigación', nota_decimo_primer_semestre: 0, nota_decimo_segundo_semestre: 0, nota_undecimo_primer_semestre: 0, nota_undecimo_segundo_semestre: 0},
                {curso: 'Historia', nota_decimo_primer_semestre: 0, nota_decimo_segundo_semestre: 0, nota_undecimo_primer_semestre: 0, nota_undecimo_segundo_semestre: 0},
                {curso: 'Geografía', nota_decimo_primer_semestre: 0, nota_decimo_segundo_semestre: 0, nota_undecimo_primer_semestre: 0, nota_undecimo_segundo_semestre: 0},
                {curso: 'Educ. Religiosa', nota_decimo_primer_semestre: 0, nota_decimo_segundo_semestre: 0, nota_undecimo_primer_semestre: 0, nota_undecimo_segundo_semestre: 0},
                {curso: 'Educ. Cívica', nota_decimo_primer_semestre: 0, nota_decimo_segundo_semestre: 0, nota_undecimo_primer_semestre: 0, nota_undecimo_segundo_semestre: 0},
                {curso: 'Educ. Física', nota_decimo_primer_semestre: 0, nota_decimo_segundo_semestre: 0, nota_undecimo_primer_semestre: 0, nota_undecimo_segundo_semestre: 0},
                {curso: 'Matemática(PROF.)', nota_decimo_primer_semestre: 0, nota_decimo_segundo_semestre: 0, nota_undecimo_primer_semestre: 0, nota_undecimo_segundo_semestre: 0},
                {curso: 'Física(PROF.)', nota_decimo_primer_semestre: 0, nota_decimo_segundo_semestre: 0, nota_undecimo_primer_semestre: 0, nota_undecimo_segundo_semestre: 0},
                {curso: 'Química(PROF.)', nota_decimo_primer_semestre: 0, nota_decimo_segundo_semestre: 0, nota_undecimo_primer_semestre: 0, nota_undecimo_segundo_semestre: 0},
                {curso: 'Biología(PROF.)', nota_decimo_primer_semestre: 0, nota_decimo_segundo_semestre: 0, nota_undecimo_primer_semestre: 0, nota_undecimo_segundo_semestre: 0},
                {curso: 'Conducta', nota_decimo_primer_semestre: 0, nota_decimo_segundo_semestre: 0, nota_undecimo_primer_semestre: 0, nota_undecimo_segundo_semestre: 0},
                {curso: 'Promedio', nota_decimo_primer_semestre: 0, nota_decimo_segundo_semestre: 0, nota_undecimo_primer_semestre: 0, nota_undecimo_segundo_semestre: 0}];
            $scope.initGridOptions();
        };

        $scope.initGridOptions = function(){
            $scope.gridOptionsSON = $scope.getGridOptionsNotasSON('notas_setimo_octavo_noveno');
            $scope.gridOptionsDU = $scope.getGridOptionsNotasDU('notas_decimo_undecimo');
        };

        $scope.getGridOptionsNotasSON = function(data){
            var editCellTemplate = '<input type="number" ng-class="\'colt\' + col.index"  min="1" max="100" ng-input="COL_FIELD" ng-model="COL_FIELD" >';
            var width = 125;
            return {
                data: data,
                enableCellSelection: true,
                enableRowSelection: false,
                enableCellEditOnFocus: $scope.editable,
                columnDefs: [{field: 'curso', displayName: 'Asignatura', enableCellEdit: false},
                    {field: 'nota_setimo', displayName: 'Notas de sétimo', enableCellEdit: $scope.editable,
                        editableCellTemplate: editCellTemplate,
                        cellClass: 'grid-align',
                        width: width,
                        cellTemplate:'<div class="ngCellText" ng-class="{\'red\' : row.getProperty(\'nota_setimo\') < 70 && row.getProperty(\'nota_setimo\') != 0, \'yellow\' : row.getProperty(\'nota_setimo\') >= 70 && row.getProperty(\'nota_setimo\') < 85  && row.getProperty(\'nota_setimo\') != 0, \'green\' : row.getProperty(\'nota_setimo\') >=85 && row.getProperty(\'nota_setimo\') != 0  }">{{ row.getProperty(col.field) }}</div>'},
                    {field:'nota_octavo', displayName:'Notas de octavo', enableCellEdit: $scope.editable,
                        editableCellTemplate: editCellTemplate,
                        cellClass: 'grid-align',
                        width: width,
                        cellTemplate:'<div class="ngCellText" ng-class="{\'red\' : row.getProperty(\'nota_octavo\') < 70 && row.getProperty(\'nota_octavo\') != 0, \'yellow\' : row.getProperty(\'nota_octavo\') >= 70 && row.getProperty(\'nota_octavo\') < 85  && row.getProperty(\'nota_octavo\') != 0, \'green\' : row.getProperty(\'nota_octavo\') >=85 && row.getProperty(\'nota_octavo\') != 0  }">{{ row.getProperty(col.field) }}</div>'},
                    {field:'nota_noveno_primer_trimestre', displayName:'I Trimestre', enableCellEdit: $scope.editable,
                        editableCellTemplate: editCellTemplate,
                        cellClass: 'grid-align',
                        width: width,
                        cellTemplate:'<div class="ngCellText" ng-class="{\'red\' : row.getProperty(\'nota_noveno_primer_trimestre\') < 70 && row.getProperty(\'nota_noveno_primer_trimestre\') != 0, \'yellow\' : row.getProperty(\'nota_noveno_primer_trimestre\') >= 70 && row.getProperty(\'nota_noveno_primer_trimestre\') < 85  && row.getProperty(\'nota_noveno_primer_trimestre\') != 0, \'green\' : row.getProperty(\'nota_noveno_primer_trimestre\') >=85 && row.getProperty(\'nota_noveno_primer_trimestre\') != 0  }">{{ row.getProperty(col.field) }}</div>'},
                    {field:'nota_noveno_segundo_trimestre', displayName:'II Trimestre', enableCellEdit: $scope.editable,
                        editableCellTemplate: editCellTemplate,
                        cellClass: 'grid-align',
                        width: width,
                        cellTemplate:'<div class="ngCellText" ng-class="{\'red\' : row.getProperty(\'nota_noveno_segundo_trimestre\') < 70 && row.getProperty(\'nota_noveno_segundo_trimestre\') != 0, \'yellow\' : row.getProperty(\'nota_noveno_segundo_trimestre\') >= 70 && row.getProperty(\'nota_noveno_segundo_trimestre\') < 85  && row.getProperty(\'nota_noveno_segundo_trimestre\') != 0, \'green\' : row.getProperty(\'nota_noveno_segundo_trimestre\') >=85 && row.getProperty(\'nota_noveno_segundo_trimestre\') != 0  }">{{ row.getProperty(col.field) }}</div>'}]
            };
        };

        $scope.getGridOptionsNotasDU = function(data){
            var width = 120;
            return {
                data: data,
                enableCellSelection: true,
                enableRowSelection: false,
                enableCellEditOnFocus: $scope.editable,
                columnDefs: [{field: 'curso', displayName: 'Asignatura', enableCellEdit: false},
                    {field:'nota_decimo_primer_semestre', displayName:'I', enableCellEdit: $scope.editable,
                        width: width,
                        cellClass: 'grid-align',
                        editableCellTemplate:'<input type="number" ng-class="\'colt\' + col.index"  min="1" max="100" ng-input="COL_FIELD" ng-model="COL_FIELD" >',
                        cellTemplate:'<div class="ngCellText" ng-class="{\'red\' : row.getProperty(\'nota_decimo_primer_semestre\') <70 && row.getProperty(\'nota_decimo_primer_semestre\') != 0,   \'green\' : row.getProperty(\'nota_decimo_primer_semestre\') >=70 && row.getProperty(\'nota_decimo_primer_semestre\') != 0  }">{{ row.getProperty(col.field) }}</div>'},
                    {field:'nota_decimo_segundo_semestre', displayName:'II', enableCellEdit: $scope.editable,
                        width: width,
                        cellClass: 'grid-align',
                        editableCellTemplate:'<input type="number" ng-class="\'colt\' + col.index"  min="1" max="100" ng-input="COL_FIELD" ng-model="COL_FIELD" >',
                        cellTemplate:'<div class="ngCellText" ng-class="{\'red\' : row.getProperty(\'nota_decimo_segundo_semestre\') <70 && row.getProperty(\'nota_decimo_segundo_semestre\') != 0,   \'green\' : row.getProperty(\'nota_decimo_segundo_semestre\') >=70 && row.getProperty(\'nota_decimo_segundo_semestre\') != 0  }">{{ row.getProperty(col.field) }}</div>'},
                    {field:'nota_undecimo_primer_semestre', displayName:'I', enableCellEdit: $scope.editable,
                        width: width,
                        cellClass: 'grid-align',
                        editableCellTemplate:'<input type="number" ng-class="\'colt\' + col.index"  min="1" max="100" ng-input="COL_FIELD" ng-model="COL_FIELD" >',
                        cellTemplate:'<div class="ngCellText" ng-class="{\'red\' : row.getProperty(\'nota_undecimo_primer_semestre\') <70 && row.getProperty(\'nota_undecimo_primer_semestre\') != 0,   \'green\' : row.getProperty(\'nota_undecimo_primer_semestre\') >=70 && row.getProperty(\'nota_undecimo_primer_semestre\') != 0  }">{{ row.getProperty(col.field) }}</div>'},
                    {field:'nota_undecimo_segundo_semestre', displayName:'II', enableCellEdit: $scope.editable,
                        width: width,
                        cellClass: 'grid-align',
                        editableCellTemplate:'<input type="number" ng-class="\'colt\' + col.index"  min="1" max="100" ng-input="COL_FIELD" ng-model="COL_FIELD" >',
                        cellTemplate:'<div class="ngCellText" ng-class="{\'red\' : row.getProperty(\'nota_undecimo_segundo_semestre\') <70 && row.getProperty(\'nota_undecimo_segundo_semestre\') != 0,   \'green\' : row.getProperty(\'nota_undecimo_segundo_semestre\') >=70 && row.getProperty(\'nota_undecimo_segundo_semestre\') != 0  }">{{ row.getProperty(col.field) }}</div>'}]
            };
        };

        $scope.notes_c_c = function(){
            $scope.notas_decimo_undecimo = [];
            $scope.editable = true;
            var estudiante = Estudiantes.get({
                estudianteId: $stateParams.estudianteId
            });
            estudiante.$promise.then(function(estudiante) {
                $scope.notas = GetNotas.query({
                    cedula_estudiante: estudiante.nacionalidad
                });
                $scope.notas.$promise.then(function (notas) {
                    var temporalNoteRegister = [];
                    angular.forEach(notas, function (nota) {
                        if ((nota.grado === 'decimo') && (nota.semestre === 1)) {
                            temporalNoteRegister.push({materia: nota.curso, grado: nota.grado, calificacion: nota.nota, semestre: nota.semestre});
                        }
                        else if ((nota.grado === 'decimo') && (nota.semestre === 2)) {
                            temporalNoteRegister.push({materia: nota.curso, grado: nota.grado, calificacion: nota.nota, semestre: nota.semestre});
                        }
                        else if ((nota.grado === 'undecimo') && (nota.semestre === 1)) {
                            temporalNoteRegister.push({materia: nota.curso, grado: nota.grado, calificacion: nota.nota, semestre: nota.semestre});
                        }
                        else if ((nota.grado === 'undecimo') && (nota.semestre === 2)) {
                            temporalNoteRegister.push({materia: nota.curso, grado: nota.grado, calificacion: nota.nota, semestre: nota.semestre});
                        }
                    });
                    var cursos_checked = [];
                    var promedio_decimo = 0;
                    var promedio_undecimo = 0;
                    for (var i = 0; i < temporalNoteRegister.length; i++){
                        var curso = temporalNoteRegister[i].materia;
                        var decimo_primer_semestre = 0;
                        var decimo_segundo_semestre = 0;
                        var undecimo_primer_semestre = 0;
                        var undecimo_segundo_semestre = 0;
                        if(cursos_checked.indexOf(curso) === -1){
                            for (var j = 0; j < temporalNoteRegister.length; j++){
                                if (temporalNoteRegister[j].materia === curso){
                                    if(temporalNoteRegister[j].grado === 'decimo' && temporalNoteRegister[j].semestre === 1){
                                        decimo_primer_semestre = temporalNoteRegister[j].calificacion;
                                    }
                                    else if(temporalNoteRegister[j].grado === 'decimo' && temporalNoteRegister[j].semestre === 2){
                                        decimo_segundo_semestre = temporalNoteRegister[j].calificacion;
                                    }
                                    else if(temporalNoteRegister[j].grado === 'undecimo' && temporalNoteRegister[j].semestre === 1){
                                        undecimo_primer_semestre = temporalNoteRegister[j].calificacion;
                                    }
                                    else if(temporalNoteRegister[j].grado === 'undecimo' && temporalNoteRegister[j].semestre === 2){
                                        undecimo_segundo_semestre = temporalNoteRegister[j].calificacion;
                                    }
                                    if (curso === 'Promedio'){
                                        if (temporalNoteRegister[j].grado === 'decimo'){
                                            promedio_decimo += temporalNoteRegister[j].calificacion;
                                        }
                                        else{
                                            promedio_undecimo += temporalNoteRegister[j].calificacion;
                                        }
                                    }
                                }
                            }
                            cursos_checked.push(curso);
                            $scope.notas_decimo_undecimo.push({curso: curso, nota_decimo_primer_semestre: decimo_primer_semestre, nota_decimo_segundo_semestre: decimo_segundo_semestre,
                                                                    nota_undecimo_primer_semestre: undecimo_primer_semestre, nota_undecimo_segundo_semestre: undecimo_segundo_semestre});
                        }
                    }
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

        $scope.calcularPromedio = function(){
            var promedio_decimo_primer_semestre = 0;
            var promedio_decimo_segundo_semestre = 0;
            var promedio_undecimo_primer_semestre = 0;
            var promedio_undecimo_segundo_semestre = 0;
            var promedio_row = 0;
            if($scope.notas_decimo_undecimo.length !== 0) {
                angular.forEach($scope.notas_decimo_undecimo, function (nota) {
                    if (nota.curso !== 'Promedio') {
                        if(nota.nota_decimo_primer_semestre === undefined){
                            nota.nota_decimo_primer_semestre = 0;
                        }
                        if(nota.nota_decimo_segundo_semestre === undefined){
                            nota.nota_decimo_segundo_semestre = 0;
                        }
                        if(nota.nota_undecimo_primer_semestre === undefined){
                            nota.nota_undecimo_primer_semestre = 0;
                        }
                        if(nota.nota_undecimo_segundo_semestre === undefined){
                            nota.nota_undecimo_segundo_semestre = 0;
                        }
                        promedio_decimo_primer_semestre += nota.nota_decimo_primer_semestre;
                        promedio_decimo_segundo_semestre += nota.nota_decimo_segundo_semestre;
                        promedio_undecimo_primer_semestre += nota.nota_undecimo_primer_semestre;
                        promedio_undecimo_segundo_semestre += nota.nota_undecimo_segundo_semestre;
                    }
                    else if (nota.curso === 'Promedio') {
                        promedio_row = nota;
                    }
                });
                promedio_decimo_primer_semestre = Math.round(promedio_decimo_primer_semestre / ($scope.notas_decimo_undecimo.length - 1) * 100) / 100;
                promedio_decimo_segundo_semestre = Math.round(promedio_decimo_segundo_semestre / ($scope.notas_decimo_undecimo.length - 1) * 100) / 100;
                promedio_undecimo_primer_semestre = Math.round(promedio_undecimo_primer_semestre / ($scope.notas_decimo_undecimo.length - 1) * 100) / 100;
                promedio_undecimo_segundo_semestre = Math.round(promedio_undecimo_segundo_semestre / ($scope.notas_decimo_undecimo.length - 1) * 100) / 100;
                promedio_row.nota_decimo_primer_semestre = promedio_decimo_primer_semestre;
                promedio_row.nota_decimo_segundo_semestre = promedio_decimo_segundo_semestre;
                promedio_row.nota_undecimo_primer_semestre = promedio_undecimo_primer_semestre;
                promedio_row.nota_undecimo_segundo_semestre = promedio_undecimo_segundo_semestre;
                $scope.tenth_annual_average = Math.round((promedio_decimo_primer_semestre + promedio_decimo_segundo_semestre) / 2 * 100) / 100;
                $scope.eleventh_annual_average = Math.round((promedio_undecimo_primer_semestre + promedio_undecimo_segundo_semestre) / 2 * 100) / 100;
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
                for(var i = 0;i < $scope.notas_decimo_undecimo.length; i++){
                    if((nota.grado === 'decimo')&&($scope.notas_decimo_undecimo[i].curso === nota.curso)&&(nota.semestre === 1)){
                        nota.nota = $scope.notas_decimo_undecimo[i].nota_decimo_primer_semestre;
                    }
                    else if((nota.grado === 'decimo')&&($scope.notas_decimo_undecimo[i].curso===nota.curso)&&(nota.semestre === 2)){
                        nota.nota = $scope.notas_decimo_undecimo[i].nota_decimo_segundo_semestre;
                    }
                    else if((nota.grado === 'undecimo')&&($scope.notas_decimo_undecimo[i].curso === nota.curso)&&(nota.semestre === 1)){
                        nota.nota = $scope.notas_decimo_undecimo[i].nota_undecimo_primer_semestre;
                    }
                    else if((nota.grado === 'undecimo')&&($scope.notas_decimo_undecimo[i].curso===nota.curso)&&(nota.semestre === 2)){
                        nota.nota = $scope.notas_decimo_undecimo[i].nota_undecimo_segundo_semestre;
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
                if (pdfReport !== undefined){
                    if (pdfReport.Data.length > 0){
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
            doc.text(40, 19, PDFReport.Header);
            doc.text(15, 80, PDFReport.Title);
            doc.autoTable(PDFReport.Columns, PDFReport.Data, {margins: {right: 10, left: 10, top: 100, bottom: 100}, startY: PDFReport.StartY});
            $scope.base64 = $sce.trustAsResourceUrl('data:application/pdf;base64,' + btoa(doc.output()));
        };
        $scope.reporte_notas = function(){
            if($scope.ced_estudiante !== undefined && $scope.ced_estudiante !== ''){
                var serviceReport = Reports;
                serviceReport.studentNotes = GetNotas.query({ cedula_estudiante: $scope.ced_estudiante });
                serviceReport.studentNotes.$promise.then(function(notes){
                    var pdfReport;
                    $scope.estudiante =  Nacionalidad.query( {cedula: $scope.ced_estudiante });
                    $scope.estudiante.$promise.then(function(student){
                        if (student[0] !== undefined){
                            fixInvalidCharactersfixInvalidCharacters(notes);
                            pdfReport = serviceReport.notesReport(notes, student);
                            var doc = new jsPDF('p', 'pt');
                            doc.setFontSize(16);
                            var logo_img = document.getElementById('cc-logo');
                            var img_data = getBase64Image(logo_img);
                            doc.addImage(img_data, 'JPEG',15,15,25,25);
                            var infoestudiante = 'Cedula: ' + student[0].nacionalidad +'\nNombre del Alumno: '+ student[0].segundo_apellido + ' ' + student[0].primer_apellido + ' ' + student[0].name;
                            doc.text(40, 19, pdfReport.Header);
                            doc.text(120, 60, pdfReport.Title + ' Decimo ' + student[0].anno_ingreso);
                            doc.text(15, 90, infoestudiante);
                            doc.setFontSize(10);
                            doc.text(327, 140, 'Ausencias I Semestre              Ausencias II Semestre');
                            doc.autoTable(pdfReport.Columns, pdfReport.Data[0], {margins: {right: 10, left: 10, top: 40, bottom: 40}, startY: 150});
                            if (student[0].anno_ingreso < new Date().getFullYear()){
                                doc.addPage();
                                doc.setFontSize(16);
                                doc.addImage(img_data, 'JPEG',15,15,25,25);
                                infoestudiante = 'Cédula: ' + $scope.ced_estudiante +'\nNombre del Alumno: '+ student[0].segundo_apellido + ' ' + student[0].primer_apellido + ' ' + student[0].name;
                                doc.text(40, 19, pdfReport.Header);
                                doc.text(120, 60, pdfReport.Title + ' Undecimo ' + (student[0].anno_ingreso+1));
                                doc.text(15, 90, infoestudiante);
                                doc.setFontSize(10);
                                doc.text(327, 140, 'Ausencias I Semestre              Ausencias II Semestre');
                                doc.autoTable(pdfReport.Columns, pdfReport.Data[1], {margins: {right: 10, left: 10, top: 40, bottom: 40}, startY: 150});
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
    var ret = '';
    for(var j = 0; j < noteList.length; j++){
        ret = '';
        for (var i = 0; i < noteList[j].curso.length; i++) {
            ret += accentMap[noteList[j].curso.charAt(i)] || noteList[j].curso.charAt(i);
        }
        noteList[j].curso = ret;
    }
    return ret;
}

function getBase64Image(img) {
    var canvas = document.createElement('canvas');
    if (img !== null) {
        console.log(img);
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
    }
    var dataURL = canvas.toDataURL('image/jpeg');
    return dataURL;
}
