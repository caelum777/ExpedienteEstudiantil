'use strict';

//Setting up route
angular.module('estudiantes').config(['$stateProvider',
	function($stateProvider) {
		// Estudiantes state routing
		$stateProvider.
		state('listEstudiantesEnAdmicion', {
			url: '/estudiantes_en_admicion',
			templateUrl: 'modules/estudiantes/views/list-estudiantes-en-admicion.client.view.html'
		}).
        state('listEstudiantesAdmitidos', {
            url: '/estudiantes_admitidos',
            templateUrl: 'modules/estudiantes/views/list-estudiantes-admitidos.client.view.html'
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
		})
        .state('notasccEstudiante', {
            url: '/estudiantes/:estudianteId/archivosadjuntos',
            templateUrl: 'modules/estudiantes/views/archivos-adjuntos.view.html'
        })
        .state('datosEstudiante', {
            url: '/estudiantes/:estudianteId/notas_c_c',
            templateUrl: 'modules/estudiantes/views/notas-colegio-cientifico.view.html'
        });
	}
]);