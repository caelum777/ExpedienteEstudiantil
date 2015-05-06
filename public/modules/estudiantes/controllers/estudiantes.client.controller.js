'use strict';

// Estudiantes controller
angular.module('estudiantes').controller('EstudiantesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Estudiantes', '$upload', 'Notas', 'GetNotas', 'GetAdmitidos',
	function($scope, $stateParams, $location, Authentication, Estudiantes, $upload, Notas, GetNotas, GetAdmitidos) {
		$scope.authentication = Authentication;
        $scope.options =
        [{
            nombre: 'San Jose',
            cantones: [
                {nombre: 'San Jose',
                    distritos: [{nombre: 'Carmen'}, {nombre: 'Merced'}, {nombre: 'Hospital'}, {nombre: 'Catedral'}, {nombre: 'Zapote'}, {nombre: 'San Francisco de Dos Ríos'}, {nombre: 'La Uruca'}, {nombre: 'Mata Redonda'}, {nombre: 'Pavas'}, {nombre: 'Hatillo'}, {nombre: 'San Sebastián'}]
                }, {
                    nombre: 'Escazú',
                    distritos: [{nombre: 'Escazú'}, {nombre: 'San Rafael'}, {nombre: 'San Antonio'}]
                }, {
                    nombre: 'Desamparados',
                    distritos: [{nombre: 'Desamparados'}, {nombre: 'San Miguel'}, {nombre: 'San Juan de Dios'}, {nombre: 'San Rafael Arriba'}, {nombre: 'San Antonio'}, {nombre: 'Frailes'}, {nombre: 'Patarrá'}, {nombre: 'San Cristóbal'}, {nombre: 'Rosario'}, {nombre: 'Damas'}, {nombre: 'San Rafael Abajo'}, {nombre: 'Gravilias'}, {nombre: 'Los Guido'}]
                }, {
                    nombre: 'Puriscal',
                    distritos: [{nombre: 'Santiago'}, {nombre: 'Mercedes Sur'}, {nombre: 'Barbacoas'}, {nombre: 'Grifo Alto'}, {nombre: 'San Rafael'}, {nombre: 'Candelarita'}, {nombre: 'Desamparaditos'}, {nombre: 'San Antonio'}, {nombre: 'Chires'}]
                }, {
                    nombre: 'Tarrazú',
                    distritos: [{nombre: 'San Marcos'}, {nombre: 'San Lorenzo'}, {nombre: 'San Carlos'}]
                }, {
                    nombre: 'Aserrí',
                    distritos: [{nombre: 'Aserrí'}, {nombre: 'Tarbaca'}, {nombre: 'Vuelta de Jorco'}, {nombre: 'San Gabriel'}, {nombre: 'Legua'}, {nombre: 'Monterrey'}, {nombre: 'Salitrillos'}]
                }, {
                    nombre: 'Mora',
                    distritos: [{nombre: 'Colón'}, {nombre: 'Guayabo'}, {nombre: 'Tabarcia'}, {nombre: 'Piedras Negras'}, {nombre: 'Picagres'}, {nombre: 'Jaris'}, {nombre: 'Quitirrisi'}]
                }, {
                    nombre: 'Goicoechea',
                    distritos: [{nombre: 'Guadalupe'}, {nombre: 'San Francisco'}, {nombre: 'Calle Blancos'}, {nombre: 'Mata de Plátano'}, {nombre: 'Ipís'}, {nombre: 'Rancho Redondo'}, {nombre: 'Purral'}]
                }, {
                    nombre: 'Santa Ana',
                    distritos: [{nombre: 'Santa Ana'}, {nombre: 'Salitral'}, {nombre: 'Pozos'}, {nombre: 'Uruca'}, {nombre: 'Piedades'}, {nombre: 'Brasil'}]
                }, {
                    nombre: 'Alajuelita',
                    distritos: [{nombre: 'Alajuelita'}, {nombre: 'San Josecito'}, {nombre: 'San Antonio'}, {nombre: 'Concepción'}, {nombre: 'San Felipe'}]
                }, {
                    nombre: 'Vásquez de Coronado',
                    distritos: [{nombre: 'San Isidro'}, {nombre: 'San Rafael'}, {nombre: 'Dulce Nombre de Jesús'}, {nombre: 'Patalillo'}, {nombre: 'Cascajal'}]
                }, {
                    nombre: 'Acosta',
                    distritos: [{nombre: 'San Ignacio'}, {nombre: 'Guaitil'}, {nombre: 'Palmichal'}, {nombre: 'Cangrejal'}, {nombre: 'Sabanillas'}]
                }, {
                    nombre: 'Tibás',
                    distritos: [{nombre: 'San Juan de Tibás'}, {nombre: 'Cinco Esquinas'}, {nombre: 'Anselmo Llorente'}, {nombre: 'León XIII'}, {nombre: 'Colima'}]
                }, {
                    nombre: 'Moravia',
                    distritos: [{nombre: 'San Vicente'}, {nombre: 'La Trinidad'}, {nombre: 'San Jerónimo'}]
                }, {
                    nombre: 'Montes de Oca',
                    distritos: [{nombre: 'San Pedro'}, {nombre: 'Sabanilla'}, {nombre: 'Mercedes'}, {nombre: 'San Rafael'}]
                }, {
                    nombre: 'Turrubares',
                    distritos: [{nombre: 'San Pablo'}, {nombre: 'San Pedro'}, {nombre: 'San Juan de Mata'}, {nombre: 'San Luis'}, {nombre: 'Carara'}]
                }, {
                    nombre: 'Dota',
                    distritos: [{nombre: 'Santa María'}, {nombre: 'Jardín'}, {nombre: 'Copey'}]
                }, {
                    nombre: 'Curridabat',
                    distritos: [{nombre: 'Curridabat'}, {nombre: 'Granadilla'}, {nombre: 'Sánchez'}, {nombre: 'Tirrases'}]
                }, {
                    nombre: 'Pérez Zeledón',
                    distritos: [{nombre: 'San Isidro de El General'}, {nombre: 'El General'}, {nombre: 'Daniel Flores'}, {nombre: 'Rivas'}, {nombre: 'San Pedro'}, {nombre: 'Platanares'}, {nombre: 'Pejibaye'}, {nombre: 'Cajón'}, {nombre: 'Barú'}, {nombre: 'Río Nuevo'}, {nombre: 'Páramo'}]
                }, {
                    nombre: 'León Cortés Castro',
                    distritos: [{nombre: 'San Pablo'}, {nombre: 'San Andrés'}, {nombre: 'Llano Bonito'}, {nombre: 'San Isidro'}, {nombre: 'Santa Cruz'}, {nombre: 'San Antonio'}]
                }
            ]
        },
            {nombre: 'Alajuela',
            cantones: [{
                nombre: 'Alajuela',
                distritos: [{nombre: 'Alajuela'},{nombre: 'San José'},{nombre: 'Carrizal'},{nombre: 'San Antonio'},{nombre: 'Guácima'},{nombre: 'San Isidro'},{nombre: 'Sabanilla'},{nombre: 'San Rafael'},{nombre: 'Río Segundo'},{nombre: 'Desamparados'},{nombre: 'Turrúcares'},{nombre: 'Tambor'},{nombre: 'Garita'}]
            }, {
                nombre: 'San Ramón',
                distritos: [{nombre: 'San Ramón'},{nombre: 'Santiago'},{nombre: 'San Juan'},{nombre: 'Piedades Norte'},{nombre: 'Piedades Sur'},{nombre: 'San Rafael'},{nombre: 'San Isidro'},{nombre: 'Ángeles'},{nombre: 'Alfaro'},{nombre: 'Volio'},{nombre: 'Concepción'},{nombre: 'Zapotal'},{nombre: 'Peñas Blancas'},{nombre: 'La Paz'},{nombre: 'La Esperanza'},{nombre: 'Bajo Zuñiga'}]
            }, {
                nombre: 'Grecia',
                distritos: [{nombre: 'Grecia'},{nombre: 'San Isidro'},{nombre: 'San José'},{nombre: 'San Roque'},{nombre: 'Tacares'},{nombre: 'Río Cuarto'},{nombre: 'Puente de Piedra'},{nombre: 'Bolívar'}]
            }, {
                nombre: 'San Mateo',
                distritos: [{nombre: 'San Mateo'},{nombre: 'Desmonte'},{nombre: 'Jesús María'}]
            }, {
                nombre: 'Atenas',
                distritos: [{nombre: 'Atenas'},{nombre: 'Jesús'},{nombre: 'Mercedes'},{nombre: 'San Isidro'},{nombre: 'Concepción'},{nombre: 'San José'},{nombre: 'Santa Eulalia'}]
            }, {
                nombre: 'Naranjo',
                distritos: [{nombre: 'Naranjo Centro'},{nombre: 'San Miguel'},{nombre: 'San José ó San Juanillo'},{nombre: 'Cirrí'},{nombre: 'San Jerónimo'},{nombre: 'San Juan'},{nombre: 'Rosario'},{nombre: 'Palmitos'}]
            }, {
                nombre: 'Palmares',
                distritos: [{nombre: 'Palmares'},{nombre: 'Zaragoza'},{nombre: 'Buenos Aires'},{nombre: 'Santiago'},{nombre: 'Candelaria'},{nombre: 'Esquipulas'},{nombre: 'La Granja'}]
            }, {
                nombre: 'Poás',
                distritos: [{nombre: 'San Pedro'},{nombre: 'San Juan'},{nombre: 'San Rafael'},{nombre: 'Carrillos'},{nombre: 'Sabana Redonda'}]
            }, {
                nombre: 'Orotina',
                distritos: [{nombre: 'Orotina'},{nombre: 'El Mastate'},{nombre: 'Hacienda Vieja'},{nombre: 'Coyolar'},{nombre: 'La Ceiba'}]
            }, {
                nombre: 'San Carlos',
                distritos: [{nombre: 'Quesada'},{nombre: 'Florencia'},{nombre: 'Buenavista'},{nombre: 'Aguas Zarcas'},{nombre: 'Venecia'},{nombre: 'Pital'},{nombre: 'La Fortuna'},{nombre: 'La Tigra'},{nombre: 'Palmera'},{nombre: 'Venado'},{nombre: 'Cutris'},{nombre: 'Monterrey'},{nombre: 'Pocosol'}]
            }, {
                nombre: 'Zarcero',
                distritos: [{nombre: 'Zarcero'},{nombre: 'Laguna'},{nombre: 'Tapezco'},{nombre: 'Palmira'},{nombre: 'Guadalupe'},{nombre: 'Zapote'},{nombre: 'Las Brisas'}]
            }, {
                nombre: 'Valverde Vega',
                distritos: [{nombre: 'Sarchí Norte'},{nombre: 'Sarchí Sur'},{nombre: 'Toro Amarillo'},{nombre: 'San Pedro'},{nombre: 'Rodríguez'}]
            }, {
                nombre: 'Upala',
                distritos: [{nombre: 'Upala'},{nombre: 'Aguas Claras'},{nombre: 'San José'},{nombre: 'Bijagua'},{nombre: 'Delicias'},{nombre: 'Dos Ríos'},{nombre: 'Yolillal'},{nombre: 'Canalete'}]
            }, {
                nombre: 'Los Chiles',
                distritos: [{nombre: 'Los Chiles'},{nombre: 'Caño Negro'},{nombre: 'El Amparo'},{nombre: 'San Jorge'}]
            }, {
                nombre: 'Guatuso',
                distritos: [{nombre: 'San Rafael'},{nombre: 'Buenavista'},{nombre: 'Cote'},{nombre: 'Katira'}]
            }]
        },
            {
            nombre: 'Cartago',
            cantones: [{
                nombre: 'Cartago',
                distritos: [{nombre: 'Oriental'},{nombre: 'Occidental'},{nombre: 'Carmen'},{nombre: 'San Nicolás (Taras)'},{nombre: 'Agua Caliente (San Francisco)'},{nombre: 'Guadalupe (Arenilla)'},{nombre: 'Corralillo'},{nombre: 'Tierra Blanca'},{nombre: 'Dulce Nombre'},{nombre: 'Llano Grande'},{nombre: 'Quebradilla'}]
            }, {
                nombre: 'Paraíso',
                distritos: [{nombre: 'Paraíso'},{nombre: 'Orosi'},{nombre: 'Cachí'},{nombre: 'Santiago'},{nombre: 'Llanos de Santa Lucía'}]
            }, {
                nombre: 'La Unión',
                distritos: [{nombre: 'Tres Ríos'},{nombre: 'San Diego'},{nombre: 'San Juan'},{nombre: 'San Rafael'},{nombre: 'Concepción'},{nombre: 'Dulce Nombre'},{nombre: 'San Ramón'},{nombre: 'Río Azul'}]
            }, {
                nombre: 'Jiménez',
                distritos: [{nombre: 'Juan Viñas'},{nombre: 'Tucurrique'},{nombre: 'Pejibaye'}]
            }, {
                nombre: 'Turrialba',
                distritos: [{nombre: 'Turrialba '},{nombre: 'La Suiza'},{nombre: 'Peralta'},{nombre: 'Santa Cruz'},{nombre: 'Pavones'},{nombre: 'Tuis'},{nombre: 'Tayutic'},{nombre: 'Santa Rosa'},{nombre: 'Tres Equis'},{nombre: 'La Isabel'},{nombre: 'Chirripó'}]
            }, {
                nombre: 'Alvarado',
                distritos: [{nombre: 'Pacayas'},{nombre: 'Cervantes'},{nombre: 'Capellades'}]
            }, {
                nombre: 'Oreamuno',
                distritos: [{nombre: 'San Rafael'},{nombre: 'Cot'},{nombre: 'Potrero Cerrado'},{nombre: 'Cipreses'},{nombre: 'Santa Rosa'}]
            }, {
                nombre: 'El Guarco',
                distritos: [{nombre: 'El Tejar'},{nombre: 'San Isidro'},{nombre: 'Tobosi'},{nombre: 'Patio de Agua'}]
            }]
        },
            {nombre: 'Heredia',
            cantones: [{
                nombre: 'Heredia',
                distritos: [{nombre: 'Heredia'}, {nombre: 'Mercedes'},{nombre: 'San Francisco'},{nombre: 'Ulloa'},{nombre: 'Varablanca'}]
            }, {
                nombre: 'Barva',
                distritos: [{nombre: 'Barva'}, {nombre: 'San Pedro'},{nombre: 'San Pablo'},{nombre: 'San Roque'},{nombre: 'Santa Lucía'},{nombre: 'San José de la Montaña'}]
            }, {
                nombre: 'Santo Domingo',
                distritos: [{nombre: 'Santo Domingo'}, {nombre: 'San Vicente'},{nombre: 'San Miguel '},{nombre: 'Paracito'},{nombre: 'Santo Tomás'},{nombre: 'Santa Rosa'},{nombre: 'Tures'},{nombre: 'Pará'}]
            }, {
                nombre: 'Santa Bárbara',
                distritos: [{nombre: 'Santa Bárbara'}, {nombre: 'San Pedro'},{nombre: 'San Juan'},{nombre: 'Jesús'},{nombre: 'Santo Domingo'},{nombre: 'Puraba'}]
            }, {
                nombre: 'San Rafael',
                distritos: [{nombre: 'San Rafael'}, {nombre: 'San Josecito'},{nombre: 'Santiago'},{nombre: 'Los Ángeles'},{nombre: 'Concepción'}]
            }, {
                nombre: 'San Isidro',
                distritos: [{nombre: 'San Isidro'}, {nombre: 'San José'},{nombre: 'Concepción'},{nombre: 'San Francisco'}]
            }, {
                nombre: 'Belén',
                distritos: [{nombre: 'San Antonio'}, {nombre: 'La Ribera'},{nombre: 'La Asunción'}]
            }, {
                nombre: 'Flores',
                distritos: [{nombre: 'San Joaquín'}, {nombre: 'Barrantes'},{nombre: 'Llorente'}]
            }, {
                nombre: 'San Pablo',
                distritos: [{nombre: 'San Pablo'}, {nombre: 'Rincón de Sabanilla'}]
            }, {
                nombre: 'Sarapiquí',
                distritos: [{nombre: 'Puerto Viejo'}, {nombre: 'La Virgen'},{nombre: 'Horquetas'},{nombre: 'Llanuras del Gaspar'},{nombre: 'Cureña'}]
            }]
        },
            {nombre: 'Puntarenas',
            cantones: [{
                nombre: 'Puntarenas',
                distritos: [{nombre: 'Puntarenas'}, {nombre: 'Pitahaya'},{nombre: 'Chomes'},{nombre: 'Lepanto'},{nombre: 'Paquera'},{nombre: 'Manzanillo'},{nombre: 'Guacimal'},{nombre: 'Barranca'},{nombre: 'Monteverde'},{nombre: 'Isla del Coco'},{nombre: 'Cóbano'},{nombre: 'Chacarita'},{nombre: 'Chira'},{nombre: 'Acapulco'},{nombre: 'El Roble'},{nombre: 'Arancibia'}]
            }, {
                nombre: 'Esparza',
                distritos: [{nombre: 'Espíritu Santo'}, {nombre: 'San Juan'},{nombre: 'Macacona'},{nombre: 'San Rafael'},{nombre: 'San Jerónimo'},{nombre: 'Caldera'}]
            }, {
                nombre: 'Buenos Aires',
                distritos: [{nombre: 'Buenos Aires'}, {nombre: 'Volcán'},{nombre: 'Potrero Grande'},{nombre: 'Boruca'},{nombre: 'Pilas'},{nombre: 'Colinas'},{nombre: 'Chánguena'},{nombre: 'Biolley'},{nombre: 'Brunka'}]
            }, {
                nombre: 'Montes de Oro',
                distritos: [{nombre: 'Miramar'}, {nombre: 'La Unión'},{nombre: 'San Isidro'}]
            }, {
                nombre: 'Osa',
                distritos: [{nombre: 'Puerto Cortés'}, {nombre: 'Palmar'},{nombre: 'Sierpe'},{nombre: 'Piedras Blancas'},{nombre: 'Bahía Ballena'},{nombre: 'Bahía Drake'}]
            }, {
                nombre: 'Quepos',
                distritos: [{nombre: 'Quepos'}, {nombre: 'Savegre'},{nombre: 'Naranjito'}]
            }, {
                nombre: 'Golfito',
                distritos: [{nombre: 'Golfito'}, {nombre: 'Puerto Jiménez'},{nombre: 'Guaycará'},{nombre: 'Pavón'}]
            }, {
                nombre: 'Coto Brus',
                distritos: [{nombre: 'San Vito'}, {nombre: 'Sabalito'},{nombre: 'Agua Buena'},{nombre: 'Limoncito'},{nombre: 'Pittier'},{nombre: 'Gutierrez Brown'}]
            }, {
                nombre: 'Parrita',
                distritos: [{nombre: 'Parrita'}]
            }, {
                nombre: 'Corredores',
                distritos: [{nombre: 'Corredor'}, {nombre: 'La Cuesta'},{nombre: 'Canoas'},{nombre: 'Laurel'}]
            }, {
                nombre: 'Garabito',
                distritos: [{nombre: 'Jacó'}, {nombre: 'Tárcoles'}]
            }]
        },
            {nombre: 'Guanacaste',
            cantones: [{
                nombre: 'Liberia',
                distritos: [{nombre: 'Liberia'},{nombre: 'Cañas Dulces'},{nombre: 'Mayorga'},{nombre: 'Nacascolo'},{nombre: 'Curubandé'}]
            }, {
                nombre: 'Nicoya',
                distritos: [{nombre: 'Nicoya'},{nombre: 'Mansión'},{nombre: 'San Antonio'},{nombre: 'Quebrada Honda'},{nombre: 'Sámara'},{nombre: 'Nosara'},{nombre: 'Belén de Nosarita'}]
            }, {
                nombre: 'Santa Cruz',
                distritos: [{nombre: 'Santa Cruz'},{nombre: 'Bolson'},{nombre: 'Veintisiete de Abril'},{nombre: 'Tempate'},{nombre: 'Cartagena'},{nombre: 'Cuajiniquil'},{nombre: 'Diriá'},{nombre: 'Cabo Velas'},{nombre: 'Tamarindo'}]
            }, {
                nombre: 'Bagaces',
                distritos: [{nombre: 'Bagaces'},{nombre: 'La Fortuna'},{nombre: 'Mogote'},{nombre: 'Río Naranjo'}]
            }, {
                nombre: 'Carrillo',
                distritos: [{nombre: 'Filadelfia'},{nombre: 'Palmira'},{nombre: 'Sardinal'},{nombre: 'Belén'}]
            }, {
                nombre: 'Cañas',
                distritos: [{nombre: 'Cañas'},{nombre: 'Palmira'},{nombre: 'San Miguel'},{nombre: 'Bebedero'},{nombre: 'Porozal'}]
            }, {
                nombre: 'Abangares',
                distritos: [{nombre: 'Las Juntas'},{nombre: 'Sierra'},{nombre: 'San Juan'},{nombre: 'Colorado'}]
            }, {
                nombre: 'Tilarán',
                distritos: [{nombre: 'Tilarán'},{nombre: 'Quebrada Grande'},{nombre: 'Tronadora'},{nombre: 'Santa Rosa'},{nombre: 'Líbano'},{nombre: 'Tierras Morenas'},{nombre: 'Arenal'}]
            }, {
                nombre: 'Nandayure',
                distritos: [{nombre: 'Carmona'},{nombre: 'Santa Rita'},{nombre: 'Zapotal'},{nombre: 'San Pablo'},{nombre: 'Porvenir'},{nombre: 'Bejuco'}]
            }, {
                nombre: 'La Cruz',
                distritos: [{nombre: 'La Cruz'},{nombre: 'Santa Cecilia'},{nombre: 'La Garita'},{nombre: 'Santa Elena'}]
            }, {
                nombre: 'Hojancha',
                distritos: [{nombre: 'Hojancha'},{nombre: 'Monte Romo'},{nombre: 'Puerto Carrillo'},{nombre: 'Huacas'}]
            }]
        },
            {nombre: 'Limón',
            cantones: [{
                nombre: 'Limón',
                distritos: [{nombre: 'Limón'},{nombre: 'Valle de La Estrella'},{nombre: 'Río Blanco'},{nombre: 'Matama'}]
            }, {
                nombre: 'Pococí',
                distritos: [{nombre: 'Guápiles'},{nombre: 'Jiménez'},{nombre: 'La Rita'},{nombre: 'Roxana'},{nombre: 'Cariari'},{nombre: 'Colorado'}]
            }, {
                nombre: 'Siquirres',
                distritos: [{nombre: 'Siquirres'},{nombre: 'Pacuarito'},{nombre: 'Florida'},{nombre: 'Germania'},{nombre: 'Cairo'},{nombre: 'Alegría'}]
            }, {
                nombre: 'Talamanca',
                distritos: [{nombre: 'Bratsi'},{nombre: 'Sixaola'},{nombre: 'Cahuita'},{nombre: 'Telire'}]
            }, {
                nombre: 'Matina',
                distritos: [{nombre: 'Matina'},{nombre: 'Batán'},{nombre: 'Carrandi'}]
            }, {
                nombre: 'Guácimo',
                distritos: [{nombre: 'Guácimo'},{nombre: 'Mercedes'},{nombre: 'Pocora'},{nombre: 'Río Jiménez'},{nombre: 'Duacarí'}]
            }]
        }];



        $scope.sexos = [{nombre: 'Masculino'}, {nombre: 'Femenino'}];
        $scope.adecuaciones = [{nombre: 'Tiene'}, {nombre: 'No tiene'}];
        $scope.provincia = $scope.options[0];
        $scope.canton =  $scope.provincia.cantones[0];
        $scope.distrito = $scope.canton.distritos[0];
        $scope.sexo = $scope.sexos[0];
        $scope.adSignificativa = $scope.adecuaciones[0];
        $scope.adNoSignificativa = $scope.adecuaciones[0];
        $scope.foto = '';
        $scope.editable = false;
        $scope.selectedFile = [];

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
                    foto: $scope.foto,
                    colegio_procedencia: $scope.colegio_procedencia,
                    adecuacion_sig: $scope.adecuacion_sig,
                    adecuacion_nsig: $scope.adecuacion_nsig
                });

                for(var i = 0; i < $scope.notas_septimo.length; i++) {
                    //Septimo
                    var notaS = new Notas ({
                        cedula_estudiante: $scope.nacionalidad,
                        grado: 'septimo',
                        curso: $scope.notas_septimo[i].curso,
                        nota: $scope.notas_septimo[i].nota,
                        anno: $scope.fecha_septimo,
                        semestre: 0
                    });
                    //Octavo
                    var notaO = new Notas ({
                        cedula_estudiante: $scope.nacionalidad,
                        grado: 'octavo',
                        curso: $scope.notas_octavo[i].curso,
                        nota: $scope.notas_octavo[i].nota,
                        anno: $scope.fecha_septimo,
                        semestre: 0
                    });
                    //Noveno
                    var notaN = new Notas ({
                        cedula_estudiante: $scope.nacionalidad,
                        grado: 'noveno',
                        curso: $scope.notas_noveno[i].curso,
                        nota: $scope.notas_noveno[i].nota,
                        anno: $scope.fecha_septimo,
                        semestre: 0
                    });
                    notaS.$save(function(response) {
                    }, function(errorResponse) {
                        $scope.error = errorResponse.data.message;
                    });
                    notaO.$save(function(response) {
                    }, function(errorResponse) {
                        $scope.error = errorResponse.data.message;
                    });
                    notaN.$save(function(response) {
                    }, function(errorResponse) {
                        $scope.error = errorResponse.data.message;
                    });
                }

                // Redirect after save
                estudiante.$save(function(response) {
                    $location.path('estudiantes/' + response._id);
                    // Clear form fields
                    $scope.name = '';
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
            if($scope.sexo == 'Masculino'){
                estudiante.sexo = true;
            }
            else{
                estudiante.sexo = false;
            }
            if($scope.adSignificativa == 'Tiene'){
                estudiante.sexo = true;
            }
            else{
                estudiante.sexo = false;
            }
            if($scope.adNoSignificativa == 'Tiene'){
                estudiante.sexo = true;
            }
            else{
                estudiante.sexo = false;
            }
            //estudiante.provincia = $scope.provincia;
            //estudiante.canton = $scope.canton;
            //estudiante.distrito = $scope.distrito;
            estudiante.$update(function() {
                $location.path('estudiantes/' + estudiante._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
            var notas = $scope.notas;
            angular.forEach(notas, function (nota) {
                for(var i = 0;i < $scope.notas_septimo.length; i++){
                    if(($scope.notas_septimo.grado===nota.grado)&&($scope.notas_septimo.curso===nota.curso)){
                        nota.nota = $scope.notas_septimo.nota;
                    }
                    else if(($scope.notas_octavo.grado===nota.grado)&&($scope.notas_octavo.curso===nota.curso)){
                        nota.nota = $scope.notas_octavo.nota;
                    }
                    else if(($scope.notas_noveno.grado===nota.grado)&&($scope.notas_noveno.curso===nota.curso)){
                        nota.nota = $scope.notas_noveno.nota;
                    }
                }
                Notas.update({ notaId: nota._id }, nota);
            });
        }
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
            $scope.editable = edit;
            $scope.estudiante.$promise.then(function(estudiante) {
                if(edit){
                    //console.log($scope.estudiante.sexo);
                    //console.log($scope.find($scope.sexos, $scope.estudiante.sexo, 0));
                    //console.log($scope.estudiante.sexo);
                    $scope.sexo = $scope.sexos[$scope.find($scope.sexos, $scope.estudiante.sexo, 0)];
                    $scope.adSignificativa = $scope.adecuaciones[$scope.find($scope.adecuaciones,$scope.estudiante.adecuacion_sig, 1)];
                    $scope.adNoSignificativa = $scope.adecuaciones[$scope.find($scope.adecuaciones,$scope.estudiante.adecuacion_nsig, 1)];
                    //$scope.provincia = $scope.options[$scope.find($scope.options,$scope.estudiante.provincia, 2)];
                    //$scope.provincia = $scope.estudiante.provincia;
                    //$scope.canton = $scope.estudiante.canton;
                    //$scope.distrito = $scope.estudiante.distrito;
                }
                $scope.notas = GetNotas.query({
                    cedula_estudiante: estudiante.nacionalidad
                });
                $scope.notas.$promise.then(function(notas) {
                    angular.forEach(notas, function (nota) {
                        if(nota.grado==='septimo'){
                            $scope.notas_septimo.push(nota);
                        }
                        else if(nota.grado==='octavo'){
                            $scope.notas_octavo.push(nota);
                        }
                        else if(nota.grado==='noveno'){
                            $scope.notas_noveno.push(nota);
                        }
                    });
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
            if(val == 0){
                if(obj){
                    com = 'Masculino'
                }
                else{
                    com = 'Femenino'
                }
            }
            else if(val == 1){
                if(obj){
                    com = 'Tiene'
                }
                else{
                    com = 'No Tiene'
                }
            }
            else{
                com = obj;
            }
            for(var i = 0;i < arr.length; i++){
                if(arr[i].nombre==com){
                    return i;
                }
            }
        };

        //Notas de los cursos
        $scope.initNotas = function(){
            $scope.editable = true;
            $scope.notas_septimo = [
                {curso: 'Inglés', nota: 0},
                {curso: 'Matemática', nota: 0},
                {curso: 'Ciencias', nota: 0},
                {curso: 'Cívica', nota: 0},
                {curso: 'Español', nota: 0},
                {curso: 'Estudios Sociales', nota: 0},
                {curso: 'Conducta', nota: 0}];
            $scope.notas_octavo = [
                {curso: 'Inglés', nota: 0},
                {curso: 'Matemática', nota: 0},
                {curso: 'Ciencias', nota: 0},
                {curso: 'Cívica', nota: 0},
                {curso: 'Español', nota: 0},
                {curso: 'Estudios Sociales', nota: 0},
                {curso: 'Conducta', nota: 0}];
            $scope.notas_noveno = [
                {curso: 'Inglés', nota: 0},
                {curso: 'Matemática', nota: 0},
                {curso: 'Ciencias', nota: 0},
                {curso: 'Cívica', nota: 0},
                {curso: 'Español', nota: 0},
                {curso: 'Estudios Sociales', nota: 0},
                {curso: 'Conducta', nota: 0}];
            $scope.initGridOptions();
        };
        $scope.initGridOptions = function(){
            $scope.gridOptionsS = {
                data: 'notas_septimo',
                enableCellSelection: true,
                enableRowSelection: false,
                enableCellEditOnFocus: $scope.editable,
                columnDefs: [{field: 'curso', displayName: 'Curso', enableCellEdit: false},
                    {field:'nota', displayName:'Nota', enableCellEdit: $scope.editable}]
            };

            $scope.gridOptionsO = {
                data: 'notas_octavo',
                enableCellSelection: true,
                enableRowSelection: false,
                enableCellEditOnFocus: $scope.editable,
                columnDefs: [{field: 'curso', displayName: 'Curso', enableCellEdit: false},
                    {field:'nota', displayName:'Nota', enableCellEdit: $scope.editable}]
            };

            $scope.gridOptionsN = {
                data: 'notas_noveno',
                enableCellSelection: true,
                enableRowSelection: false,
                enableCellEditOnFocus: $scope.editable,
                columnDefs: [{field: 'curso', displayName: 'Curso', enableCellEdit: false},
                    {field:'nota', displayName:'Nota', enableCellEdit: $scope.editable}]
            };
        };
        $scope.ngGridEstudiantes = function(matriculado){
            //Gridoptions en el view "list-estudiantes.cliente.view.html"
            if(!matriculado)
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
                        { field: '_id', displayName:'Ver', cellTemplate: '<a data-ng-href="#!/estudiantes/{{row.entity._id}}">ver</a>'}]
                };
            }
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
	}
]);