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

angular.module('encargados').factory('GetEncargado', ['$resource',
    function($resource) {
        return $resource('/encargados/estudiante/:cedula', { cedula: '@cedula'
        }, {
            update: {
                method: 'GET'
            }
        });
    }
]);

