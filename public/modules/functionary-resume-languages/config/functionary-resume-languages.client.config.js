'use strict';

// Configuring the Articles module
angular.module('functionary-resume-languages').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Functionary resume languages', 'functionary-resume-languages', 'dropdown', '/functionary-resume-languages(/create)?');
		Menus.addSubMenuItem('topbar', 'functionary-resume-languages', 'List Functionary resume languages', 'functionary-resume-languages');
		Menus.addSubMenuItem('topbar', 'functionary-resume-languages', 'New Functionary resume language', 'functionary-resume-languages/create');
	}
]);