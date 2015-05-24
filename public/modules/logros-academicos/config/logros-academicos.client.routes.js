'use strict';

//Setting up route
angular.module('logros-academicos').config(['$stateProvider',
	function($stateProvider) {
		// Logros academicos state routing
		$stateProvider.
		state('listLogrosAcademicos', {
			url: '/logros-academicos/:estudianteId/:cedulaEstudiante',
			templateUrl: 'modules/logros-academicos/views/list-logros-academicos.client.view.html'
		}).
		state('createLogrosAcademico', {
			url: '/logros-academicos/create/:estudianteId/:cedulaEstudiante',
			templateUrl: 'modules/logros-academicos/views/create-logros-academico.client.view.html'
		}).
		state('viewLogrosAcademico', {
			url: '/logros-academicos/:estudianteId/:cedulaEstudiante/:logrosAcademicoId',
			templateUrl: 'modules/logros-academicos/views/view-logros-academico.client.view.html'
		}).
		state('editLogrosAcademico', {
			url: '/logros-academicos/:estudianteId/:cedulaEstudiante/:logrosAcademicoId/edit',
			templateUrl: 'modules/logros-academicos/views/edit-logros-academico.client.view.html'
		});
	}
]);