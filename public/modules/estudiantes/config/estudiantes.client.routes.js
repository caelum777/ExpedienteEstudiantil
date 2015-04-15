'use strict';

//Setting up route
angular.module('estudiantes').config(['$stateProvider',
	function($stateProvider) {
		// Estudiantes state routing
		$stateProvider.
		state('listEstudiantes', {
			url: '/estudiantes',
			templateUrl: 'modules/estudiantes/views/list-estudiantes.client.view.html'
		}).
		state('createEstudiante', {
			url: '/estudiantes/create',
			templateUrl: 'modules/estudiantes/views/create-estudiante.client.view.html'
		}).
		state('viewEstudiante', {
			url: '/estudiantes/:estudianteId',
			templateUrl: 'modules/estudiantes/views/view-estudiante.client.view.html'
		}).
		state('editEstudiante', {
			url: '/estudiantes/:estudianteId/edit',
			templateUrl: 'modules/estudiantes/views/edit-estudiante.client.view.html'
		});
	}
]);