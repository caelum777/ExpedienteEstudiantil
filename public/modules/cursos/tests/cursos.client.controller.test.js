'use strict';

(function() {
	// Cursos Controller Spec
	describe('Cursos Controller Tests', function() {
		// Initialize global variables
		var CursosController,
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

			// Initialize the Cursos controller.
			CursosController = $controller('CursosController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Curso object fetched from XHR', inject(function(Cursos) {
			// Create sample Curso using the Cursos service
			var sampleCurso = new Cursos({
				name: 'New Curso'
			});

			// Create a sample Cursos array that includes the new Curso
			var sampleCursos = [sampleCurso];

			// Set GET response
			$httpBackend.expectGET('cursos').respond(sampleCursos);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.cursos).toEqualData(sampleCursos);
		}));

		it('$scope.findOne() should create an array with one Curso object fetched from XHR using a cursoId URL parameter', inject(function(Cursos) {
			// Define a sample Curso object
			var sampleCurso = new Cursos({
				name: 'New Curso'
			});

			// Set the URL parameter
			$stateParams.cursoId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/cursos\/([0-9a-fA-F]{24})$/).respond(sampleCurso);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.curso).toEqualData(sampleCurso);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Cursos) {
			// Create a sample Curso object
			var sampleCursoPostData = new Cursos({
				name: 'New Curso'
			});

			// Create a sample Curso response
			var sampleCursoResponse = new Cursos({
				_id: '525cf20451979dea2c000001',
				name: 'New Curso'
			});

			// Fixture mock form input values
			scope.name = 'New Curso';

			// Set POST response
			$httpBackend.expectPOST('cursos', sampleCursoPostData).respond(sampleCursoResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Curso was created
			expect($location.path()).toBe('/cursos/' + sampleCursoResponse._id);
		}));

		it('$scope.update() should update a valid Curso', inject(function(Cursos) {
			// Define a sample Curso put data
			var sampleCursoPutData = new Cursos({
				_id: '525cf20451979dea2c000001',
				name: 'New Curso'
			});

			// Mock Curso in scope
			scope.curso = sampleCursoPutData;

			// Set PUT response
			$httpBackend.expectPUT(/cursos\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/cursos/' + sampleCursoPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid cursoId and remove the Curso from the scope', inject(function(Cursos) {
			// Create new Curso object
			var sampleCurso = new Cursos({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Cursos array and include the Curso
			scope.cursos = [sampleCurso];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/cursos\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCurso);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.cursos.length).toBe(0);
		}));
	});
}());