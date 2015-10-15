'use strict';

//Setting up route
angular.module('functionary-resume-experiences').config(['$stateProvider',
	function($stateProvider) {
		// Functionary resume experiences state routing
		$stateProvider.
		state('listFunctionaryResumeExperiences', {
			url: '/functionary-resume-experiences',
			templateUrl: 'modules/functionary-resume-experiences/views/list-functionary-resume-experiences.client.view.html'
		}).
		state('createFunctionaryResumeExperience', {
			url: '/functionary-resume-experiences/create',
			templateUrl: 'modules/functionary-resume-experiences/views/create-functionary-resume-experience.client.view.html'
		}).
		state('viewFunctionaryResumeExperience', {
			url: '/functionary-resume-experiences/:functionaryResumeExperienceId',
			templateUrl: 'modules/functionary-resume-experiences/views/view-functionary-resume-experience.client.view.html'
		}).
		state('editFunctionaryResumeExperience', {
			url: '/functionary-resume-experiences/:functionaryResumeExperienceId/edit',
			templateUrl: 'modules/functionary-resume-experiences/views/edit-functionary-resume-experience.client.view.html'
		});
	}
]);