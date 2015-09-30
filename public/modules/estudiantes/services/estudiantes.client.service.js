'use strict';

//Estudiantes service used to communicate Estudiantes REST endpoints
angular.module('estudiantes').factory('Estudiantes', ['$resource',
	function($resource) {
		return $resource('estudiantes/:estudianteId', { estudianteId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

//Estudiantes service used to communicate Estudiantes REST endpoints
angular.module('estudiantes').factory('GetAdmitidos', ['$resource',
    function($resource) {
        return $resource('/admitidos/:admitido', { admitido: '@admitido'
        }, {
            update: {
                method: 'GET'
            }
        });
    }
]);

//Notas service used to communicate Notas REST endpoints
angular.module('estudiantes').factory('Notas', ['$resource',
    function($resource) {
        return $resource('/notas/:notaId', null,
        {
            update: {
                method: 'PUT'
            },
            detele: {//ERROR
                method: 'DELETE'
            }
        });
    }
]);

angular.module('estudiantes').factory('GetNotas', ['$resource',
    function($resource) {
        return $resource('/notas/:cedula_estudiante', { cedula_estudiante: '@cedula_estudiante'
            }, {
                update: {
                    method: 'GET'
                }
            });
    }
]);

angular.module('estudiantes').factory('Decimo', ['$resource',
    function($resource) {
        return $resource('/estudiantes_decimo/', null,
        {
            update: {
                method: 'GET'
            }
        });
    }
]);

angular.module('estudiantes').factory('Undecimo', ['$resource',
    function($resource) {
        return $resource('/estudiantes_undecimo/', null,
        {
            update: {
                method: 'GET'
            }
        });
    }
]);

//Estudiantes service used to communicate Estudiantes REST endpoints
angular.module('estudiantes').factory('Nacionalidad', ['$resource',
    function($resource) {
        return $resource('/nacionalidad/:cedula', { cedula: '@cedula'
        }, {
            update: {
                method: 'GET'
            }
        });
    }
]);


angular.module('estudiantes').factory('Reports', function(){
        var HEADER = "";
        var TITLE = "";
        var columns = [];
        var data = [];

        var report = {
            attendanceListReport: function(estudiantes, grade_label) {
               data = [];
               TITLE = '                   CONTROL DE AUSENCIAS ' + grade_label + ' ' + new Date().getFullYear() +'\n' +
                   'Profesor: __________________                         Mes:________________ \n' +
                   'Asignatura: ________________                         A = Ausencia, T = Tardia';
               columns = [
                   {title: 'Cedula', key: 'ced'},
                   {title: 'Nombre', key: 'nom'},
                   {title: 'Del__ al __', key: 'i'},
                   {title: 'Del__ al __', key: 'ii'},
                   {title: 'Del__ al __', key: 'iii'},
                   {title: 'Del__ al __', key: 'iiii'}
               ];
               var women = 0;
               var men = 0;
               angular.forEach(estudiantes, function (estudiante_decimo) {

                   if ((estudiante_decimo.admitido) && (!estudiante_decimo.traladado)) {
                       if(estudiante_decimo.sexo === true){
                           men++;
                       }
                       else{
                           women += 1;
                       }
                       data.push({'ced': estudiante_decimo.nacionalidad, 'nom': estudiante_decimo.segundo_apellido + ' ' + estudiante_decimo.primer_apellido + ' ' + estudiante_decimo.name, 'i': '', 'ii': '', 'iii': '', 'iiii': ''});
                   }
               });
               var total = women + men;
               HEADER = this.initHeader(women, men, total);
               var result = this.getJSONFromData('Lista de asistencia decimo', HEADER, TITLE, columns, data, 130, false);
               return result;

           },

            personalInfoListReport: function(estudiantes){
                data = [];
                TITLE = [];
                HEADER = 'Colegio Cientifico de Costa Rica\n' +
                'Instituto Tecnologico de Costa Rica, Sede Regional San Carlos\n' +
                'Telefax: 2475-7089,Tel: 2401-3122\n';
                columns = [
                    {title: 'Cedula', key: 'ced'},
                    {title: 'I Apellido', key: 'i'},
                    {title: 'II Apellido', key: 'ii'},
                    {title: 'Nombre', key: 'nom'},
                    {title: 'Telefono', key: 'tel'},
                    {title: 'E-mail', key: 'mail'}
                ];
                angular.forEach(estudiantes, function (estudiante_decimo) {
                    if ((estudiante_decimo.admitido) && (!estudiante_decimo.traladado)) {
                        data.push({'ced': estudiante_decimo.nacionalidad, 'i': estudiante_decimo.primer_apellido, 'ii': estudiante_decimo.segundo_apellido, 'nom':estudiante_decimo.name, 'tel': estudiante_decimo.celular, 'mail': estudiante_decimo.correo});
                    }
                });
                var result = this.getJSONFromData('Lista cedula carne y apellidos decimo', HEADER, TITLE, columns, data, 70, false);
                return result;
            },

            scienceForBachelorListReport: function (estudiantes) {
                data = [];
                TITLE = '      LISTA CIENCIA PARA BACHILLERATO DECIMO ' + new Date().getFullYear() +'\n';
                columns = [
                    {title: 'Cedula', key: 'ced'},
                    {title: 'Nombre', key: 'nom'},
                    {title: 'Ciencia', key: 'cie'},
                    {title: 'Firma', key: 'fir'}
                ];
                var women = 0;
                var men = 0;
                angular.forEach(estudiantes, function (estudiante_decimo) {
                    if ((estudiante_decimo.admitido) && (!estudiante_decimo.traladado)) {
                        if(estudiante_decimo.sexo === true){
                            men++;
                        }
                        else{
                            women += 1;
                        }
                        data.push({'ced':estudiante_decimo.nacionalidad,'nom': estudiante_decimo.segundo_apellido + ' ' + estudiante_decimo.primer_apellido + ' ' + estudiante_decimo.name, 'cie': '','fir': ''});
                    }
                });
                var total = women + men;
                HEADER = this.initHeader(women, men, total);
                var result = this.getJSONFromData('Lista ciencia para bachillerato decimo', HEADER, TITLE, columns, data, 95, false);
                return result;
            },

            emailListReport: function(estudiantes) {
                data = [];
                'Colegio Cientifico de Costa Rica\n' +
                'Instituto Tecnologico de Costa Rica, Sede Regional San Carlos\n' +
                'Telefax: 2475-7089,Tel: 2401-3122\n';
                TITLE = '';
                columns = [
                    {title: 'Cedula', key: 'ced'},
                    {title: 'Nombre', key: 'nom'},
                    {title: 'E-mail', key: 'mail'}
                ];
                angular.forEach(estudiantes, function (estudiante_decimo) {
                    if ((estudiante_decimo.admitido) && (!estudiante_decimo.traladado)){
                        data.push({'ced':estudiante_decimo.nacionalidad, 'nom':estudiante_decimo.segundo_apellido + estudiante_decimo.primer_apellido + estudiante_decimo.name, 'mail': estudiante_decimo.correo});
                    }
                });
                var result = this.getJSONFromData('Lista correos decimo', HEADER, TITLE, columns, data, 70, false);
                return result;
            },

            scienceForBachelorChoiceListReport: function(estudiantes) {
                data = [];
                TITLE = '\n'+'              ESCOGENCIA DE CIENCIA BACHILLERATO ' + new Date().getFullYear() +'\n' +
                    '\nProfesores:\nAsignaturas:';
                columns = [
                    {title: 'Cedula', key: 'ced'},
                    {title: 'Nombre', key: 'nom'},
                    {title: 'Biologia', key: 'bio'},
                    {title: 'Quimica', key: 'quim'},
                    {title: 'Fisica', key: 'fis'}
                ];
                var women = 0;
                var men = 0;
                angular.forEach(estudiantes, function (estudiante_undecimo) {
                    if ((estudiante_undecimo.admitido) && (!estudiante_undecimo.traladado)) {
                        if (estudiante_undecimo.sexo === true) {
                            men++;
                        }
                        else {
                            women++;
                        }
                        data.push({
                            'ced': estudiante_undecimo.nacionalidad,
                            'nom': estudiante_undecimo.segundo_apellido + ' ' + estudiante_undecimo.primer_apellido + ' ' + estudiante_undecimo.name,
                            'bio': '',
                            'quim': '',
                            'fis': ''
                        });
                    }
                });
                var total = women + men;
                HEADER = this.initHeader(women, men, total);
                var result = this.getJSONFromData('Escogencia de ciencia', HEADER, TITLE, columns, data, 165, false);
                return result;
            },

            StudentsForLibraryListReport: function(estudiantes){
                data = [];
                TITLE = '       LISTA DE INFORMACION PARA LA BIBLIOTECA DECIMO ' + new Date().getFullYear() +'\n';
                columns = [
                    {title: 'Cedula', key: 'ced'},
                    {title: 'Nombre', key: 'nom'},
                    {title: 'Email', key: 'email'},
                    {title: 'Direccion', key: 'dir'},
                    {title: 'Fecha de nacimiento', key: 'nac'},
                    {title: 'Edad', key: 'edad'}
                ];
                var women = 0;
                var men = 0;
                angular.forEach(estudiantes, function (estudiante_decimo) {
                    if ((estudiante_decimo.admitido) && (!estudiante_decimo.traladado)) {
                        if(estudiante_decimo.sexo === true){
                            men++;
                        }
                        else{
                            women += 1;
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
                var total = women + men;
                HEADER = this.initHeader(women, men, total);
                var result = this.getJSONFromData('Lista para la biblioteca decimo', HEADER, TITLE, columns, data, 95, false);
                return result;
            },

            OlympicsParticipationListReport: function(estudiantes){
                data = [];
                TITLE ='\n'+'              LISTA INTERESADOS OLIMPIADA DECIMO ' + new Date().getFullYear() +'\n'+
                       '\nProfesores:\nAsignaturas:';
                columns = [
                    {title: 'Cedula', key: 'ced'},
                    {title: 'Nombre', key: 'nom'},
                    {title: 'Participacion Olimpiada', key: 'par'}
                ];
                var women = 0;
                var men = 0;
                angular.forEach(estudiantes, function (estudiante_decimo) {
                    if ((estudiante_decimo.admitido) && (!estudiante_decimo.traladado)) {
                        if(estudiante_decimo.sexo === true){
                            men++;
                        }
                        else{
                            women += 1;
                        }
                        data.push({'ced':estudiante_decimo.nacionalidad,'nom': estudiante_decimo.segundo_apellido + ' ' + estudiante_decimo.primer_apellido + ' ' + estudiante_decimo.name,
                            'par': ''});
                    }
                });
                var total = women + men;
                HEADER = this.initHeader(women, men, total);
                var result = this.getJSONFromData('Lista participación olimpiadas decimo', HEADER, TITLE, columns, data, 165, false);
                return result;
            },

            //Utility functions for reports
            getReportsList: function(){
                var lista = [
                    {nombre: 'Lista de asistencia', val : 1},
                    {nombre: 'Lista de cedula, carne, apellidos, nombre, telefono, correo', val : 2},
                    {nombre: 'Lista de ciencia para bachillerato', val : 3},
                    {nombre: 'Lista de correos', val : 4},
                    {nombre: 'Lista de escogencia de la ciencia para bachillerato', val : 5},
                    {nombre: 'Lista para la biblioteca', val: 6},
                    {nombre: 'Lista de participacion en olimpiadas', val : 7},
                    {nombre: 'Reporte de notas', val : 8}
                ];
                return lista;
            },
            getGradesList: function(){
                var grades = [
                    {grade_opt: 'Decimo', grade: 1},
                    {grade_opt: 'Undecimo', grade: 2}
                ];
                return grades;
            },
            initHeader: function(women, men, total){
                var header =
                    'Colegio Cientifico de Costa Rica                       Mujeres: ' + women + '\n' +
                    'Sede Regional San Carlos                               Hombres: ' + men + '\n' +
                    'Telefax: 2475-7089,Tel: 2401-3122                        Total: ' + total + '\n';
                return header;
            },
            getJSONFromData: function (filename, header, title, columns, data, startY, save){
                var jsonResult = {"Filename": filename, "Header": header, "Title": title, "Columns":columns, "Data": data, "StartY": startY, "Save":save};
                return jsonResult
            },
       };
        return report;
   }
);

