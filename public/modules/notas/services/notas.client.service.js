'use strict';

//Notas service used to communicate Notas REST endpoints
angular.module('notas').factory('Notas', ['$resource',
	function($resource) {
		return $resource('notas/:cedula_estudiante', { cedula_estudiante: '@cedula_estudiante'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);