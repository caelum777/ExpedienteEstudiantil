'use strict';

//Encargados service used to communicate Encargados REST endpoints
angular.module('encargados').factory('Encargados', ['$resource',
	function($resource) {
		return $resource('encargados/:encargadoId', { encargadoId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);


/*angular.module('encargados',['estudiantes']).factory('getEstudiante', ['$resource',
    function($resource) {
        return{
            get:function(){
                return passEstudiante.get()
            }
        }
    }
]);*/

/*angular.module('encargados').factory('moveEstudiante', function(){
    estudiante = '';
    return{
        set:function(cedula){
            return estudiante = cedula;
        },
        get:function(){
            return estudiante;
        }
    }

});*/