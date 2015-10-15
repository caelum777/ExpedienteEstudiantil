'use strict';

angular.module('core').service('Utility', [

	function() {

		//Generates a list of years from a static start Year to the Current Year.
		this.generateListOfYears = function() {
			var startYear = 1950;
			var currentYear = new Date().getFullYear(), years = [];
			while ( startYear <= currentYear ) {
				years.push({year: startYear});
				startYear++;
			}

			return years;
		};

		this.getFunctionaryStatus = function() {
			return [{status: 'Activo'}, {status: 'Despedido'}, {status: 'Reununcio'}];
		};

		this.getFunctionaryRoles = function() {
			return [{role: 'Academico'}, {role: 'Administrativo'}];
		};

		this.getMaritalStatusList = function() {
			return [{maritalStatus: 'Soltero'}, {maritalStatus: 'Casado'}, {maritalStatus: 'Divorciado'} ];
		};

		this.getGenderList = function() {
			return [{gender: 'Hombre'}, {gender: 'Mujer'}];
		};


	}
]);
