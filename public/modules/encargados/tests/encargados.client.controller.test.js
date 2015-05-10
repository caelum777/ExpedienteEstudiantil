'use strict';

(function() {
	// Encargados Controller Spec
	describe('Encargados Controller Tests', function() {
		// Initialize global variables
		var EncargadosController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Encargados controller.
			EncargadosController = $controller('EncargadosController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Encargado object fetched from XHR', inject(function(Encargados) {
			// Create sample Encargado using the Encargados service
			var sampleEncargado = new Encargados({
				name: 'New Encargado'
			});

			// Create a sample Encargados array that includes the new Encargado
			var sampleEncargados = [sampleEncargado];

			// Set GET response
			$httpBackend.expectGET('encargados').respond(sampleEncargados);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.encargados).toEqualData(sampleEncargados);
		}));

		it('$scope.findOne() should create an array with one Encargado object fetched from XHR using a encargadoId URL parameter', inject(function(Encargados) {
			// Define a sample Encargado object
			var sampleEncargado = new Encargados({
				name: 'New Encargado'
			});

			// Set the URL parameter
			$stateParams.encargadoId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/encargados\/([0-9a-fA-F]{24})$/).respond(sampleEncargado);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.encargado).toEqualData(sampleEncargado);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Encargados) {
			// Create a sample Encargado object
			var sampleEncargadoPostData = new Encargados({
				name: 'New Encargado'
			});

			// Create a sample Encargado response
			var sampleEncargadoResponse = new Encargados({
				_id: '525cf20451979dea2c000001',
				name: 'New Encargado'
			});

			// Fixture mock form input values
			scope.name = 'New Encargado';

			// Set POST response
			$httpBackend.expectPOST('encargados', sampleEncargadoPostData).respond(sampleEncargadoResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Encargado was created
			expect($location.path()).toBe('/encargados/' + sampleEncargadoResponse._id);
		}));

		it('$scope.update() should update a valid Encargado', inject(function(Encargados) {
			// Define a sample Encargado put data
			var sampleEncargadoPutData = new Encargados({
				_id: '525cf20451979dea2c000001',
				name: 'New Encargado'
			});

			// Mock Encargado in scope
			scope.encargado = sampleEncargadoPutData;

			// Set PUT response
			$httpBackend.expectPUT(/encargados\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/encargados/' + sampleEncargadoPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid encargadoId and remove the Encargado from the scope', inject(function(Encargados) {
			// Create new Encargado object
			var sampleEncargado = new Encargados({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Encargados array and include the Encargado
			scope.encargados = [sampleEncargado];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/encargados\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleEncargado);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.encargados.length).toBe(0);
		}));
	});
}());