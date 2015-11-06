'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'expedienteestudiantil';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',  'ui.router', 'ui.bootstrap', 'ui.utils', 'angularFileUpload', 'ngGrid'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('encargados');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('estudiantes');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('logros-academicos');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('notas');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
	}
]);
'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar',true);
	}
]);
'use strict';

// Configuring the Articles module
angular.module('encargados').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Encargados', 'encargados', 'dropdown', '/encargados(/create)?');
		//Menus.addSubMenuItem('topbar', 'encargados', 'List Encargados', 'encargados');
		//Menus.addSubMenuItem('topbar', 'encargados', 'New Encargado', 'encargados/create');
	}
]);
'use strict';

//Setting up route
angular.module('encargados').config(['$stateProvider',
	function($stateProvider) {
		// Encargados state routing
		$stateProvider.
		state('listEncargados', {
			url: '/encargados/:estudianteId/:cedulaEstudiante',
			templateUrl: 'modules/encargados/views/list-encargados.client.view.html'
		}).
		state('createEncargado', {
			url: '/encargados/create/:estudianteId/:cedulaEstudiante',
			templateUrl: 'modules/encargados/views/create-encargado.client.view.html'
		}).
		state('viewEncargado', {
			url: '/encargados/:estudianteId/:cedulaEstudiante/:encargadoId',
			templateUrl: 'modules/encargados/views/view-encargado.client.view.html'
		}).
		state('editEncargado', {
			url: '/encargados/:estudianteId/:cedulaEstudiante/:encargadoId/edit',
			templateUrl: 'modules/encargados/views/edit-encargado.client.view.html'
		});
	}
]);
'use strict';

