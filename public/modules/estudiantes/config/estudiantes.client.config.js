'use strict';

// Configuring the Articles module
angular.module('estudiantes').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Estudiantes en Admición', 'estudiantes', 'dropdown', '/estudiantes(/create)?', true);
		Menus.addSubMenuItem('topbar', 'estudiantes', 'Mostrar Estudiantes', 'estudiantes', true);
		Menus.addSubMenuItem('topbar', 'estudiantes', 'Insertar Estudiante', 'estudiantes/create', true);
	}
]);