'use strict';

//Functionary resume experiences service used to communicate Functionary resume experiences REST endpoints
angular.module('functionary-resume-experiences').factory('FunctionaryResumeExperiences', ['$resource',
	function($resource) {
		return $resource('functionary-resume-experiences/:functionaryResumeExperienceId', { functionaryResumeExperienceId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);



