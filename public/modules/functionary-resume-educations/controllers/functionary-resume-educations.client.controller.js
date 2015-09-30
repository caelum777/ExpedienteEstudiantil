'use strict';

// Functionary resume educations controller
angular.module('functionary-resume-educations').controller('FunctionaryResumeEducationsController', ['$scope', '$stateParams', '$location', 'Authentication', 'FunctionaryResumeEducations',
	function($scope, $stateParams, $location, Authentication, FunctionaryResumeEducations) {
		$scope.authentication = Authentication;

		// Create new Functionary resume education
		$scope.create = function() {
			// Create new Functionary resume education object
			var functionaryResumeEducation = new FunctionaryResumeEducations ({
				name: this.name
			});

			// Redirect after save
			functionaryResumeEducation.$save(function(response) {
				$location.path('functionary-resume-educations/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Functionary resume education
		$scope.remove = function(functionaryResumeEducation) {
			if ( functionaryResumeEducation ) { 
				functionaryResumeEducation.$remove();

				for (var i in $scope.functionaryResumeEducations) {
					if ($scope.functionaryResumeEducations [i] === functionaryResumeEducation) {
						$scope.functionaryResumeEducations.splice(i, 1);
					}
				}
			} else {
				$scope.functionaryResumeEducation.$remove(function() {
					$location.path('functionary-resume-educations');
				});
			}
		};

		// Update existing Functionary resume education
		$scope.update = function() {
			var functionaryResumeEducation = $scope.functionaryResumeEducation;

			functionaryResumeEducation.$update(function() {
				$location.path('functionary-resume-educations/' + functionaryResumeEducation._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Functionary resume educations
		$scope.find = function() {
			$scope.functionaryResumeEducations = FunctionaryResumeEducations.query();
		};

		// Find existing Functionary resume education
		$scope.findOne = function() {
			$scope.functionaryResumeEducation = FunctionaryResumeEducations.get({ 
				functionaryResumeEducationId: $stateParams.functionaryResumeEducationId
			});
		};
	}
]);