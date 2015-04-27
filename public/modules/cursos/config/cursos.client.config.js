'use strict';

// Configuring the Articles module
angular.module('cursos').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Cursos', 'cursos', 'dropdown', '/cursos(/create)?');
		Menus.addSubMenuItem('topbar', 'cursos', 'List Cursos', 'cursos');
		Menus.addSubMenuItem('topbar', 'cursos', 'New Curso', 'cursos/create');
	}
]);