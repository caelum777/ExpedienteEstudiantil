'use strict';

//Setting up route
angular.module('functionary-resume-languages').config(['$stateProvider',
	function($stateProvider) {
		// Functionary resume languages state routing
		$stateProvider.
		state('listFunctionaryResumeLanguages', {
			url: '/functionary-resume-languages',
			templateUrl: 'modules/functionary-resume-languages/views/list-functionary-resume-languages.client.view.html'
		}).
		state('createFunctionaryResumeLanguage', {
			url: '/functionary-resume-languages/create',
			templateUrl: 'modules/functionary-resume-languages/views/create-functionary-resume-language.client.view.html'
		}).
		state('viewFunctionaryResumeLanguage', {
			url: '/functionary-resume-languages/:functionaryResumeLanguageId',
			templateUrl: 'modules/functionary-resume-languages/views/view-functionary-resume-language.client.view.html'
		}).
		state('editFunctionaryResumeLanguage', {
			url: '/functionary-resume-languages/:functionaryResumeLanguageId/edit',
			templateUrl: 'modules/functionary-resume-languages/views/edit-functionary-resume-language.client.view.html'
		});
	}
]);