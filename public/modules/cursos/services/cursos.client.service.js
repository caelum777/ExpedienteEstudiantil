'use strict';

//Cursos service used to communicate Cursos REST endpoints
angular.module('cursos').factory('Cursos', ['$resource',
	function($resource) {
		return $resource('cursos/:cursoId', { cursoId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);