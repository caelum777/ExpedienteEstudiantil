'use strict';

//Functionary resume languages service used to communicate Functionary resume languages REST endpoints
angular.module('functionary-resume-languages').factory('FunctionaryResumeLanguages', ['$resource',
	function($resource) {
		return $resource('functionary-resume-languages/:functionaryResumeLanguageId', { functionaryResumeLanguageId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);