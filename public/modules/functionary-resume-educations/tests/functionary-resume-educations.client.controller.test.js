'use strict';

(function() {
	// Functionary resume educations Controller Spec
	describe('Functionary resume educations Controller Tests', function() {
		// Initialize global variables
		var FunctionaryResumeEducationsController,
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

			// Initialize the Functionary resume educations controller.
			FunctionaryResumeEducationsController = $controller('FunctionaryResumeEducationsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Functionary resume education object fetched from XHR', inject(function(FunctionaryResumeEducations) {
			// Create sample Functionary resume education using the Functionary resume educations service
			var sampleFunctionaryResumeEducation = new FunctionaryResumeEducations({
				name: 'New Functionary resume education'
			});

			// Create a sample Functionary resume educations array that includes the new Functionary resume education
			var sampleFunctionaryResumeEducations = [sampleFunctionaryResumeEducation];

			// Set GET response
			$httpBackend.expectGET('functionary-resume-educations').respond(sampleFunctionaryResumeEducations);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.functionaryResumeEducations).toEqualData(sampleFunctionaryResumeEducations);
		}));

		it('$scope.findOne() should create an array with one Functionary resume education object fetched from XHR using a functionaryResumeEducationId URL parameter', inject(function(FunctionaryResumeEducations) {
			// Define a sample Functionary resume education object
			var sampleFunctionaryResumeEducation = new FunctionaryResumeEducations({
				name: 'New Functionary resume education'
			});

			// Set the URL parameter
			$stateParams.functionaryResumeEducationId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/functionary-resume-educations\/([0-9a-fA-F]{24})$/).respond(sampleFunctionaryResumeEducation);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.functionaryResumeEducation).toEqualData(sampleFunctionaryResumeEducation);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(FunctionaryResumeEducations) {
			// Create a sample Functionary resume education object
			var sampleFunctionaryResumeEducationPostData = new FunctionaryResumeEducations({
				name: 'New Functionary resume education'
			});

			// Create a sample Functionary resume education response
			var sampleFunctionaryResumeEducationResponse = new FunctionaryResumeEducations({
				_id: '525cf20451979dea2c000001',
				name: 'New Functionary resume education'
			});

			// Fixture mock form input values
			scope.name = 'New Functionary resume education';

			// Set POST response
			$httpBackend.expectPOST('functionary-resume-educations', sampleFunctionaryResumeEducationPostData).respond(sampleFunctionaryResumeEducationResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Functionary resume education was created
			expect($location.path()).toBe('/functionary-resume-educations/' + sampleFunctionaryResumeEducationResponse._id);
		}));

		it('$scope.update() should update a valid Functionary resume education', inject(function(FunctionaryResumeEducations) {
			// Define a sample Functionary resume education put data
			var sampleFunctionaryResumeEducationPutData = new FunctionaryResumeEducations({
				_id: '525cf20451979dea2c000001',
				name: 'New Functionary resume education'
			});

			// Mock Functionary resume education in scope
			scope.functionaryResumeEducation = sampleFunctionaryResumeEducationPutData;

			// Set PUT response
			$httpBackend.expectPUT(/functionary-resume-educations\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/functionary-resume-educations/' + sampleFunctionaryResumeEducationPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid functionaryResumeEducationId and remove the Functionary resume education from the scope', inject(function(FunctionaryResumeEducations) {
			// Create new Functionary resume education object
			var sampleFunctionaryResumeEducation = new FunctionaryResumeEducations({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Functionary resume educations array and include the Functionary resume education
			scope.functionaryResumeEducations = [sampleFunctionaryResumeEducation];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/functionary-resume-educations\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleFunctionaryResumeEducation);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.functionaryResumeEducations.length).toBe(0);
		}));
	});
}());