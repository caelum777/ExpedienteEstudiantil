'use strict';

// Configuring the Articles module
angular.module('functionary-resume-educations').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Functionary resume educations', 'functionary-resume-educations', 'dropdown', '/functionary-resume-educations(/create)?');
		Menus.addSubMenuItem('topbar', 'functionary-resume-educations', 'List Functionary resume educations', 'functionary-resume-educations');
		Menus.addSubMenuItem('topbar', 'functionary-resume-educations', 'New Functionary resume education', 'functionary-resume-educations/create');
	}
]);