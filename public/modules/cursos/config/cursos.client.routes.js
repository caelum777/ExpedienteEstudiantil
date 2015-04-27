'use strict';

//Setting up route
angular.module('cursos').config(['$stateProvider',
	function($stateProvider) {
		// Cursos state routing
		$stateProvider.
		state('listCursos', {
			url: '/cursos',
			templateUrl: 'modules/cursos/views/list-cursos.client.view.html'
		}).
		state('createCurso', {
			url: '/cursos/create',
			templateUrl: 'modules/cursos/views/create-curso.client.view.html'
		}).
		state('viewCurso', {
			url: '/cursos/:cursoId',
			templateUrl: 'modules/cursos/views/view-curso.client.view.html'
		}).
		state('editCurso', {
			url: '/cursos/:cursoId/edit',
			templateUrl: 'modules/cursos/views/edit-curso.client.view.html'
		});
	}
]);