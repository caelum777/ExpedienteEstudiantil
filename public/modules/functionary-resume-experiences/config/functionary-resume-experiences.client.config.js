'use strict';

// Configuring the Articles module
angular.module('functionary-resume-experiences').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Functionary resume experiences', 'functionary-resume-experiences', 'dropdown', '/functionary-resume-experiences(/create)?');
		Menus.addSubMenuItem('topbar', 'functionary-resume-experiences', 'List Functionary resume experiences', 'functionary-resume-experiences');
		Menus.addSubMenuItem('topbar', 'functionary-resume-experiences', 'New Functionary resume experience', 'functionary-resume-experiences/create');
	}
]);