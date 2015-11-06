'use strict';

//Setting up route
angular.module('functionary-resume-educations').config(['$stateProvider',
	function($stateProvider) {
		// Functionary resume educations state routing
		$stateProvider.
		state('listFunctionaryResumeEducations', {
			url: '/functionary-resume-educations',
			templateUrl: 'modules/functionary-resume-educations/views/list-functionary-resume-educations.client.view.html'
		}).
		state('createFunctionaryResumeEducation', {
			url: '/functionary-resume-educations/create',
			templateUrl: 'modules/functionary-resume-educations/views/create-functionary-resume-education.client.view.html'
		}).
		state('viewFunctionaryResumeEducation', {
			url: '/functionary-resume-educations/:functionaryResumeEducationId',
			templateUrl: 'modules/functionary-resume-educations/views/view-functionary-resume-education.client.view.html'
		}).
		state('editFunctionaryResumeEducation', {
			url: '/functionary-resume-educations/:functionaryResumeEducationId/edit',
			templateUrl: 'modules/functionary-resume-educations/views/edit-functionary-resume-education.client.view.html'
		});
	}
]);