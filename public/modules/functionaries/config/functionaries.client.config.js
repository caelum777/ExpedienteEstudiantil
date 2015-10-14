'use strict';

// Configuring the Articles module
angular.module('functionaries').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Funcionarios', 'functionaries', 'dropdown', '/functionaries(/create)?');
		Menus.addSubMenuItem('topbar', 'functionaries', 'List Functionaries', 'functionaries');
		Menus.addSubMenuItem('topbar', 'functionaries', 'New Functionary', 'functionaries/create');
	}
]);
