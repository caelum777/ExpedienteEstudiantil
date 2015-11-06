'use strict';

//Functionary resume educations service used to communicate Functionary resume educations REST endpoints
angular.module('functionary-resume-educations').factory('FunctionaryResumeEducations', ['$resource',
	function($resource) {
		return $resource('functionary-resume-educations/:functionaryResumeEducationId', { functionaryResumeEducationId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);


