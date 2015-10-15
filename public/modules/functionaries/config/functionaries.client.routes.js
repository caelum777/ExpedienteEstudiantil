'use strict';

//Setting up route
angular.module('functionaries').config(['$stateProvider',
	function($stateProvider) {
		// Functionaries state routing
		$stateProvider.
		state('listFunctionaries', {
			url: '/functionaries',
			templateUrl: 'modules/functionaries/views/list-functionaries.client.view.html'
		}).
		state('createFunctionary', {
			url: '/functionaries/create',
			templateUrl: 'modules/functionaries/views/create-functionary.client.view.html'
		}).
		state('viewFunctionary', {
			url: '/functionaries/:functionaryId',
			templateUrl: 'modules/functionaries/views/view-functionary.client.view.html'
		}).
		state('editFunctionary', {
			url: '/functionaries/:functionaryId/edit',
			templateUrl: 'modules/functionaries/views/edit-functionary.client.view.html'
		});
	}
]);