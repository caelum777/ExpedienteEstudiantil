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