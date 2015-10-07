'use strict';

// Functionary resume experiences controller
angular.module('functionary-resume-experiences').controller('FunctionaryResumeExperiencesController', ['$scope', '$stateParams', '$location', 'Authentication', 'FunctionaryResumeExperiences', 'Utility',
	function($scope, $stateParams, $location, Authentication, FunctionaryResumeExperiences, Utility) {
		$scope.authentication = Authentication;

		// Create new Functionary resume experience
		$scope.create = function() {
			// Create new Functionary resume experience object
			var functionaryResumeExperience = new FunctionaryResumeExperiences ({
				companyName: this.companyName,
				functionaryTitle: this.functionaryTitle,
				description: this.description,
				attendedStartDate: this.startDate,
				attendedEndDate: this.endDate
			});

			// Redirect after save
			functionaryResumeExperience.$save(function(response) {
				$location.path('functionary-resume-experiences/' + response._id);

				// Clear form fields

				$scope.companyName = '';
				$scope.functionaryTitle = '';
				$scope.description = '';
				$scope.attendedStartDate = '';
				$scope.attendedEndDate = '';

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Functionary resume experience
		$scope.remove = function(functionaryResumeExperience) {
			if ( functionaryResumeExperience ) { 
				functionaryResumeExperience.$remove();

				for (var i in $scope.functionaryResumeExperiences) {
					if ($scope.functionaryResumeExperiences [i] === functionaryResumeExperience) {
						$scope.functionaryResumeExperiences.splice(i, 1);
					}
				}
			} else {
				$scope.functionaryResumeExperience.$remove(function() {
					$location.path('functionary-resume-experiences');
				});
			}
		};

		// Update existing Functionary resume experience
		$scope.update = function() {
			var functionaryResumeExperience = $scope.functionaryResumeExperience;

			functionaryResumeExperience.$update(function() {
				$location.path('functionary-resume-experiences/' + functionaryResumeExperience._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Functionary resume experiences
		$scope.find = function() {
			$scope.functionaryResumeExperiences = FunctionaryResumeExperiences.query();
		};

		// Find existing Functionary resume experience
		$scope.findOne = function() {
			$scope.functionaryResumeExperience = FunctionaryResumeExperiences.get({ 
				functionaryResumeExperienceId: $stateParams.functionaryResumeExperienceId
			});
		};

		$scope.optionsYearRange = Utility.generateListOfYears();

		$scope.attendedStartDate = $scope.optionsYearRange[$scope.optionsYearRange.length-2];
		$scope.attendedEndDate = $scope.optionsYearRange[$scope.optionsYearRange.length-1];

	}
]);
