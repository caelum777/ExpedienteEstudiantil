'use strict';

// Configuring the Articles module
angular.module('estudiantes').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Estudiantes', 'estudiantes', 'dropdown', '/estudiantes(/create)?');
		Menus.addSubMenuItem('topbar', 'estudiantes', 'List Estudiantes', 'estudiantes');
		Menus.addSubMenuItem('topbar', 'estudiantes', 'New Estudiante', 'estudiantes/create');
	}
]);