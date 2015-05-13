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

angular.module('estudiantes').factory('GetEstudiantesGeneracion', ['$resource',
    function($resource) {
        return $resource('/estudiantes_generacion/:generacion', { generacion: '@generacion'
        }, {
            update: {
                method: 'GET'
            }
        });
    }
]);

/*angular.module('estudiantes').service('passEstudiante',
    function($resource) {
        estudiante = '';
        return{
            set:function(cedula){
                return estudiante = cedula;
            },
            get:function(){
                return estudiante;
            }
        }
    }
);*/