'use strict';

// Functionary resume languages controller
angular.module('functionary-resume-languages').controller('FunctionaryResumeLanguagesController', ['$scope', '$stateParams', '$location', 'Authentication', 'FunctionaryResumeLanguages',
	function($scope, $stateParams, $location, Authentication, FunctionaryResumeLanguages) {
		$scope.authentication = Authentication;

		// Create new Functionary resume language
		$scope.create = function() {
			// Create new Functionary resume language object
			var functionaryResumeLanguage = new FunctionaryResumeLanguages ({
				name: this.name
			});

			// Redirect after save
			functionaryResumeLanguage.$save(function(response) {
				$location.path('functionary-resume-languages/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Functionary resume language
		$scope.remove = function(functionaryResumeLanguage) {
			if ( functionaryResumeLanguage ) { 
				functionaryResumeLanguage.$remove();

				for (var i in $scope.functionaryResumeLanguages) {
					if ($scope.functionaryResumeLanguages [i] === functionaryResumeLanguage) {
						$scope.functionaryResumeLanguages.splice(i, 1);
					}
				}
			} else {
				$scope.functionaryResumeLanguage.$remove(function() {
					$location.path('functionary-resume-languages');
				});
			}
		};

		// Update existing Functionary resume language
		$scope.update = function() {
			var functionaryResumeLanguage = $scope.functionaryResumeLanguage;

			functionaryResumeLanguage.$update(function() {
				$location.path('functionary-resume-languages/' + functionaryResumeLanguage._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Functionary resume languages
		$scope.find = function() {
			$scope.functionaryResumeLanguages = FunctionaryResumeLanguages.query();
		};

		// Find existing Functionary resume language
		$scope.findOne = function() {
			$scope.functionaryResumeLanguage = FunctionaryResumeLanguages.get({ 
				functionaryResumeLanguageId: $stateParams.functionaryResumeLanguageId
			});
		};
	}
]);