'use strict';

(function() {
	// Functionary resume experiences Controller Spec
	describe('Functionary resume experiences Controller Tests', function() {
		// Initialize global variables
		var FunctionaryResumeExperiencesController,
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

			// Initialize the Functionary resume experiences controller.
			FunctionaryResumeExperiencesController = $controller('FunctionaryResumeExperiencesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Functionary resume experience object fetched from XHR', inject(function(FunctionaryResumeExperiences) {
			// Create sample Functionary resume experience using the Functionary resume experiences service
			var sampleFunctionaryResumeExperience = new FunctionaryResumeExperiences({
				name: 'New Functionary resume experience'
			});

			// Create a sample Functionary resume experiences array that includes the new Functionary resume experience
			var sampleFunctionaryResumeExperiences = [sampleFunctionaryResumeExperience];

			// Set GET response
			$httpBackend.expectGET('functionary-resume-experiences').respond(sampleFunctionaryResumeExperiences);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.functionaryResumeExperiences).toEqualData(sampleFunctionaryResumeExperiences);
		}));

		it('$scope.findOne() should create an array with one Functionary resume experience object fetched from XHR using a functionaryResumeExperienceId URL parameter', inject(function(FunctionaryResumeExperiences) {
			// Define a sample Functionary resume experience object
			var sampleFunctionaryResumeExperience = new FunctionaryResumeExperiences({
				name: 'New Functionary resume experience'
			});

			// Set the URL parameter
			$stateParams.functionaryResumeExperienceId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/functionary-resume-experiences\/([0-9a-fA-F]{24})$/).respond(sampleFunctionaryResumeExperience);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.functionaryResumeExperience).toEqualData(sampleFunctionaryResumeExperience);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(FunctionaryResumeExperiences) {
			// Create a sample Functionary resume experience object
			var sampleFunctionaryResumeExperiencePostData = new FunctionaryResumeExperiences({
				name: 'New Functionary resume experience'
			});

			// Create a sample Functionary resume experience response
			var sampleFunctionaryResumeExperienceResponse = new FunctionaryResumeExperiences({
				_id: '525cf20451979dea2c000001',
				name: 'New Functionary resume experience'
			});

			// Fixture mock form input values
			scope.name = 'New Functionary resume experience';

			// Set POST response
			$httpBackend.expectPOST('functionary-resume-experiences', sampleFunctionaryResumeExperiencePostData).respond(sampleFunctionaryResumeExperienceResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Functionary resume experience was created
			expect($location.path()).toBe('/functionary-resume-experiences/' + sampleFunctionaryResumeExperienceResponse._id);
		}));

		it('$scope.update() should update a valid Functionary resume experience', inject(function(FunctionaryResumeExperiences) {
			// Define a sample Functionary resume experience put data
			var sampleFunctionaryResumeExperiencePutData = new FunctionaryResumeExperiences({
				_id: '525cf20451979dea2c000001',
				name: 'New Functionary resume experience'
			});

			// Mock Functionary resume experience in scope
			scope.functionaryResumeExperience = sampleFunctionaryResumeExperiencePutData;

			// Set PUT response
			$httpBackend.expectPUT(/functionary-resume-experiences\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/functionary-resume-experiences/' + sampleFunctionaryResumeExperiencePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid functionaryResumeExperienceId and remove the Functionary resume experience from the scope', inject(function(FunctionaryResumeExperiences) {
			// Create new Functionary resume experience object
			var sampleFunctionaryResumeExperience = new FunctionaryResumeExperiences({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Functionary resume experiences array and include the Functionary resume experience
			scope.functionaryResumeExperiences = [sampleFunctionaryResumeExperience];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/functionary-resume-experiences\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleFunctionaryResumeExperience);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.functionaryResumeExperiences.length).toBe(0);
		}));
	});
}());