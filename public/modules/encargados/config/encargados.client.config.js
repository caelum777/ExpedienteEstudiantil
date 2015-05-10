'use strict';

// Configuring the Articles module
angular.module('encargados').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Encargados', 'encargados', 'dropdown', '/encargados(/create)?');
		Menus.addSubMenuItem('topbar', 'encargados', 'List Encargados', 'encargados');
		Menus.addSubMenuItem('topbar', 'encargados', 'New Encargado', 'encargados/create');
	}
]);