'use strict';

(function() {
	// Functionary resume languages Controller Spec
	describe('Functionary resume languages Controller Tests', function() {
		// Initialize global variables
		var FunctionaryResumeLanguagesController,
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

			// Initialize the Functionary resume languages controller.
			FunctionaryResumeLanguagesController = $controller('FunctionaryResumeLanguagesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Functionary resume language object fetched from XHR', inject(function(FunctionaryResumeLanguages) {
			// Create sample Functionary resume language using the Functionary resume languages service
			var sampleFunctionaryResumeLanguage = new FunctionaryResumeLanguages({
				name: 'New Functionary resume language'
			});

			// Create a sample Functionary resume languages array that includes the new Functionary resume language
			var sampleFunctionaryResumeLanguages = [sampleFunctionaryResumeLanguage];

			// Set GET response
			$httpBackend.expectGET('functionary-resume-languages').respond(sampleFunctionaryResumeLanguages);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.functionaryResumeLanguages).toEqualData(sampleFunctionaryResumeLanguages);
		}));

		it('$scope.findOne() should create an array with one Functionary resume language object fetched from XHR using a functionaryResumeLanguageId URL parameter', inject(function(FunctionaryResumeLanguages) {
			// Define a sample Functionary resume language object
			var sampleFunctionaryResumeLanguage = new FunctionaryResumeLanguages({
				name: 'New Functionary resume language'
			});

			// Set the URL parameter
			$stateParams.functionaryResumeLanguageId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/functionary-resume-languages\/([0-9a-fA-F]{24})$/).respond(sampleFunctionaryResumeLanguage);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.functionaryResumeLanguage).toEqualData(sampleFunctionaryResumeLanguage);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(FunctionaryResumeLanguages) {
			// Create a sample Functionary resume language object
			var sampleFunctionaryResumeLanguagePostData = new FunctionaryResumeLanguages({
				name: 'New Functionary resume language'
			});

			// Create a sample Functionary resume language response
			var sampleFunctionaryResumeLanguageResponse = new FunctionaryResumeLanguages({
				_id: '525cf20451979dea2c000001',
				name: 'New Functionary resume language'
			});

			// Fixture mock form input values
			scope.name = 'New Functionary resume language';

			// Set POST response
			$httpBackend.expectPOST('functionary-resume-languages', sampleFunctionaryResumeLanguagePostData).respond(sampleFunctionaryResumeLanguageResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Functionary resume language was created
			expect($location.path()).toBe('/functionary-resume-languages/' + sampleFunctionaryResumeLanguageResponse._id);
		}));

		it('$scope.update() should update a valid Functionary resume language', inject(function(FunctionaryResumeLanguages) {
			// Define a sample Functionary resume language put data
			var sampleFunctionaryResumeLanguagePutData = new FunctionaryResumeLanguages({
				_id: '525cf20451979dea2c000001',
				name: 'New Functionary resume language'
			});

			// Mock Functionary resume language in scope
			scope.functionaryResumeLanguage = sampleFunctionaryResumeLanguagePutData;

			// Set PUT response
			$httpBackend.expectPUT(/functionary-resume-languages\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/functionary-resume-languages/' + sampleFunctionaryResumeLanguagePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid functionaryResumeLanguageId and remove the Functionary resume language from the scope', inject(function(FunctionaryResumeLanguages) {
			// Create new Functionary resume language object
			var sampleFunctionaryResumeLanguage = new FunctionaryResumeLanguages({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Functionary resume languages array and include the Functionary resume language
			scope.functionaryResumeLanguages = [sampleFunctionaryResumeLanguage];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/functionary-resume-languages\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleFunctionaryResumeLanguage);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.functionaryResumeLanguages.length).toBe(0);
		}));
	});
}());