'use strict';

(function() {
	// Logros academicos Controller Spec
	describe('Logros academicos Controller Tests', function() {
		// Initialize global variables
		var LogrosAcademicosController,
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

			// Initialize the Logros academicos controller.
			LogrosAcademicosController = $controller('LogrosAcademicosController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Logros academico object fetched from XHR', inject(function(LogrosAcademicos) {
			// Create sample Logros academico using the Logros academicos service
			var sampleLogrosAcademico = new LogrosAcademicos({
				name: 'New Logros academico'
			});

			// Create a sample Logros academicos array that includes the new Logros academico
			var sampleLogrosAcademicos = [sampleLogrosAcademico];

			// Set GET response
			$httpBackend.expectGET('logros-academicos').respond(sampleLogrosAcademicos);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.logrosAcademicos).toEqualData(sampleLogrosAcademicos);
		}));

		it('$scope.findOne() should create an array with one Logros academico object fetched from XHR using a logrosAcademicoId URL parameter', inject(function(LogrosAcademicos) {
			// Define a sample Logros academico object
			var sampleLogrosAcademico = new LogrosAcademicos({
				name: 'New Logros academico'
			});

			// Set the URL parameter
			$stateParams.logrosAcademicoId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/logros-academicos\/([0-9a-fA-F]{24})$/).respond(sampleLogrosAcademico);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.logrosAcademico).toEqualData(sampleLogrosAcademico);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(LogrosAcademicos) {
			// Create a sample Logros academico object
			var sampleLogrosAcademicoPostData = new LogrosAcademicos({
				name: 'New Logros academico'
			});

			// Create a sample Logros academico response
			var sampleLogrosAcademicoResponse = new LogrosAcademicos({
				_id: '525cf20451979dea2c000001',
				name: 'New Logros academico'
			});

			// Fixture mock form input values
			scope.name = 'New Logros academico';

			// Set POST response
			$httpBackend.expectPOST('logros-academicos', sampleLogrosAcademicoPostData).respond(sampleLogrosAcademicoResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Logros academico was created
			expect($location.path()).toBe('/logros-academicos/' + sampleLogrosAcademicoResponse._id);
		}));

		it('$scope.update() should update a valid Logros academico', inject(function(LogrosAcademicos) {
			// Define a sample Logros academico put data
			var sampleLogrosAcademicoPutData = new LogrosAcademicos({
				_id: '525cf20451979dea2c000001',
				name: 'New Logros academico'
			});

			// Mock Logros academico in scope
			scope.logrosAcademico = sampleLogrosAcademicoPutData;

			// Set PUT response
			$httpBackend.expectPUT(/logros-academicos\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/logros-academicos/' + sampleLogrosAcademicoPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid logrosAcademicoId and remove the Logros academico from the scope', inject(function(LogrosAcademicos) {
			// Create new Logros academico object
			var sampleLogrosAcademico = new LogrosAcademicos({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Logros academicos array and include the Logros academico
			scope.logrosAcademicos = [sampleLogrosAcademico];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/logros-academicos\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleLogrosAcademico);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.logrosAcademicos.length).toBe(0);
		}));
	});
}());