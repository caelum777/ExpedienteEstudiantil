'use strict';

(function() {
	// Functionaries Controller Spec
	describe('Functionaries Controller Tests', function() {
		// Initialize global variables
		var FunctionariesController,
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

			// Initialize the Functionaries controller.
			FunctionariesController = $controller('FunctionariesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Functionary object fetched from XHR', inject(function(Functionaries) {
			// Create sample Functionary using the Functionaries service
			var sampleFunctionary = new Functionaries({
				name: 'New Functionary'
			});

			// Create a sample Functionaries array that includes the new Functionary
			var sampleFunctionaries = [sampleFunctionary];

			// Set GET response
			$httpBackend.expectGET('functionaries').respond(sampleFunctionaries);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.functionaries).toEqualData(sampleFunctionaries);
		}));

		it('$scope.findOne() should create an array with one Functionary object fetched from XHR using a functionaryId URL parameter', inject(function(Functionaries) {
			// Define a sample Functionary object
			var sampleFunctionary = new Functionaries({
				name: 'New Functionary'
			});

			// Set the URL parameter
			$stateParams.functionaryId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/functionaries\/([0-9a-fA-F]{24})$/).respond(sampleFunctionary);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.functionary).toEqualData(sampleFunctionary);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Functionaries) {
			// Create a sample Functionary object
			var sampleFunctionaryPostData = new Functionaries({
				name: 'New Functionary'
			});

			// Create a sample Functionary response
			var sampleFunctionaryResponse = new Functionaries({
				_id: '525cf20451979dea2c000001',
				name: 'New Functionary'
			});

			// Fixture mock form input values
			scope.name = 'New Functionary';

			// Set POST response
			$httpBackend.expectPOST('functionaries', sampleFunctionaryPostData).respond(sampleFunctionaryResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Functionary was created
			expect($location.path()).toBe('/functionaries/' + sampleFunctionaryResponse._id);
		}));

		it('$scope.update() should update a valid Functionary', inject(function(Functionaries) {
			// Define a sample Functionary put data
			var sampleFunctionaryPutData = new Functionaries({
				_id: '525cf20451979dea2c000001',
				name: 'New Functionary'
			});

			// Mock Functionary in scope
			scope.functionary = sampleFunctionaryPutData;

			// Set PUT response
			$httpBackend.expectPUT(/functionaries\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/functionaries/' + sampleFunctionaryPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid functionaryId and remove the Functionary from the scope', inject(function(Functionaries) {
			// Create new Functionary object
			var sampleFunctionary = new Functionaries({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Functionaries array and include the Functionary
			scope.functionaries = [sampleFunctionary];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/functionaries\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleFunctionary);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.functionaries.length).toBe(0);
		}));
	});
}());