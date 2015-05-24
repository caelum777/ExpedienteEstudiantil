'use strict';

//Logros academicos service used to communicate Logros academicos REST endpoints
angular.module('logros-academicos').factory('LogrosAcademicos', ['$resource',
	function($resource) {
		return $resource('logros-academicos/:logrosAcademicoId', { logrosAcademicoId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

angular.module('logros-academicos').factory('GetLogro', ['$resource',
    function($resource) {
        return $resource('/logros-academicos/estudiante/:cedula', { cedula: '@cedula'
        }, {
            update: {
                method: 'GET'
            }
        });
    }
]);