// Encargados controller
angular.module('encargados').controller('EncargadosController', ['$scope', '$stateParams', '$location', 'Authentication', 'Encargados','GetEncargado', 'Utility',
	function($scope, $stateParams, $location, Authentication, Encargados, GetEncargado, Utility) {
		$scope.authentication = Authentication;
        $scope.estudiante = '';
        $scope.name = '';
        $scope.primer_apellido = '';
        $scope.segundo_apellido = '';
        $scope.cedula = '';
        $scope.parentesco = '';
        $scope.ocupacion = '';
        $scope.estado_civil = '';
        $scope.nacionalidad = '';
        $scope.telefono = '';
        $scope.correo = '';
        $scope.direccion = '';
        //$scope.opciones = [{opcion: 'No'}, {opcion: 'Si'}];
        //$scope.eleccion = $scope.opciones[0];

        //Datos para las URL
        $scope.idEstudianteUrl = '';
        $scope.cedulaEstudianteUrl ='';


        // Create new Encargado
		$scope.create = function() {
			// Create new Encargado object
            console.log($scope.parentesco);
			var encargado = new Encargados ({
                estudiante: $stateParams.cedulaEstudiante,
				name: $scope.name,
                primer_apellido:$scope.primer_apellido,
                segundo_apellido: $scope.segundo_apellido,
                cedula: $scope.cedula,
                parentesco: $scope.parentesco.relationship,
                ocupacion: $scope.ocupacion,
                estado_civil: $scope.estado_civil,
                nacionalidad: $scope.nacionalidad,
                telefono: $scope.telefono,
                correo: $scope.correo,
                direccion: $scope.direccion
                //responsable: $scope.eleccion.opcion
			});
            $scope.cedula = $stateParams.cedulaEstudiante;
            $scope.idEtudianteUrl = $stateParams.estudianteId;
            $scope.encargadosE = GetEncargado.query({
                    cedula:$scope.cedula
            });
            $scope.encargadosE.$promise.then(function(){
                if($scope.encargadosE.length < 2){
                    encargado.$save(function (response) {
                        //$location.path('encargados/' + response._id);
                        $location.path('estudiantes/' + $stateParams.estudianteId);

                        // Clear form fields
                        $scope.name = '';
                    }, function (errorResponse) {
                        $scope.error = errorResponse.data.message;
                    });
                }
                else{
                    $scope.error = 'Ya hay más de dos encargados';
                }
            });
		};

		// Remove existing Encargado
		$scope.remove = function(encargado) {
			if ( encargado ) {
				encargado.$remove();

				for (var i in $scope.encargados) {
					if ($scope.encargados [i] === encargado) {
						$scope.encargados.splice(i, 1);
					}
				}
			} else {
				$scope.encargado.$remove(function() {
					//$location.path('encargados');
                    $location.path('encargados/' + $stateParams.estudianteId+'/'+$stateParams.cedulaEstudiante);
				});
			}
		};

		// Update existing Encargado
		$scope.update = function() {
			var encargado = $scope.encargado;
            encargado.parentesco = $scope.parentesco.relationship;
            //encargado.responsable = $scope.eleccion.opcion;
			encargado.$update(function() {
				//$location.path('encargados/' + encargado._id);
                $location.path('encargados/' + $stateParams.estudianteId+'/'+$stateParams.cedulaEstudiante+'/'+encargado._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Encargados
		$scope.find = function() {
			$scope.encargados = Encargados.query();
		};

        $scope.findByEstudiante = function() {
            $scope.cedula = $stateParams.cedulaEstudiante;
            $scope.estudianteID = $stateParams.estudianteId;
            $scope.encargadosE = GetEncargado.query({
                cedula:$scope.cedula
            });
        };

		// Find existing Encargado
		$scope.findOne = function() {
            $scope.cedulaEstudianteUrl = $stateParams.cedulaEstudiante;
            $scope.idEstudianteUrl = $stateParams.estudianteId;
			$scope.encargado = Encargados.get({
				encargadoId: $stateParams.encargadoId
			});

            $scope.encargado.$promise.then(function(estudiante) {
                $scope.parentesco = $scope.setParentescoComboBox(estudiante.parentesco);
            });
		};

        $scope.relationshipStudentList = Utility.getRelationshipList();
        $scope.parentesco = $scope.relationshipStudentList[0];

        $scope.setParentescoComboBox = function(parentesco){
            for(var i = 0; i < $scope.relationshipStudentList.length; i++){
                if ($scope.relationshipStudentList[i].relationship === parentesco){
                    return $scope.relationshipStudentList[i];
                }
            }
        };
       /* $scope.isResponsable = function(value) {
            if (value === true)
                $scope.responsableS = 'Si'
            else
                $scope.responsableS = 'No'
        };*/
	}
]);

'use strict';

//Encargados service used to communicate Encargados REST endpoints
angular.module('encargados').factory('Encargados', ['$resource',
	function($resource) {
		return $resource('encargados/:encargadoId', { encargadoId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

angular.module('encargados').factory('GetEncargado', ['$resource',
    function($resource) {
        return $resource('/encargados/estudiante/:cedula', { cedula: '@cedula'
        }, {
            update: {
                method: 'GET'
            }
        });
    }
]);

angular.module('encargados').service('Utility', [
    function() {
        //Generates a list of years from a static start Year to the Current Year.
        this.getRelationshipList = function() {
            return [{relationship: 'Padre'}, {relationship: 'Madre'}, {relationship: 'Encargado Legal'}];
        };
    }
]);


/*angular.module('encargados',['estudiantes']).factory('getEstudiante', ['$resource',
    function($resource) {
        return{
            get:function(){
                return passEstudiante.get()
            }
        }
    }
]);*/

/*angular.module('encargados').factory('moveEstudiante', function(){
    estudiante = '';
    return{
        set:function(cedula){
            return estudiante = cedula;
        },
        get:function(){
            return estudiante;
        }
    }

});*/

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
'use strict';

//Setting up route
angular.module('estudiantes').config(['$stateProvider',
	function($stateProvider) {
		// Estudiantes state routing
		$stateProvider.
		state('listEstudiantesEnAdmicion', {
			url: '/estudiantes_en_admicion',
			templateUrl: 'modules/estudiantes/views/list-estudiantes-en-admicion.client.view.html'
		}).
        state('listEstudiantesAdmitidos', {
            url: '/estudiantes_admitidos',
            templateUrl: 'modules/estudiantes/views/list-estudiantes-admitidos.client.view.html'
        }).
		state('createEstudiante', {
			url: '/estudiantes/create',
			templateUrl: 'modules/estudiantes/views/create-estudiante.client.view.html'
		}).
		state('viewEstudiante', {
			url: '/estudiantes/:estudianteId',
			templateUrl: 'modules/estudiantes/views/view-estudiante.client.view.html'
		}).
		state('editEstudiante', {
			url: '/estudiantes/:estudianteId/edit',
			templateUrl: 'modules/estudiantes/views/edit-estudiante.client.view.html'
		})
        .state('notasccEstudiante', {
            url: '/estudiantes/:estudianteId/archivosadjuntos',
            templateUrl: 'modules/estudiantes/views/archivos-adjuntos.view.html'
        })
        .state('datosEstudiante', {
            url: '/estudiantes/:estudianteId/notas_c_c',
            templateUrl: 'modules/estudiantes/views/notas-colegio-cientifico.view.html'
        })
        .state('consultasEstudiantes', {
            url: '/consultas_estudiantes/',
            templateUrl: 'modules/estudiantes/views/consultas-estudiantes.view.html'
        })
        .state('reportesEstudiantes', {
            url: '/reportes_estudiantes/',
            templateUrl: 'modules/estudiantes/views/repotes-estudiantes.view.html'
        });
	}
]);
'use strict';

// Estudiantes controller
angular.module('estudiantes').controller('EstudiantesController', ['$scope', '$stateParams', '$location', '$filter', '$http', '$sce', 'Authentication', 'Estudiantes', '$upload', 'Notas', 'GetNotas', 'GetAdmitidos', 'Decimo', 'Undecimo', 'Nacionalidad', 'Reports',
	function($scope, $stateParams, $location, $filter, $http, $sce, Authentication, Estudiantes, $upload, Notas, GetNotas, GetAdmitidos, Decimo, Undecimo, Nacionalidad, Reports) {
		$scope.authentication = Authentication;
        $scope.options = $http.get('codigo-postal.json').then(function(data){
            $scope.options = data.data;
            $scope.provincia = $scope.options[0];
            $scope.canton =  $scope.provincia.cantones[0];
            $scope.distrito = $scope.canton.distritos[0];
        });
        $scope.high_schools_list = $http.get('colegios-procedencia.json').then(function(data){
            $scope.high_schools_list = data.data;
            $scope.colegio_procedencia = $scope.high_schools_list[0];
        });
        $scope.sexos = [{nombre: 'Masculino'}, {nombre: 'Femenino'}];
        $scope.adecuaciones = [{nombre: 'Tiene'}, {nombre: 'No tiene'}];
        $scope.consultas = [{nombre: 'Nombre'}, {nombre: 'Cedula'}, {nombre: 'Colegio de Procedencia'}];
        $scope.consultas_genero = [{sexo: 'Masculino'}, {sexo: 'Femenino'}, {sexo: 'Ambos'}];
        $scope.consultas_grado = [{grado: 'Décimo'}, {grado: 'Undécimo'}, {grado: 'Décimo y Undécimo'}];
        $scope.consultas_estado = [{estado: 'Todos'}, {estado: 'Egresado'}, {estado: 'Trasladado'}];
        $scope.consulta = $scope.consultas[0];
        $scope.consulta_sexo = $scope.consultas_genero[0];
        $scope.consulta_grado = $scope.consultas_grado[0];
        $scope.consulta_estado = $scope.consultas_estado[0];
        $scope.sexo = $scope.sexos[0];
        $scope.adSignificativa = $scope.adecuaciones[0];
        $scope.adNoSignificativa = $scope.adecuaciones[0];
        $scope.foto = '';
        $scope.editable = false;
        $scope.selectedFile = [];
        $scope.selected_certificacion_nacimiento = [];
        $scope.selected_certificacion_notas = [];
        $scope.selected_inf_hogar = [];
        $scope.selected_vacunas = [];
        $scope.anno_ingreso = 0;



        $scope.provincia_change = function() {
            $scope.canton =  $scope.provincia.cantones[0];
            $scope.distrito = $scope.canton.distritos[0];
        };

        $scope.canton_change = function(){
            $scope.distrito = $scope.canton.distritos[0];
        };

        $scope.onFileSelect = function ($files) {
            if($files !== [])
                $scope.selectedFile = $files;
        };
        $scope.on_select_cer_nacimiento = function ($files) {
            if($files !== [])
                $scope.selected_certificacion_nacimiento = $files;
        };
        $scope.on_select_cer_notas = function ($files) {
            if($files !== [])
                $scope.selected_certificacion_notas = $files;
        };
        $scope.on_select_infor_hogar = function ($files) {
            if($files !== [])
                $scope.selected_inf_hogar = $files;
        };
        $scope.on_select_tarje_vacunas = function ($files) {
            if($files !== [])
                $scope.selected_vacunas = $files;
        };

        $scope.$watch('anno_ingreso',function() {
            if ($scope.anno_ingreso > new Date().getFullYear()) {

                $scope.anno_ingreso_error_mayor_actual = true;
            } else {
                $scope.anno_ingreso_error_mayor_actual = false;
            }

        });

		// Create new Estudiante
		$scope.create = function() {
            //Uploads photo
             var file = $scope.selectedFile[0];
                $scope.upload = $upload.upload({
                    url: '/upload',
                    method: 'POST',
                    file: file
                }).success(function(data) {
                    $scope.foto = data.name;
                    insertarEstudiante();
                });

            function insertarEstudiante(){
                // Create new Estudiante object
                //var graduado
                var graduado = 0;
                /*if($scope.anno_ingreso < new Date().getFullYear()-1){
                    gr = 1;
                }*/
                graduado = $scope.graduado;
                var admitido = 0;
                /*if($scope.anno_ingreso < new Date().getFullYear()){
                    admitido = 1;
                }*/

                if ($scope.anno_ingreso>new Date().getFullYear()) {
                    $scope.anno_ingreso_error = true;
                    return;
                }
                admitido = $scope.anno_ingreso;
                var estudiante = new Estudiantes ({
                    name: $scope.name,
                    primer_apellido: $scope.primer_apellido,
                    segundo_apellido: $scope.segundo_apellido,
                    nacionalidad: $scope.nacionalidad,
                    sexo: $scope.sexo.nombre,
                    fecha_de_nacimiento: $scope.fecha_de_nacimiento,
                    telefono_casa: $scope.telefono_casa,
                    celular: $scope.celular,
                    correo: $scope.correo,
                    provincia: $scope.provincia.nombre,
                    canton: $scope.canton.nombre,
                    distrito: $scope.distrito.nombre,
                    barrio: $scope.barrio,
                    direccion_exacta: $scope.direccion_exacta,
                    admitido: admitido,
                    foto: $scope.foto,
                    anno_ingreso: $scope.anno_ingreso,
                    colegio_procedencia: $scope.colegio_procedencia.name,
                    adecuacion_sig: $scope.adecuacion_sig,
                    adecuacion_nsig: $scope.adecuacion_nsig,
                    graduado: graduado
                });

                // Redirect after save
                estudiante.$save(function(response) {

                    for(var i = 0; i < $scope.notas_setimo_octavo_noveno.length; i++) {

                        var notaS = new Notas ({
                            cedula_estudiante: $scope.nacionalidad,
                            grado: 'septimo',
                            curso: $scope.notas_setimo_octavo_noveno[i].curso,
                            nota: $scope.notas_setimo_octavo_noveno[i].nota_setimo,
                            anno: estudiante.anno_ingreso-3,
                            semestre: 0
                        });
                        var notaO = new Notas ({
                            cedula_estudiante: $scope.nacionalidad,
                            grado: 'octavo',
                            curso: $scope.notas_setimo_octavo_noveno[i].curso,
                            nota: $scope.notas_setimo_octavo_noveno[i].nota_octavo,
                            anno: estudiante.anno_ingreso-2,
                            semestre: 0
                        });
                        var notaNPT = new Notas ({
                            cedula_estudiante: $scope.nacionalidad,
                            grado: 'noveno',
                            curso: $scope.notas_setimo_octavo_noveno[i].curso,
                            nota: $scope.notas_setimo_octavo_noveno[i].nota_noveno_primer_trimestre,
                            anno: estudiante.anno_ingreso-1,
                            semestre: 1
                        });
                        var notaNST = new Notas ({
                            cedula_estudiante: $scope.nacionalidad,
                            grado: 'noveno',
                            curso: $scope.notas_setimo_octavo_noveno[i].curso,
                            nota: $scope.notas_setimo_octavo_noveno[i].nota_noveno_segundo_trimestre,
                            anno: estudiante.anno_ingreso-1,
                            semestre: 2
                        });
                        notaS.$save(function(response) {
                        }, function(errorResponse) {
                            $scope.error = errorResponse.data.message;
                        });
                        notaO.$save(function(response) {
                        }, function(errorResponse) {
                            $scope.error = errorResponse.data.message;
                        });
                        notaNPT.$save(function(response) {
                        }, function(errorResponse) {
                            $scope.error = errorResponse.data.message;
                        });
                        notaNST.$save(function(response) {
                        }, function(errorResponse) {
                            $scope.error = errorResponse.data.message;
                        });
                    }
                    for(var j = 0; j < $scope.notas_decimo_undecimo.length; j++) {
                        var notaD1 = new Notas ({
                            cedula_estudiante: $scope.nacionalidad,
                            grado: 'decimo',
                            curso: $scope.notas_decimo_undecimo[j].curso,
                            nota: $scope.notas_decimo_undecimo[j].nota_decimo_primer_semestre,
                            anno: estudiante.anno_ingreso,
                            semestre: 1
                        });
                        var notaD2 = new Notas ({
                            cedula_estudiante: $scope.nacionalidad,
                            grado: 'decimo',
                            curso: $scope.notas_decimo_undecimo[j].curso,
                            nota: $scope.notas_decimo_undecimo[j].nota_decimo_segundo_semestre,
                            anno: estudiante.anno_ingreso,
                            semestre: 2
                        });
                        var notaU1 = new Notas ({
                            cedula_estudiante: $scope.nacionalidad,
                            grado: 'undecimo',
                            curso: $scope.notas_decimo_undecimo[j].curso,
                            nota: $scope.notas_decimo_undecimo[j].nota_undecimo_primer_semestre,
                            anno: estudiante.anno_ingreso + 1,
                            semestre: 1
                        });
                        var notaU2 = new Notas ({
                            cedula_estudiante: $scope.nacionalidad,
                            grado: 'undecimo',
                            curso: $scope.notas_decimo_undecimo[j].curso,
                            nota: $scope.notas_decimo_undecimo[j].nota_undecimo_segundo_semestre,
                            anno: estudiante.anno_ingreso + 1,
                            semestre: 2
                        });
                        notaD1.$save(function(response) {
                        }, function(errorResponse) {
                            $scope.error = errorResponse.data.message;
                        });
                        notaD2.$save(function(response) {
                        }, function(errorResponse) {
                            $scope.error = errorResponse.data.message;
                        });
                        notaU1.$save(function(response) {
                        }, function(errorResponse) {
                            $scope.error = errorResponse.data.message;
                        });
                        notaU2.$save(function(response) {
                        }, function(errorResponse) {
                            $scope.error = errorResponse.data.message;
                        });
                    }
                    $location.path('estudiantes/' + response._id);
                    // Clear form fields
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            }
		};

		// Remove existing Estudiante
		$scope.remove = function(estudiante) {
			if ( estudiante ) {
				estudiante.$remove();
				for (var i in $scope.estudiantes) {
					if ($scope.estudiantes [i] === estudiante) {
						$scope.estudiantes.splice(i, 1);
					}
				}
			} else {
				$scope.estudiante.$remove(function() {
					$location.path('estudiantes');
				});
                var notas = $scope.notas;
                angular.forEach(notas, function (nota) {
                    Notas.remove({ notaId: nota._id }, nota);
                });
			}
		};

		// Update existing Estudiante
		$scope.update = function() {
            var file = $scope.selectedFile[0];
            $scope.upload = $upload.upload({
                url: '/upload',
                method: 'POST',
                file: file
            }).success(function(data) {
                $scope.foto = data.name;
                $scope.updateEstudiantes();
            });
		};

        $scope.updateEstudiantes = function() {
            var estudiante = $scope.estudiante;
            estudiante.foto = $scope.foto;
            if($scope.sexo.nombre === 'Masculino'){
                estudiante.sexo = true;
            }
            else{
                estudiante.sexo = false;
            }
            if($scope.adSignificativa.nombre === 'Tiene'){
                estudiante.adSignificativa = true;
            }
            else{
                estudiante.adSignificativa = false;
            }
            if($scope.adNoSignificativa.nombre === 'Tiene'){
                estudiante.adNoSignificativa = true;
            }
            else{
                estudiante.adNoSignificativa = false;
            }
            estudiante.provincia = $scope.provincia.nombre;
            estudiante.canton = $scope.canton.nombre;
            estudiante.distrito = $scope.distrito.nombre;
            estudiante.colegio_procedencia = $scope.colegio_procedencia.name;
            estudiante.$update(function() {
                $location.path('estudiantes/' + estudiante._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
            var notas = $scope.notas;
            angular.forEach(notas, function (nota) {
                for(var i = 0;i < $scope.notas_setimo_octavo_noveno.length; i++){
                    if((nota.grado === 'septimo')&&($scope.notas_setimo_octavo_noveno[i].curso===nota.curso)){
                        nota.nota = $scope.notas_setimo_octavo_noveno[i].nota_setimo;
                    }
                    else if((nota.grado === 'octavo')&&($scope.notas_setimo_octavo_noveno[i].curso===nota.curso)){
                        nota.nota = $scope.notas_setimo_octavo_noveno[i].nota_octavo;
                    }
                    else if((nota.grado === 'noveno')&&($scope.notas_setimo_octavo_noveno[i].curso===nota.curso)){
                        if(nota.semestre === 1){
                            nota.nota = $scope.notas_setimo_octavo_noveno[i].nota_noveno_primer_trimestre;
                        }
                        else if(nota.semestre === 2){
                            nota.nota = $scope.notas_setimo_octavo_noveno[i].nota_noveno_segundo_trimestre;
                        }
                    }
                }
                Notas.update({ notaId: nota._id }, nota);
            });
        };

        $scope.estudiantes = [];
		// Find a list of Estudiantes/Cuando el parametro viene en true es para los estudiantes matriculados
		$scope.find = function(matriculado) {
			$scope.estudiantes = Estudiantes.query();
            $scope.ngGridEstudiantes(matriculado);
		};

        $scope.admitidos = function(admitido) {
            $scope.estudiantes = GetAdmitidos.query({admitido: admitido});
            $scope.ngGridEstudiantes(admitido);
        };

		// Find existing Estudiante
		$scope.findOne = function(edit) {
            $scope.estudiante = Estudiantes.get({
                estudianteId: $stateParams.estudianteId
            });
            $scope.notas_septimo = [];
            $scope.notas_octavo =[];
            $scope.notas_noveno = [];
            $scope.notas_setimo_octavo_noveno = [];
            $scope.editable = edit;
            $scope.estudiante.$promise.then(function(estudiante) {
                $scope.sexo = $scope.sexos[$scope.find($scope.sexos, $scope.estudiante.sexo, 0)];
                if(edit){
                    if($scope.adecuaciones[0].nombre === $scope.estudiante.adecuacion_sig){
                        $scope.adSignificativa = $scope.adecuaciones[0];
                    }
                    else{
                        $scope.adSignificativa = $scope.adecuaciones[1];
                    }
                    if($scope.adecuaciones[0].nombre === $scope.estudiante.adecuacion_nsig){
                        $scope.adNoSignificativa = $scope.adecuaciones[0];
                    }
                    else{
                        $scope.adNoSignificativa = $scope.adecuaciones[1];
                    }

                    var arr = $scope.findprovincia($scope.estudiante.provincia,$scope.estudiante.canton,$scope.estudiante.distrito);
                    $scope.provincia = $scope.options[arr[0]];
                    $scope.canton = $scope.options[arr[0]].cantones[arr[1]];
                    $scope.distrito = $scope.options[arr[0]].cantones[arr[1]].distritos[arr[2]];
                    $scope.colegio_procedencia = $scope.setColegioProcedenciaComboBox($scope.estudiante.colegio_procedencia);
                }
                $scope.notas = GetNotas.query({
                    cedula_estudiante: estudiante.nacionalidad
                });
                $scope.notas.$promise.then(function(notas) {
                    var temporalNoteRegister = [];
                    angular.forEach(notas, function (nota) {
                        if(nota.grado==='septimo'){
                            temporalNoteRegister.push({materia: nota.curso, grado: nota.grado, calificacion: nota.nota});
                        }
                        else if(nota.grado==='octavo'){
                            temporalNoteRegister.push({materia: nota.curso, grado: nota.grado, calificacion: nota.nota});
                        }
                        else if(nota.grado==='noveno'){
                            temporalNoteRegister.push({materia: nota.curso, grado: nota.grado, calificacion: nota.nota, semestre: nota.semestre});
                        }
                    });
                    var cursos_checked = [];
                    for (var i = 0; i < temporalNoteRegister.length; i++){
                        var curso = temporalNoteRegister[i].materia;
                        var setimo = 0;
                        var octavo = 0;
                        var noveno_primer_trimestre = 0;
                        var noveno_segundo_trimestre = 0;
                        if(cursos_checked.indexOf(curso) === -1){
                            for (var j = 0; j < temporalNoteRegister.length; j++){
                                if (temporalNoteRegister[j].materia === curso){
                                    if(temporalNoteRegister[j].grado === 'septimo'){
                                        setimo = temporalNoteRegister[j].calificacion;
                                    }
                                    else if(temporalNoteRegister[j].grado === 'octavo'){
                                        octavo = temporalNoteRegister[j].calificacion;
                                    }
                                    else if(temporalNoteRegister[j].grado === 'noveno'){
                                        if(temporalNoteRegister[j].semestre === 1){
                                            noveno_primer_trimestre = temporalNoteRegister[j].calificacion;
                                        }
                                        else if (temporalNoteRegister[j].semestre === 2){
                                            noveno_segundo_trimestre = temporalNoteRegister[j].calificacion;
                                        }
                                    }
                                }
                            }
                            cursos_checked.push(curso);
                            $scope.notas_setimo_octavo_noveno.push({curso: curso, nota_setimo: setimo, nota_octavo: octavo, nota_noveno_primer_trimestre: noveno_primer_trimestre, nota_noveno_segundo_trimestre: noveno_segundo_trimestre});
                        }
                    }
                }, function(error) {
                    console.log('Failed: ' + error);
                });
            }, function(error) {
                console.log('Failed: ' + error);
            });
            $scope.initGridOptions();
		};

        $scope.find = function(arr, obj, val){
            var com = '';
            if(val === 0){
                if(obj){
                    com = 'Masculino';
                }
                else{
                    com = 'Femenino';
                }
            }
            else if(val === 1){
                if(obj){
                    com = 'Tiene';
                }
                else{
                    com = 'No Tiene';
                }
            }
            for(var i = 0;i < arr.length; i++){
                if(arr[i].nombre===com){
                    return i;
                }
            }
        };

        $scope.findprovincia = function(prov, can, dis){
            var retorno = [];
            var arr = $scope.options;
            var i = 0;
            for(i;i<arr.length;i++){
                if(arr[i].nombre === prov){
                    var j = 0;
                    for(j;j<arr[i].cantones.length;j++){
                        if(arr[i].cantones[j].nombre === can){
                            var g = 0;
                            for(g;g<arr[i].cantones[j].distritos.length;g++){
                                if(arr[i].cantones[j].distritos[g].nombre === dis){
                                    retorno.push(i);
                                    retorno.push(j);
                                    retorno.push(g);
                                    return retorno;
                                }
                            }
                        }
                    }
                }
            }
        };

        $scope.setColegioProcedenciaComboBox = function(colegio){
            for(var i = 0; i < $scope.high_schools_list.length; i++){
                if ($scope.high_schools_list[i].name === colegio){
                    return $scope.high_schools_list[i];
                }
            }
        };

        //Notas de los cursos
        $scope.initNotas = function(){
            var estudiante = $scope.estudiante;
            $scope.editable = true;
            $scope.notas_setimo_octavo_noveno = [
                {curso: 'Inglés', nota_setimo: 0, nota_octavo: 0 , nota_noveno_primer_trimestre: 0, nota_noveno_segundo_trimestre: 0},
                {curso: 'Matemática', nota_setimo: 0, nota_octavo: 0, nota_noveno_primer_trimestre: 0, nota_noveno_segundo_trimestre: 0},
                {curso: 'Ciencias', nota_setimo: 0, nota_octavo: 0, nota_noveno_primer_trimestre: 0, nota_noveno_segundo_trimestre: 0},
                {curso: 'Cívica', nota_setimo: 0, nota_octavo: 0, nota_noveno_primer_trimestre: 0, nota_noveno_segundo_trimestre: 0},
                {curso: 'Español', nota_setimo: 0, nota_octavo: 0, nota_noveno_primer_trimestre: 0, nota_noveno_segundo_trimestre: 0},
                {curso: 'Estudios Sociales', nota_setimo: 0, nota_octavo: 0, nota_noveno_primer_trimestre: 0, nota_noveno_segundo_trimestre: 0},
                {curso: 'Conducta', nota_setimo: 0, nota_octavo: 0, nota_noveno_primer_trimestre: 0, nota_noveno_segundo_trimestre: 0},
                {curso: 'Promedio', nota_setimo: 0, nota_octavo: 0, nota_noveno_primer_trimestre: 0, nota_noveno_segundo_trimestre: 0}];
            $scope.notas_decimo_undecimo = [
                {curso: 'Español', nota_decimo_primer_semestre: 0, nota_decimo_segundo_semestre: 0, nota_undecimo_primer_semestre: 0, nota_undecimo_segundo_semestre: 0},
                {curso: 'Matemáticas', nota_decimo_primer_semestre: 0, nota_decimo_segundo_semestre: 0, nota_undecimo_primer_semestre: 0, nota_undecimo_segundo_semestre: 0},
                {curso: 'Física', nota_decimo_primer_semestre: 0, nota_decimo_segundo_semestre: 0, nota_undecimo_primer_semestre: 0, nota_undecimo_segundo_semestre: 0},
                {curso: 'Química', nota_decimo_primer_semestre: 0, nota_decimo_segundo_semestre: 0, nota_undecimo_primer_semestre: 0, nota_undecimo_segundo_semestre: 0},
                {curso: 'Biología', nota_decimo_primer_semestre: 0, nota_decimo_segundo_semestre: 0, nota_undecimo_primer_semestre: 0, nota_undecimo_segundo_semestre: 0},
                {curso: 'Biotecnología', nota_decimo_primer_semestre: 0, nota_decimo_segundo_semestre: 0, nota_undecimo_primer_semestre: 0, nota_undecimo_segundo_semestre: 0},
                {curso: 'Computación', nota_decimo_primer_semestre: 0, nota_decimo_segundo_semestre: 0, nota_undecimo_primer_semestre: 0, nota_undecimo_segundo_semestre: 0},
                {curso: 'Robótica', nota_decimo_primer_semestre: 0, nota_decimo_segundo_semestre: 0, nota_undecimo_primer_semestre: 0, nota_undecimo_segundo_semestre: 0},
                {curso: 'Dibujo Técnico', nota_decimo_primer_semestre: 0, nota_decimo_segundo_semestre: 0, nota_undecimo_primer_semestre: 0, nota_undecimo_segundo_semestre: 0},
                {curso: 'Inglés', nota_decimo_primer_semestre: 0, nota_decimo_segundo_semestre: 0, nota_undecimo_primer_semestre: 0, nota_undecimo_segundo_semestre: 0},
                {curso: 'Investigación', nota_decimo_primer_semestre: 0, nota_decimo_segundo_semestre: 0, nota_undecimo_primer_semestre: 0, nota_undecimo_segundo_semestre: 0},
                {curso: 'Historia', nota_decimo_primer_semestre: 0, nota_decimo_segundo_semestre: 0, nota_undecimo_primer_semestre: 0, nota_undecimo_segundo_semestre: 0},
                {curso: 'Geografía', nota_decimo_primer_semestre: 0, nota_decimo_segundo_semestre: 0, nota_undecimo_primer_semestre: 0, nota_undecimo_segundo_semestre: 0},
                {curso: 'Educ. Religiosa', nota_decimo_primer_semestre: 0, nota_decimo_segundo_semestre: 0, nota_undecimo_primer_semestre: 0, nota_undecimo_segundo_semestre: 0},
                {curso: 'Educ. Cívica', nota_decimo_primer_semestre: 0, nota_decimo_segundo_semestre: 0, nota_undecimo_primer_semestre: 0, nota_undecimo_segundo_semestre: 0},
                {curso: 'Educ. Física', nota_decimo_primer_semestre: 0, nota_decimo_segundo_semestre: 0, nota_undecimo_primer_semestre: 0, nota_undecimo_segundo_semestre: 0},
                {curso: 'Matemática(PROF.)', nota_decimo_primer_semestre: 0, nota_decimo_segundo_semestre: 0, nota_undecimo_primer_semestre: 0, nota_undecimo_segundo_semestre: 0},
                {curso: 'Física(PROF.)', nota_decimo_primer_semestre: 0, nota_decimo_segundo_semestre: 0, nota_undecimo_primer_semestre: 0, nota_undecimo_segundo_semestre: 0},
                {curso: 'Química(PROF.)', nota_decimo_primer_semestre: 0, nota_decimo_segundo_semestre: 0, nota_undecimo_primer_semestre: 0, nota_undecimo_segundo_semestre: 0},
                {curso: 'Biología(PROF.)', nota_decimo_primer_semestre: 0, nota_decimo_segundo_semestre: 0, nota_undecimo_primer_semestre: 0, nota_undecimo_segundo_semestre: 0},
                {curso: 'Conducta', nota_decimo_primer_semestre: 0, nota_decimo_segundo_semestre: 0, nota_undecimo_primer_semestre: 0, nota_undecimo_segundo_semestre: 0},
                {curso: 'Promedio', nota_decimo_primer_semestre: 0, nota_decimo_segundo_semestre: 0, nota_undecimo_primer_semestre: 0, nota_undecimo_segundo_semestre: 0}];
            $scope.initGridOptions();
        };

        $scope.initGridOptions = function(){
            $scope.gridOptionsSON = $scope.getGridOptionsNotasSON('notas_setimo_octavo_noveno');
            $scope.gridOptionsDU = $scope.getGridOptionsNotasDU('notas_decimo_undecimo');
        };

        $scope.getGridOptionsNotasSON = function(data){
            var editCellTemplate = '<input type="number" ng-class="\'colt\' + col.index"  min="1" max="100" ng-input="COL_FIELD" ng-model="COL_FIELD" >';
            var width = 125;
            return {
                data: data,
                enableCellSelection: true,
                enableRowSelection: false,
                enableCellEditOnFocus: $scope.editable,
                columnDefs: [{field: 'curso', displayName: 'Asignatura', enableCellEdit: false},
                    {field: 'nota_setimo', displayName: 'Notas de sétimo', enableCellEdit: $scope.editable,
                        editableCellTemplate: editCellTemplate,
                        cellClass: 'grid-align',
                        width: width,
                        cellTemplate:'<div class="ngCellText" ng-class="{\'red\' : row.getProperty(\'nota_setimo\') < 70 && row.getProperty(\'nota_setimo\') != 0, \'yellow\' : row.getProperty(\'nota_setimo\') >= 70 && row.getProperty(\'nota_setimo\') < 85  && row.getProperty(\'nota_setimo\') != 0, \'green\' : row.getProperty(\'nota_setimo\') >=85 && row.getProperty(\'nota_setimo\') != 0  }">{{ row.getProperty(col.field) }}</div>'},
                    {field:'nota_octavo', displayName:'Notas de octavo', enableCellEdit: $scope.editable,
                        editableCellTemplate: editCellTemplate,
                        cellClass: 'grid-align',
                        width: width,
                        cellTemplate:'<div class="ngCellText" ng-class="{\'red\' : row.getProperty(\'nota_octavo\') < 70 && row.getProperty(\'nota_octavo\') != 0, \'yellow\' : row.getProperty(\'nota_octavo\') >= 70 && row.getProperty(\'nota_octavo\') < 85  && row.getProperty(\'nota_octavo\') != 0, \'green\' : row.getProperty(\'nota_octavo\') >=85 && row.getProperty(\'nota_octavo\') != 0  }">{{ row.getProperty(col.field) }}</div>'},
                    {field:'nota_noveno_primer_trimestre', displayName:'I Trimestre', enableCellEdit: $scope.editable,
                        editableCellTemplate: editCellTemplate,
                        cellClass: 'grid-align',
                        width: width,
                        cellTemplate:'<div class="ngCellText" ng-class="{\'red\' : row.getProperty(\'nota_noveno_primer_trimestre\') < 70 && row.getProperty(\'nota_noveno_primer_trimestre\') != 0, \'yellow\' : row.getProperty(\'nota_noveno_primer_trimestre\') >= 70 && row.getProperty(\'nota_noveno_primer_trimestre\') < 85  && row.getProperty(\'nota_noveno_primer_trimestre\') != 0, \'green\' : row.getProperty(\'nota_noveno_primer_trimestre\') >=85 && row.getProperty(\'nota_noveno_primer_trimestre\') != 0  }">{{ row.getProperty(col.field) }}</div>'},
                    {field:'nota_noveno_segundo_trimestre', displayName:'II Trimestre', enableCellEdit: $scope.editable,
                        editableCellTemplate: editCellTemplate,
                        cellClass: 'grid-align',
                        width: width,
                        cellTemplate:'<div class="ngCellText" ng-class="{\'red\' : row.getProperty(\'nota_noveno_segundo_trimestre\') < 70 && row.getProperty(\'nota_noveno_segundo_trimestre\') != 0, \'yellow\' : row.getProperty(\'nota_noveno_segundo_trimestre\') >= 70 && row.getProperty(\'nota_noveno_segundo_trimestre\') < 85  && row.getProperty(\'nota_noveno_segundo_trimestre\') != 0, \'green\' : row.getProperty(\'nota_noveno_segundo_trimestre\') >=85 && row.getProperty(\'nota_noveno_segundo_trimestre\') != 0  }">{{ row.getProperty(col.field) }}</div>'}]
            };
        };

        $scope.getGridOptionsNotasDU = function(data){
            var width = 120;
            return {
                data: data,
                enableCellSelection: true,
                enableRowSelection: false,
                enableCellEditOnFocus: $scope.editable,
                columnDefs: [{field: 'curso', displayName: 'Asignatura', enableCellEdit: false},
                    {field:'nota_decimo_primer_semestre', displayName:'I', enableCellEdit: $scope.editable,
                        width: width,
                        cellClass: 'grid-align',
                        editableCellTemplate:'<input type="number" ng-class="\'colt\' + col.index"  min="1" max="100" ng-input="COL_FIELD" ng-model="COL_FIELD" >',
                        cellTemplate:'<div class="ngCellText" ng-class="{\'red\' : row.getProperty(\'nota_decimo_primer_semestre\') <70 && row.getProperty(\'nota_decimo_primer_semestre\') != 0,   \'green\' : row.getProperty(\'nota_decimo_primer_semestre\') >=70 && row.getProperty(\'nota_decimo_primer_semestre\') != 0  }">{{ row.getProperty(col.field) }}</div>'},
                    {field:'nota_decimo_segundo_semestre', displayName:'II', enableCellEdit: $scope.editable,
                        width: width,
                        cellClass: 'grid-align',
                        editableCellTemplate:'<input type="number" ng-class="\'colt\' + col.index"  min="1" max="100" ng-input="COL_FIELD" ng-model="COL_FIELD" >',
                        cellTemplate:'<div class="ngCellText" ng-class="{\'red\' : row.getProperty(\'nota_decimo_segundo_semestre\') <70 && row.getProperty(\'nota_decimo_segundo_semestre\') != 0,   \'green\' : row.getProperty(\'nota_decimo_segundo_semestre\') >=70 && row.getProperty(\'nota_decimo_segundo_semestre\') != 0  }">{{ row.getProperty(col.field) }}</div>'},
                    {field:'nota_undecimo_primer_semestre', displayName:'I', enableCellEdit: $scope.editable,
                        width: width,
                        cellClass: 'grid-align',
                        editableCellTemplate:'<input type="number" ng-class="\'colt\' + col.index"  min="1" max="100" ng-input="COL_FIELD" ng-model="COL_FIELD" >',
                        cellTemplate:'<div class="ngCellText" ng-class="{\'red\' : row.getProperty(\'nota_undecimo_primer_semestre\') <70 && row.getProperty(\'nota_undecimo_primer_semestre\') != 0,   \'green\' : row.getProperty(\'nota_undecimo_primer_semestre\') >=70 && row.getProperty(\'nota_undecimo_primer_semestre\') != 0  }">{{ row.getProperty(col.field) }}</div>'},
                    {field:'nota_undecimo_segundo_semestre', displayName:'II', enableCellEdit: $scope.editable,
                        width: width,
                        cellClass: 'grid-align',
                        editableCellTemplate:'<input type="number" ng-class="\'colt\' + col.index"  min="1" max="100" ng-input="COL_FIELD" ng-model="COL_FIELD" >',
                        cellTemplate:'<div class="ngCellText" ng-class="{\'red\' : row.getProperty(\'nota_undecimo_segundo_semestre\') <70 && row.getProperty(\'nota_undecimo_segundo_semestre\') != 0,   \'green\' : row.getProperty(\'nota_undecimo_segundo_semestre\') >=70 && row.getProperty(\'nota_undecimo_segundo_semestre\') != 0  }">{{ row.getProperty(col.field) }}</div>'}]
            };
        };

        $scope.notes_c_c = function(){
            $scope.notas_decimo_undecimo = [];
            $scope.editable = true;
            var estudiante = Estudiantes.get({
                estudianteId: $stateParams.estudianteId
            });
            estudiante.$promise.then(function(estudiante) {
                $scope.notas = GetNotas.query({
                    cedula_estudiante: estudiante.nacionalidad
                });
                $scope.notas.$promise.then(function (notas) {
                    var temporalNoteRegister = [];
                    angular.forEach(notas, function (nota) {
                        if ((nota.grado === 'decimo') && (nota.semestre === 1)) {
                            temporalNoteRegister.push({materia: nota.curso, grado: nota.grado, calificacion: nota.nota, semestre: nota.semestre});
                        }
                        else if ((nota.grado === 'decimo') && (nota.semestre === 2)) {
                            temporalNoteRegister.push({materia: nota.curso, grado: nota.grado, calificacion: nota.nota, semestre: nota.semestre});
                        }
                        else if ((nota.grado === 'undecimo') && (nota.semestre === 1)) {
                            temporalNoteRegister.push({materia: nota.curso, grado: nota.grado, calificacion: nota.nota, semestre: nota.semestre});
                        }
                        else if ((nota.grado === 'undecimo') && (nota.semestre === 2)) {
                            temporalNoteRegister.push({materia: nota.curso, grado: nota.grado, calificacion: nota.nota, semestre: nota.semestre});
                        }
                    });
                    var cursos_checked = [];
                    var promedio_decimo = 0;
                    var promedio_undecimo = 0;
                    for (var i = 0; i < temporalNoteRegister.length; i++){
                        var curso = temporalNoteRegister[i].materia;
                        var decimo_primer_semestre = 0;
                        var decimo_segundo_semestre = 0;
                        var undecimo_primer_semestre = 0;
                        var undecimo_segundo_semestre = 0;
                        if(cursos_checked.indexOf(curso) === -1){
                            for (var j = 0; j < temporalNoteRegister.length; j++){
                                if (temporalNoteRegister[j].materia === curso){
                                    if(temporalNoteRegister[j].grado === 'decimo' && temporalNoteRegister[j].semestre === 1){
                                        decimo_primer_semestre = temporalNoteRegister[j].calificacion;
                                    }
                                    else if(temporalNoteRegister[j].grado === 'decimo' && temporalNoteRegister[j].semestre === 2){
                                        decimo_segundo_semestre = temporalNoteRegister[j].calificacion;
                                    }
                                    else if(temporalNoteRegister[j].grado === 'undecimo' && temporalNoteRegister[j].semestre === 1){
                                        undecimo_primer_semestre = temporalNoteRegister[j].calificacion;
                                    }
                                    else if(temporalNoteRegister[j].grado === 'undecimo' && temporalNoteRegister[j].semestre === 2){
                                        undecimo_segundo_semestre = temporalNoteRegister[j].calificacion;
                                    }
                                    if (curso === 'Promedio'){
                                        if (temporalNoteRegister[j].grado === 'decimo'){
                                            promedio_decimo += temporalNoteRegister[j].calificacion;
                                        }
                                        else{
                                            promedio_undecimo += temporalNoteRegister[j].calificacion;
                                        }
                                    }
                                }
                            }
                            cursos_checked.push(curso);
                            $scope.notas_decimo_undecimo.push({curso: curso, nota_decimo_primer_semestre: decimo_primer_semestre, nota_decimo_segundo_semestre: decimo_segundo_semestre,
                                                                    nota_undecimo_primer_semestre: undecimo_primer_semestre, nota_undecimo_segundo_semestre: undecimo_segundo_semestre});
                        }
                    }
                }, function (error) {
                    console.log('Failed: ' + error);
                });
            });
            $scope.initGridOptions();
        };

        $scope.ngGridEstudiantes = function(matriculado){
            if(matriculado)
            {
                $scope.gridOptionsList = {
                    data: 'estudiantes',
                    enableCellSelection: true,
                    enableRowSelection: false,
                    enableCellEditOnFocus: false,
                    columnDefs: [{ field: 'name', displayName:'Nombre'},
                        { field: 'nacionalidad', displayName:'Cédula'},
                        { field: 'admitido', displayName:'Admitido', cellTemplate: '<input type="checkbox" ng-model="row.entity.admitido">'},
                        { field: '_id', displayName:'Ver', cellTemplate: '<a data-ng-href="#!/estudiantes/{{row.entity._id}}">ver</a>'}]
                };
            }
            else{
                $scope.gridOptionsList = {
                    data: 'estudiantes',
                    enableCellSelection: true,
                    enableRowSelection: false,
                    enableCellEditOnFocus: false,
                    columnDefs: [{ field: 'name', displayName:'Nombre'},
                        { field: 'nacionalidad', displayName:'Cédula'},
                        { field: 'anno_ingreso', displayName:'Año',cellTemplate: '<div class="ngCellText">{{row.getProperty(col.field) | anno}}</div>'},
                        { field: 'traladado', displayName:'Trasladar', cellTemplate: '<input type="checkbox" ng-model="row.entity.traladado">'},
                        { field: '_id', displayName:'Ver', cellTemplate: '<a data-ng-href="#!/estudiantes/{{row.entity._id}}">ver</a>'}]
                };
            }
        };

        $scope.calcularPromedio = function(){
            var promedio_decimo_primer_semestre = 0;
            var promedio_decimo_segundo_semestre = 0;
            var promedio_undecimo_primer_semestre = 0;
            var promedio_undecimo_segundo_semestre = 0;
            var promedio_row = 0;
            angular.forEach($scope.notas_decimo_undecimo, function(nota){
                if(nota.curso !== 'Promedio') {
                    promedio_decimo_primer_semestre += nota.nota_decimo_primer_semestre;
                    promedio_decimo_segundo_semestre += nota.nota_decimo_segundo_semestre;
                    promedio_undecimo_primer_semestre += nota.nota_undecimo_primer_semestre;
                    promedio_undecimo_segundo_semestre += nota.nota_undecimo_segundo_semestre;
                }
                else if(nota.curso === 'Promedio'){
                    promedio_row = nota;
                }
            });
            promedio_decimo_primer_semestre = Math.round(promedio_decimo_primer_semestre/($scope.notas_decimo_undecimo.length-1) * 100) / 100;
            promedio_decimo_segundo_semestre = Math.round(promedio_decimo_segundo_semestre/($scope.notas_decimo_undecimo.length-1) * 100) / 100;
            promedio_undecimo_primer_semestre = Math.round(promedio_undecimo_primer_semestre/($scope.notas_decimo_undecimo.length-1) * 100) / 100;
            promedio_undecimo_segundo_semestre = Math.round(promedio_undecimo_segundo_semestre/($scope.notas_decimo_undecimo.length-1) * 100) / 100;
            promedio_row.nota_decimo_primer_semestre = promedio_decimo_primer_semestre;
            promedio_row.nota_decimo_segundo_semestre = promedio_decimo_segundo_semestre;
            promedio_row.nota_undecimo_primer_semestre = promedio_undecimo_primer_semestre;
            promedio_row.nota_undecimo_segundo_semestre = promedio_undecimo_segundo_semestre;
            $scope.tenth_annual_average = Math.round((promedio_decimo_primer_semestre + promedio_decimo_segundo_semestre)/2* 100) / 100;;
            $scope.eleventh_annual_average = Math.round((promedio_undecimo_primer_semestre + promedio_undecimo_segundo_semestre)/2* 100) / 100;;

        };

        $scope.matricular = function(){
            var estudiantes = $scope.estudiantes;
            angular.forEach(estudiantes, function (estudiante) {
                if(estudiante.admitido)
                    Estudiantes.update({ estudianteId: estudiante._id }, estudiante).$promise.then(function(estudiante) {
                        location.reload();
                    });
            });
        };

        $scope.trasladar = function(){
            var estudiantes = $scope.estudiantes;
            angular.forEach(estudiantes, function (estudiante) {
                if(estudiante.traladado) {
                    estudiante.fecha_traladado = new Date(). getDate();
                    Estudiantes.update({ estudianteId: estudiante._id }, estudiante).$promise.then(function (estudiante) {
                        location.reload();
                    });
                }
            });
        };

        $scope.asignar_notas = function(){
            var estudiante = Estudiantes.get({
                estudianteId: $stateParams.estudianteId
            });
            var notas = $scope.notas;
            angular.forEach(notas, function (nota) {
                for(var i = 0;i < $scope.notas_decimo_undecimo.length; i++){
                    if((nota.grado === 'decimo')&&($scope.notas_decimo_undecimo[i].curso === nota.curso)&&(nota.semestre === 1)){
                        nota.nota = $scope.notas_decimo_undecimo[i].nota_decimo_primer_semestre;
                    }
                    else if((nota.grado === 'decimo')&&($scope.notas_decimo_undecimo[i].curso===nota.curso)&&(nota.semestre === 2)){
                        nota.nota = $scope.notas_decimo_undecimo[i].nota_decimo_segundo_semestre;
                    }
                    else if((nota.grado === 'undecimo')&&($scope.notas_decimo_undecimo[i].curso === nota.curso)&&(nota.semestre === 1)){
                        nota.nota = $scope.notas_decimo_undecimo[i].nota_undecimo_primer_semestre;
                    }
                    else if((nota.grado === 'undecimo')&&($scope.notas_decimo_undecimo[i].curso===nota.curso)&&(nota.semestre === 2)){
                        nota.nota = $scope.notas_decimo_undecimo[i].nota_undecimo_segundo_semestre;
                    }
                }
                Notas.update({ notaId: nota._id }, nota);
            });
            $location.path('estudiantes/' + $stateParams.estudianteId);
        };

        $scope.subir_archivos = function(){
            var file = $scope.selected_certificacion_nacimiento[0];
            $scope.upload = $upload.upload({
                url: '/upload',
                method: 'POST',
                file: file
            }).success(function(data) {
                var estudiante = $scope.estudiante;
                estudiante.certificacion_nacimiento = data.name;
                estudiante.$update(function() {
                    $location.path('estudiantes/' + estudiante._id);
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            });
            file = $scope.selected_certificacion_notas[0];
            $scope.upload = $upload.upload({
                url: '/upload',
                method: 'POST',
                file: file
            }).success(function(data) {
                var estudiante = $scope.estudiante;
                estudiante.certificacion_notas = data.name;
                estudiante.$update(function() {
                    $location.path('estudiantes/' + estudiante._id);
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            });
            file = $scope.selected_inf_hogar[0];
            $scope.upload = $upload.upload({
                url: '/upload',
                method: 'POST',
                file: file
            }).success(function(data) {
                var estudiante = $scope.estudiante;
                estudiante.informe_hogar = data.name;
                estudiante.$update(function() {
                    $location.path('estudiantes/' + estudiante._id);
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            });
            file = $scope.selected_vacunas[0];
            $scope.upload = $upload.upload({
                url: '/upload',
                method: 'POST',
                file: file
            }).success(function(data) {
                var estudiante = $scope.estudiante;
                estudiante.tarjeta_vacunas = data.name;
                estudiante.$update(function() {
                    location.reload();
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            });
        };
        //-----------------------------------------------------------------CONSULTAS DE ESTUDIANTES-------------------------------------------------------------------------
        $scope.init_generaciones = function(){
            $scope.estudiantes = Estudiantes.query();
        };

        $scope.column = '';
        $scope.filterOptions = {
            filterText:'',
            useExternalFilter: false
        };


        $scope.gridOptionsGeneracion = {
            data: 'estudiantes',
            enableCellSelection: true,
            enableRowSelection: false,
            enableCellEditOnFocus: false,
            columnDefs: [{ field: 'name', displayName:'Nombre'},
                { field: 'primer_apellido', displayName:'Primer Apellido'},
                { field: 'segundo_apellido', displayName:'Segundo Apellido'},
                { field: 'nacionalidad', displayName:'Cédula'},
                { field: 'graduado', displayName:'Graduado',cellTemplate: '<div class="ngCellText">{{row.getProperty(col.field) | true_false}}</div>'},
                { field: 'colegio_procedencia', displayName:'Colegio de Procedencia'},
                { field: 'anno_ingreso', displayName:'Año de ingreso'},
                { field: 'sexo', displayName:'Sexo',cellTemplate: '<div class="ngCellText">{{row.getProperty(col.field) | sexo}}</div>'},
                { field: 'traladado', displayName:'Trasladado',cellTemplate: '<div class="ngCellText">{{row.getProperty(col.field) | true_false}}</div>'},
                { field: 'graduado', displayName:'Graduado',cellTemplate: '<div class="ngCellText">{{row.getProperty(col.field) | true_false}}</div>'},
                { field: '_id', displayName:'Ver', cellTemplate: '<a data-ng-href="#!/estudiantes/{{row.entity._id}}">ver</a>'}],
            filterOptions: $scope.filterOptions
        };

        $scope.filterOptions.filterText = '';
        $scope.$watchCollection('[filteringText, consulta_sexo, consulta_grado, consulta_estado]', function(values) {
            var searchQuery = '';
            if(values[0] === ''){
                $scope.filterOptions.filterText = '';
            }
            else if (values[0]) {
                if($scope.consulta.nombre === 'Nombre') {
                    searchQuery = 'name: ' + values[0] + ';';
                }
                else if($scope.consulta.nombre === 'Cedula') {
                    searchQuery = 'nacionalidad: ' + values[0] + ';';
                }
                else if($scope.consulta.nombre === 'Colegio de Procedencia') {
                    searchQuery = 'colegio_procedencia: ' + values[0] + ';';
                }
                else if($scope.consulta.nombre === 'Trasladado') {
                    searchQuery = 'traladado: '+ true +';';
                }
            }

            if(values[1]){
                if ($scope.consulta_sexo.sexo === 'Masculino')
                    searchQuery = searchQuery + 'sexo: ' + true +';';
                else if ($scope.consulta_sexo.sexo === 'Femenino')
                    searchQuery = searchQuery + 'sexo: ' + false +';';
            }

            if(values[2]){
                if ($scope.consulta_grado.grado === 'Décimo')
                    searchQuery = searchQuery + 'anno_ingreso: ' + new Date().getFullYear() +';';
                else if ($scope.consulta_grado.grado === 'Undécimo')
                    searchQuery = searchQuery + 'anno_ingreso: ' + (new Date().getFullYear() - 1) +';';
                else
                    searchQuery = searchQuery + 'anno_ingreso: ' + (new Date().getFullYear() - 1) +'|'+ new Date().getFullYear()+';';
            }

            if(values[3]){
                if($scope.consulta_estado.estado === 'Egresado'){
                    searchQuery = searchQuery + 'graduado: ' + true +';';
                }

                else if($scope.consulta_estado.estado === 'Trasladado')
                    searchQuery = searchQuery + 'traladado: ' + true +';';
            }
            $scope.filterOptions.filterText = searchQuery;
        });


        //-----------------------------------------------------------------REPORTE DE ESTUDIANTES-------------------------------------------------------------------------
        $scope.get_all_students = function(){
            $scope.estudiantes = Estudiantes.query();
        };
        $scope.lista_reportes = Reports.getReportsList();
        $scope.grade_reports_list = Reports.getGradesList();
        $scope.reporte = $scope.lista_reportes[0];
        $scope.grade_report = $scope.grade_reports_list[0];
        $scope.ced_estudiante = '';
        $scope.visibl = false;

        $scope.$watch('ced_estudiante', function(ced_estudiante){
                $scope.show = true;
                $scope.reporte_notas();
        });

        $scope.$watch('reporte', function(){
            createReport();
        });
        $scope.$watch('grade_report', function(){
            createReport();
        });

        function createReport(){
            var reporte = $scope.reporte;
            var grade = $scope.grade_report;
            var serviceReport = Reports;
            $scope.visibl = false;
            $scope.show = true;
            $scope.grade_visible = true;
            if(grade.grade_val  === 1){
                serviceReport.studentsList = Decimo.query();
            }
            else if(grade.grade_val === 2){
                serviceReport.studentsList = Undecimo.query();
            }
            serviceReport.studentsList.$promise.then(function (students){
                var pdfReport;
                if (reporte.val === 1){
                    pdfReport = serviceReport.attendanceListReport(students, grade.grade_opt.toUpperCase());
                }
                else if (reporte.val === 2){
                    pdfReport = serviceReport.personalInfoListReport(students);
                }
                else if (reporte.val === 3){
                    pdfReport = serviceReport.scienceForBachelorListReport(students, grade.grade_opt.toUpperCase());
                }
                else if (reporte.val === 4){
                    pdfReport = serviceReport.emailListReport(students, grade.grade_opt.toUpperCase());
                }
                else if (reporte.val === 5){
                    pdfReport = serviceReport.scienceForBachelorChoiceListReport(students);
                }
                else if (reporte.val === 6){
                    pdfReport = serviceReport.StudentsForLibraryListReport(students, grade.grade_opt.toUpperCase());
                }
                else if (reporte.val === 7){
                    pdfReport = serviceReport.OlympicsParticipationListReport(students, grade.grade_opt.toUpperCase());
                }
                else if (reporte.val === 8){
                    $scope.grade_visible = false;
                    $scope.visibl = true;
                    $scope.show = false;
                }
                if (pdfReport !== undefined){
                    if (pdfReport['Data'].length > 0){
                        $scope.generatePDF(pdfReport);
                    }
                }
            });
        }

        $scope.show = false;
        $scope.base64 = $sce.trustAsResourceUrl('');
        $scope.nombre_reporte_notas_undecimo = '';
        $scope.nombre_reporte_notas_decimo = '';

        $scope.generatePDF = function(PDFReport) {
            var doc = new jsPDF('p', 'pt');
            var logo_img = document.getElementById('cc-logo');
            var img_data = getBase64Image(logo_img);
            doc.addImage(img_data, 'JPEG',15,15,25,25);
            doc.text(40, 19, PDFReport.Header);
            doc.text(15, 80, PDFReport.Title);
            doc.autoTable(PDFReport.Columns, PDFReport.Data, {margins: {right: 10, left: 10, top: 100, bottom: 100}, startY: PDFReport.StartY});
            $scope.base64 = $sce.trustAsResourceUrl('data:application/pdf;base64,' + btoa(doc.output()));
        };
        $scope.reporte_notas = function(){
            if($scope.ced_estudiante !== undefined && $scope.ced_estudiante !== ''){
                var serviceReport = Reports;
                serviceReport.studentNotes = GetNotas.query({ cedula_estudiante: $scope.ced_estudiante });
                serviceReport.studentNotes.$promise.then(function(notes){
                    var pdfReport;
                    $scope.estudiante =  Nacionalidad.query( {cedula: $scope.ced_estudiante });
                    $scope.estudiante.$promise.then(function(student){
                        if (student[0] !== undefined){
                            fixInvalidCharactersfixInvalidCharacters(notes);
                            pdfReport = serviceReport.notesReport(notes, student);
                            var doc = new jsPDF('p', 'pt');
                            doc.setFontSize(16);
                            var logo_img = document.getElementById('cc-logo');
                            var img_data = getBase64Image(logo_img);
                            doc.addImage(img_data, 'JPEG',15,15,25,25);
                            var infoestudiante = 'Cedula: ' + student[0].nacionalidad +'\nNombre del Alumno: '+ student[0].segundo_apellido + ' ' + student[0].primer_apellido + ' ' + student[0].name;
                            doc.text(40, 19, pdfReport.Header);
                            doc.text(120, 60, pdfReport.Title + ' Decimo ' + student[0].anno_ingreso);
                            doc.text(15, 90, infoestudiante);
                            doc.setFontSize(10);
                            doc.text(327, 140, 'Ausencias I Semestre              Ausencias II Semestre');
                            doc.autoTable(pdfReport.Columns, pdfReport.Data[0], {margins: {right: 10, left: 10, top: 40, bottom: 40}, startY: 150});
                            if (student[0].anno_ingreso < new Date().getFullYear()){
                                doc.addPage();
                                doc.setFontSize(16);
                                doc.addImage(img_data, 'JPEG',15,15,25,25);
                                infoestudiante = 'Cédula: ' + $scope.ced_estudiante +'\nNombre del Alumno: '+ student[0].segundo_apellido + ' ' + student[0].primer_apellido + ' ' + student[0].name;
                                doc.text(40, 19, pdfReport.Header);
                                doc.text(120, 60, pdfReport.Title + ' Undecimo ' + (student[0].anno_ingreso+1));
                                doc.text(15, 90, infoestudiante);
                                doc.setFontSize(10);
                                doc.text(327, 140, 'Ausencias I Semestre              Ausencias II Semestre');
                                doc.autoTable(pdfReport.Columns, pdfReport.Data[1], {margins: {right: 10, left: 10, top: 40, bottom: 40}, startY: 150});
                            }
                            $scope.base64 = $sce.trustAsResourceUrl('data:application/pdf;base64,' + btoa(doc.output()));
                        }
                    });
                });
            }
        }
	}
]).filter('true_false', function() {
    return function(text, length, end) {
        if (text) {
            return 'Si';
        }
        return 'No';
    };
}).filter('sexo', function() {
    return function(text, length, end) {
        if (text) {
            return 'Masculino';
        }
        return 'Femenino';
    };
}).filter('anno', function() {
    return function(text, length, end) {
        if (parseInt(text) === (new Date().getFullYear()-1)) {
            return 'Undécimo';
        }
        return 'Décimo';
    };
});

function fixInvalidCharactersfixInvalidCharacters(noteList){
    var accentMap = { 'á':'a', 'é':'e', 'í':'i','ó':'o','ú':'u', 'ñ': 'n'};
    for(var j = 0; j < noteList.length; j++){
        var ret = '';
        for (var i = 0; i < noteList[j].curso.length; i++) {
            ret += accentMap[noteList[j].curso.charAt(i)] || noteList[j].curso.charAt(i);
        }
        noteList[j].curso = ret;
    }
        return ret;
}

function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    if (img !== undefined) {
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
    }
    var dataURL = canvas.toDataURL("image/jpeg");
    return dataURL;
}

'use strict';

//Estudiantes service used to communicate Estudiantes REST endpoints
angular.module('estudiantes').factory('Estudiantes', ['$resource',
	function($resource) {
		return $resource('estudiantes/:estudianteId', { estudianteId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

//Estudiantes service used to communicate Estudiantes REST endpoints
angular.module('estudiantes').factory('GetAdmitidos', ['$resource',
    function($resource) {
        return $resource('/admitidos/:admitido', { admitido: '@admitido'
        }, {
            update: {
                method: 'GET'
            }
        });
    }
]);

//Notas service used to communicate Notas REST endpoints
angular.module('estudiantes').factory('Notas', ['$resource',
    function($resource) {
        return $resource('/notas/:notaId', null,
        {
            update: {
                method: 'PUT'
            },
            detele: {//ERROR
                method: 'DELETE'
            }
        });
    }
]);

angular.module('estudiantes').factory('GetNotas', ['$resource',
    function($resource) {
        return $resource('/notas/:cedula_estudiante', { cedula_estudiante: '@cedula_estudiante'
            }, {
                update: {
                    method: 'GET'
                }
            });
    }
]);

angular.module('estudiantes').factory('Decimo', ['$resource',
    function($resource) {
        return $resource('/estudiantes_decimo/', null,
        {
            update: {
                method: 'GET'
            }
        });
    }
]);

angular.module('estudiantes').factory('Undecimo', ['$resource',
    function($resource) {
        return $resource('/estudiantes_undecimo/', null,
        {
            update: {
                method: 'GET'
            }
        });
    }
]);

//Estudiantes service used to communicate Estudiantes REST endpoints
angular.module('estudiantes').factory('Nacionalidad', ['$resource',
    function($resource) {
        return $resource('/nacionalidad/:cedula', { cedula: '@cedula'
        }, {
            update: {
                method: 'GET'
            }
        });
    }
]);


angular.module('estudiantes').factory('Reports', function(){
        var HEADER = '';
        var TITLE = '';
        var columns = [];
        var data = [];

        var report = {
            attendanceListReport: function(estudiantes, grade_label) {
               data = [];
               TITLE = '                   CONTROL DE AUSENCIAS ' + grade_label + ' ' + new Date().getFullYear() +'\n' +
                   'Profesor: __________________                         Mes:________________ \n' +
                   'Asignatura: ________________                         A = Ausencia, T = Tardia';
               columns = [
                   {title: 'Cedula', key: 'ced'},
                   {title: 'Nombre', key: 'nom'},
                   {title: 'Del__ al __', key: 'i'},
                   {title: 'Del__ al __', key: 'ii'},
                   {title: 'Del__ al __', key: 'iii'},
                   {title: 'Del__ al __', key: 'iiii'}
               ];
               var women = 0;
               var men = 0;
               angular.forEach(estudiantes, function (estudiante_decimo) {
                   if ((estudiante_decimo.admitido) && (!estudiante_decimo.traladado)) {
                       if(estudiante_decimo.sexo === true){
                           men++;
                       }
                       else{
                           women += 1;
                       }
                       data.push({'ced': estudiante_decimo.nacionalidad, 'nom': estudiante_decimo.segundo_apellido + ' ' + estudiante_decimo.primer_apellido + ' ' + estudiante_decimo.name, 'i': '', 'ii': '', 'iii': '', 'iiii': ''});
                   }
               });
               var total = women + men;
               HEADER = this.initHeader(women, men, total);
               var result = this.getJSONFromData(HEADER, TITLE, columns, data, 130);
               return result;

           },

            personalInfoListReport: function(estudiantes){
                data = [];
                TITLE = [];
                HEADER = 'Colegio Cientifico de Costa Rica\n' +
                'Instituto Tecnologico de Costa Rica, Sede Regional San Carlos\n' +
                'Telefax: 2475-7089,Tel: 2401-3122\n';
                columns = [
                    {title: 'Cedula', key: 'ced'},
                    {title: 'I Apellido', key: 'i'},
                    {title: 'II Apellido', key: 'ii'},
                    {title: 'Nombre', key: 'nom'},
                    {title: 'Telefono', key: 'tel'},
                    {title: 'E-mail', key: 'mail'}
                ];
                angular.forEach(estudiantes, function (estudiante_decimo) {
                    if ((estudiante_decimo.admitido) && (!estudiante_decimo.traladado)) {
                        data.push({'ced': estudiante_decimo.nacionalidad, 'i': estudiante_decimo.primer_apellido, 'ii': estudiante_decimo.segundo_apellido, 'nom':estudiante_decimo.name, 'tel': estudiante_decimo.celular, 'mail': estudiante_decimo.correo});
                    }
                });
                var result = this.getJSONFromData(HEADER, TITLE, columns, data, 70);
                return result;
            },

            scienceForBachelorListReport: function (estudiantes, grade_label) {
                data = [];
                TITLE = '      LISTA CIENCIA PARA BACHILLERATO ' + grade_label + ' '  + new Date().getFullYear() +'\n';
                columns = [
                    {title: 'Cedula', key: 'ced'},
                    {title: 'Nombre', key: 'nom'},
                    {title: 'Ciencia', key: 'cie'},
                    {title: 'Firma', key: 'fir'}
                ];
                var women = 0;
                var men = 0;
                angular.forEach(estudiantes, function (estudiante_decimo) {
                    if ((estudiante_decimo.admitido) && (!estudiante_decimo.traladado)) {
                        if(estudiante_decimo.sexo === true){
                            men++;
                        }
                        else{
                            women += 1;
                        }
                        data.push({'ced':estudiante_decimo.nacionalidad,'nom': estudiante_decimo.segundo_apellido + ' ' + estudiante_decimo.primer_apellido + ' ' + estudiante_decimo.name, 'cie': '','fir': ''});
                    }
                });
                var total = women + men;
                HEADER = this.initHeader(women, men, total);
                var result = this.getJSONFromData(HEADER, TITLE, columns, data, 95);
                return result;
            },

            emailListReport: function(estudiantes) {
                data = [];
                HEADER = 'Colegio Cientifico de Costa Rica\n' +
                'Instituto Tecnologico de Costa Rica, Sede Regional San Carlos\n' +
                'Telefax: 2475-7089,Tel: 2401-3122\n';
                TITLE = '';
                columns = [
                    {title: 'Cedula', key: 'ced'},
                    {title: 'Nombre', key: 'nom'},
                    {title: 'E-mail', key: 'mail'}
                ];
                angular.forEach(estudiantes, function (estudiante_decimo) {
                    if ((estudiante_decimo.admitido) && (!estudiante_decimo.traladado)){
                        data.push({'ced':estudiante_decimo.nacionalidad, 'nom':estudiante_decimo.segundo_apellido + ' ' +
                        estudiante_decimo.primer_apellido + ' ' + estudiante_decimo.name, 'mail': estudiante_decimo.correo});
                    }
                });
                var result = this.getJSONFromData(HEADER, TITLE, columns, data, 70);
                return result;
            },

            scienceForBachelorChoiceListReport: function(estudiantes) {
                data = [];
                TITLE = '\n'+'              ESCOGENCIA DE CIENCIA BACHILLERATO ' + new Date().getFullYear() +'\n' +
                    '\nProfesores:\nAsignaturas:';
                columns = [
                    {title: 'Cedula', key: 'ced'},
                    {title: 'Nombre', key: 'nom'},
                    {title: 'Biologia', key: 'bio'},
                    {title: 'Quimica', key: 'quim'},
                    {title: 'Fisica', key: 'fis'}
                ];
                var women = 0;
                var men = 0;
                angular.forEach(estudiantes, function (estudiante_undecimo) {
                    if ((estudiante_undecimo.admitido) && (!estudiante_undecimo.traladado)) {
                        if (estudiante_undecimo.sexo === true) {
                            men++;
                        }
                        else {
                            women++;
                        }
                        data.push({
                            'ced': estudiante_undecimo.nacionalidad,
                            'nom': estudiante_undecimo.segundo_apellido + ' ' + estudiante_undecimo.primer_apellido + ' ' + estudiante_undecimo.name,
                            'bio': '',
                            'quim': '',
                            'fis': ''
                        });
                    }
                });
                var total = women + men;
                HEADER = this.initHeader(women, men, total);
                var result = this.getJSONFromData(HEADER, TITLE, columns, data, 165);
                return result;
            },

            StudentsForLibraryListReport: function(estudiantes, grade_label){
                data = [];
                TITLE = '       LISTA DE INFORMACION PARA LA BIBLIOTECA ' + grade_label + ' ' + new Date().getFullYear() +'\n';
                columns = [
                    {title: 'Cedula', key: 'ced'},
                    {title: 'Nombre', key: 'nom'},
                    {title: 'Email', key: 'email'},
                    {title: 'Direccion', key: 'dir'},
                    {title: 'Fecha de nacimiento', key: 'nac'},
                    {title: 'Edad', key: 'edad'}
                ];
                var women = 0;
                var men = 0;
                angular.forEach(estudiantes, function (estudiante_decimo) {
                    if ((estudiante_decimo.admitido) && (!estudiante_decimo.traladado)) {
                        if(estudiante_decimo.sexo === true){
                            men++;
                        }
                        else{
                            women += 1;
                        }
                        var fecha_split = estudiante_decimo.fecha_de_nacimiento.split('-');
                        var f = new Date();
                        if(fecha_split[2].length === 4)
                            f = new Date(fecha_split[2], fecha_split[1], fecha_split[0]);
                        else
                            f = new Date(fecha_split[0], fecha_split[1], fecha_split[2]);
                        var edad = new Date().getFullYear() - f.getFullYear();
                        data.push({'ced':estudiante_decimo.nacionalidad,'nom': estudiante_decimo.segundo_apellido + ' ' + estudiante_decimo.primer_apellido + ' ' + estudiante_decimo.name,
                            'email': estudiante_decimo.correo, 'dir': estudiante_decimo.direccion_exacta, 'nac': estudiante_decimo.fecha_de_nacimiento, 'edad': edad});
                    }
                });
                var total = women + men;
                HEADER = this.initHeader(women, men, total);
                var result = this.getJSONFromData(HEADER, TITLE, columns, data, 95);
                return result;
            },

            OlympicsParticipationListReport: function(estudiantes, grade_label){
                data = [];
                TITLE ='\n'+'              LISTA INTERESADOS OLIMPIADA ' + grade_label + ' ' + new Date().getFullYear() +'\n'+
                       '\nProfesores:\nAsignaturas:';
                columns = [
                    {title: 'Cedula', key: 'ced'},
                    {title: 'Nombre', key: 'nom'},
                    {title: 'Participacion Olimpiada', key: 'par'}
                ];
                var women = 0;
                var men = 0;
                angular.forEach(estudiantes, function (estudiante_decimo) {
                    if ((estudiante_decimo.admitido) && (!estudiante_decimo.traladado)) {
                        if(estudiante_decimo.sexo === true){
                            men++;
                        }
                        else{
                            women += 1;
                        }
                        data.push({'ced':estudiante_decimo.nacionalidad,'nom': estudiante_decimo.segundo_apellido + ' ' + estudiante_decimo.primer_apellido + ' ' + estudiante_decimo.name,
                            'par': ''});
                    }
                });
                var total = women + men;
                HEADER = this.initHeader(women, men, total);
                var result = this.getJSONFromData(HEADER, TITLE, columns, data, 165);
                return result;
            },

            notesReport: function(student_notes, student){

                HEADER = 'Colegio Cientifico de Costa Rica\nSede San Carlos';
                TITLE = 'Informe Provisional de Calificaciones';

                var notes = [
                    {curso: 'Espanol', nota: 0, semestre: 1},
                    {curso: 'Matematicas', nota: 0, semestre: 1},
                    {curso: 'Fisica', nota: 0, semestre: 1},
                    {curso: 'Quimica', nota: 0, semestre: 1},
                    {curso: 'Biologia', nota: 0, semestre: 1},
                    {curso: 'Bioteclogia', nota: 0, semestre: 1},
                    {curso: 'Computacion', nota: 0, semestre: 1},
                    {curso: 'Robotica', nota: 0, semestre: 1},
                    {curso: 'Dibujo Tecnico', nota: 0, semestre: 1},
                    {curso: 'Ingles', nota: 0, semestre: 1},
                    {curso: 'Investigacion', nota: 0, semestre: 1},
                    {curso: 'Historia', nota: 0, semestre: 1},
                    {curso: 'Geografia', nota: 0, semestre: 1},
                    {curso: 'Educ. Religiosa', nota: 0, semestre: 1},
                    {curso: 'Educ. Civica', nota: 0, semestre: 1},
                    {curso: 'Educ. Fisica', nota: 0, semestre: 1},
                    {curso: 'Matematica(PROF.)', nota: 0, semestre: 1},
                    {curso: 'Fisica(PROF.)', nota: 0, semestre: 1},
                    {curso: 'Quimica(PROF.)', nota: 0, semestre: 1},
                    {curso: 'Biologia(PROF.)', nota: 0, semestre: 1},
                    {curso: 'Conducta', nota: 0, semestre: 1},
                    {curso: 'Promedio', nota: 0, semestre: 1}];

                columns = [
                    {title: 'Asignatura', key: 'asig'},
                    {title: '  I  ', key: 'i'},
                    {title: '  II  ', key: 'ii'},
                    {title: 'PROM.', key: 'prom'},
                    {title: 'M', key: 'm'},
                    {title: 'I', key: 'iii'},
                    {title: 'T', key: 't'},
                    {title: 'M', key: 'm2'},
                    {title: 'I', key: 'iii2'},
                    {title: 'T', key: 't2'}
                ];
                var tenthGradeData = [];
                var eleventhGradeData = [];
                angular.forEach(notes, function (curso){
                    var classNoteTenthGrade = [];
                    for(var i = 0;i<student_notes.length;i++){
                        if((student_notes[i].curso === curso.curso && (student_notes[i].anno === new Date().getFullYear()))){
                            classNoteTenthGrade.push(student_notes[i]);
                        }
                        else if ((student_notes[i].curso === curso.curso && (student_notes[i].anno === new Date().getFullYear()-1))){
                            classNoteTenthGrade.push(student_notes[i]);
                        }
                        if(classNoteTenthGrade.length === 2){
                            var c = classNoteTenthGrade[0].curso;
                            var s1 = classNoteTenthGrade[0].nota;
                            var s2 = classNoteTenthGrade[1].nota;
                            var p = (classNoteTenthGrade[0].nota + classNoteTenthGrade[1].nota)/2;
                            tenthGradeData.push({'asig' : c, 'i': s1, 'ii':s2, 'prom': p, 'm': '', 'iii':'', 't':'', 'm2':'', 'iii2':'', 't2':''});
                            break;
                        }
                    }
                });
                if(student[0].anno_ingreso < new Date().getFullYear()) {
                    angular.forEach(notes, function (curso) {
                        var classNoteEleventhGrade = [];
                        for (var i = 0; i < student_notes.length; i++) {
                            if ((student_notes[i].curso === curso.curso) && (student_notes[i].anno === new Date().getFullYear())) {
                                classNoteEleventhGrade.push(student_notes[i]);
                            }
                            if (classNoteEleventhGrade.length === 2) {
                                var c = classNoteEleventhGrade[0].curso;
                                var s1 = classNoteEleventhGrade[0].nota;
                                var s2 = classNoteEleventhGrade[1].nota;
                                var p = (classNoteEleventhGrade[0].nota + classNoteEleventhGrade[1].nota) / 2;
                                eleventhGradeData.push({'asig': c, 'i': s1, 'ii': s2, 'prom': p, 'm': '', 'iii': '', 't': '', 'm2': '', 'iii2': '', 't2': ''});
                                break;
                            }
                        }
                    });
                }
                var pdfResultDecimo = this.getJSONFromData(HEADER, TITLE, columns, [tenthGradeData, eleventhGradeData], 150);
                return pdfResultDecimo;
            },

            //Utility functions for reports
            getReportsList: function(){
                var lista = [
                    {nombre: 'Lista de asistencia', val : 1},
                    {nombre: 'Lista de cedula, carne, apellidos, nombre, telefono, correo', val : 2},
                    {nombre: 'Lista de ciencia para bachillerato', val : 3},
                    {nombre: 'Lista de correos', val : 4},
                    {nombre: 'Lista de escogencia de la ciencia para bachillerato', val : 5},
                    {nombre: 'Lista para la biblioteca', val: 6},
                    {nombre: 'Lista de participacion en olimpiadas', val : 7},
                    {nombre: 'Reporte de notas', val : 8}
                ];
                return lista;
            },
            getGradesList: function(){
                var grades = [
                    {grade_opt: 'Decimo', grade_val: 1},
                    {grade_opt: 'Undecimo', grade_val: 2}
                ];
                return grades;
            },
            initHeader: function(women, men, total){
                var header =
                    'Colegio Cientifico de Costa Rica                       Mujeres: ' + women + '\n' +
                    'Sede Regional San Carlos                               Hombres: ' + men + '\n' +
                    'Telefax: 2475-7089,Tel: 2401-3122                        Total: ' + total + '\n';
                return header;
            },
            getJSONFromData: function (header, title, columns, data, startY){
                return {'Header': header, 'Title': title, 'Columns':columns, 'Data': data, 'StartY': startY};
            },
       };
        return report;
   }
);


'use strict';

//Setting up route
angular.module('logros-academicos').config(['$stateProvider',
	function($stateProvider) {
		// Logros academicos state routing
		$stateProvider.
		state('listLogrosAcademicos', {
			url: '/logros-academicos/:estudianteId/:cedulaEstudiante',
			templateUrl: 'modules/logros-academicos/views/list-logros-academicos.client.view.html'
		}).
		state('createLogrosAcademico', {
			url: '/logros-academicos/create/:estudianteId/:cedulaEstudiante',
			templateUrl: 'modules/logros-academicos/views/create-logros-academico.client.view.html'
		}).
		state('viewLogrosAcademico', {
			url: '/logros-academicos/:estudianteId/:cedulaEstudiante/:logrosAcademicoId',
			templateUrl: 'modules/logros-academicos/views/view-logros-academico.client.view.html'
		}).
		state('editLogrosAcademico', {
			url: '/logros-academicos/:estudianteId/:cedulaEstudiante/:logrosAcademicoId/edit',
			templateUrl: 'modules/logros-academicos/views/edit-logros-academico.client.view.html'
		});
	}
]);
'use strict';

// Logros academicos controller
angular.module('logros-academicos').controller('LogrosAcademicosController', ['$scope', '$stateParams', '$location', 'Authentication', 'LogrosAcademicos','GetLogro',
	function($scope, $stateParams, $location, Authentication, LogrosAcademicos, GetLogro) {
		$scope.authentication = Authentication;
        $scope.name = '';
        $scope.estudiante = '';
        $scope.descripcion = '';
        $scope.premio = '';

		// Create new Logros academico
		$scope.create = function() {
			// Create new Logros academico object
			var logrosAcademico = new LogrosAcademicos ({
				name: $scope.name,
                estudiante: $stateParams.cedulaEstudiante,
                descripcion: $scope.descripcion,
                premio: $scope.premio,
                anno: new Date().getFullYear()
			});

			// Redirect after save
			logrosAcademico.$save(function(response) {
                $location.path('estudiantes/' + $stateParams.estudianteId);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Logros academico
		$scope.remove = function(logrosAcademico) {
			if ( logrosAcademico ) { 
				logrosAcademico.$remove();

				for (var i in $scope.logrosAcademicos) {
					if ($scope.logrosAcademicos [i] === logrosAcademico) {
						$scope.logrosAcademicos.splice(i, 1);
					}
				}
			} else {
				$scope.logrosAcademico.$remove(function() {
					//$location.path('logros-academicos');
                    $location.path('logros-academicos/' + $stateParams.estudianteId+'/'+$stateParams.cedulaEstudiante);
				});
			}
		};

		// Update existing Logros academico
		$scope.update = function() {
			var logrosAcademico = $scope.logrosAcademico;

			logrosAcademico.$update(function() {
				//$location.path('logros-academicos/' + logrosAcademico._id);
                $location.path('logros-academicos/' + $stateParams.estudianteId+'/'+$stateParams.cedulaEstudiante+'/'+logrosAcademico._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Logros academicos
		$scope.find = function() {
			$scope.logrosAcademicos = LogrosAcademicos.query();
		};

		// Find existing Logros academico
		$scope.findOne = function() {
            $scope.cedulaEstudianteUrl = $stateParams.cedulaEstudiante;
            $scope.idEstudianteUrl = $stateParams.estudianteId;
			$scope.logrosAcademico = LogrosAcademicos.get({ 
				logrosAcademicoId: $stateParams.logrosAcademicoId
			});
		};

        $scope.findByEstudiante = function() {
            $scope.cedula = $stateParams.cedulaEstudiante;
            $scope.estudianteID = $stateParams.estudianteId;
            $scope.logrosAcademicosE = GetLogro.query({
                cedula:$scope.cedula
            });
        };
	}
]);
'use strict';

//Logros academicos service used to communicate Logros academicos REST endpoints
angular.module('logros-academicos').factory('LogrosAcademicos', ['$resource',
	function($resource) {
		return $resource('logros-academicos/:logrosAcademicoId', { logrosAcademicoId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

angular.module('logros-academicos').factory('GetLogro', ['$resource',
    function($resource) {
        return $resource('/logros-academicos/estudiante/:cedula', { cedula: '@cedula'
        }, {
            update: {
                method: 'GET'
            }
        });
    }
]);
'use strict';

//Setting up route
angular.module('notas').config(['$stateProvider',
	function($stateProvider) {
		// Notas state routing
		$stateProvider.
		state('listNotas', {
			url: '/notas',
			templateUrl: 'modules/notas/views/list-notas.client.view.html'
		}).
		state('createNota', {
			url: '/notas/create',
			templateUrl: 'modules/notas/views/create-nota.client.view.html'
		}).
		state('viewNota', {
			url: '/notas/:cedula_estudiante',
			templateUrl: 'modules/notas/views/view-nota.client.view.html'
		}).
		state('editNota', {
			url: '/notas/:cedula_estudiante/edit',
			templateUrl: 'modules/notas/views/edit-nota.client.view.html'
		});
	}
]);
'use strict';

// Notas controller
angular.module('notas').controller('NotasController', ['$scope', '$stateParams', '$location', 'Authentication', 'Notas',
	function($scope, $stateParams, $location, Authentication, Notas) {
		$scope.authentication = Authentication;

		// Create new Nota
		$scope.create = function() {
			// Create new Nota object
			var nota = new Notas ({
                cedula_estudiante: this.cedula_estudiante,
                grado: this.grado,
                curso: this.curso,
                nota: this.nota,
                anno: this.nota,
                semestre: this.semestre
			});

			// Redirect after save
			nota.$save(function(response) {
				$location.path('notas/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Nota
		$scope.remove = function(nota) {
			if ( nota ) { 
				nota.$remove();

				for (var i in $scope.notas) {
					if ($scope.notas [i] === nota) {
						$scope.notas.splice(i, 1);
					}
				}
			} else {
				$scope.nota.$remove(function() {
					$location.path('notas');
				});
			}
		};

		// Update existing Nota
		$scope.update = function() {
			var nota = $scope.nota;

			nota.$update(function() {
				$location.path('notas/' + nota._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Notas
		$scope.find = function() {
			$scope.notas = Notas.query();
		};

		// Find existing Nota
		$scope.findOne = function() {
			$scope.nota = Notas.query({
				cedula_estudiante: $stateParams.cedula_estudiante
			}).$promise.then(function(data) {
                console.log(data[0]);
            });
            console.log($scope.nota);
		};
	}
]);
'use strict';

//Notas service used to communicate Notas REST endpoints

'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
 'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);

'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);