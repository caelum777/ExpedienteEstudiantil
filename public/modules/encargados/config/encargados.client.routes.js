'use strict';

//Setting up route
angular.module('encargados').config(['$stateProvider',
	function($stateProvider) {
		// Encargados state routing
		$stateProvider.
		state('listEncargados', {
			url: '/encargados',
			templateUrl: 'modules/encargados/views/list-encargados.client.view.html'
		}).
		state('createEncargado', {
			url: '/encargados/create/:estudianteId',
			templateUrl: 'modules/encargados/views/create-encargado.client.view.html'
		}).
		state('viewEncargado', {
			url: '/encargados/:encargadoId',
			templateUrl: 'modules/encargados/views/view-encargado.client.view.html'
		}).
		state('editEncargado', {
			url: '/encargados/:encargadoId/edit',
			templateUrl: 'modules/encargados/views/edit-encargado.client.view.html'
		});
	}
]);