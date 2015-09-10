'use strict';

// Configuring the Articles module
angular.module('estudiantes').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Estudiantes', 'estudiantes', 'dropdown', '/estudiantes(/create)?', true);
        Menus.addSubMenuItem('topbar', 'estudiantes', 'Insertar Estudiante', 'estudiantes/create', true);
		Menus.addSubMenuItem('topbar', 'estudiantes', 'Mostrar Estudiantes en Admisión', 'estudiantes_en_admicion', true);
        Menus.addSubMenuItem('topbar', 'estudiantes', 'Mostrar Estudiantes Admitidos', 'estudiantes_admitidos', true);
        Menus.addSubMenuItem('topbar', 'estudiantes', 'Consultas de Estudiantes', 'consultas_estudiantes/', true);
        Menus.addSubMenuItem('topbar', 'estudiantes', 'Reportes de Estudiantes', 'reportes_estudiantes/', true);
	}
]);
