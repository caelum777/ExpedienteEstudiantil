'use strict';

// Functionaries controller
angular.module('functionaries').controller('FunctionariesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Functionaries',
	function($scope, $stateParams, $location, Authentication, Functionaries) {
		$scope.authentication = Authentication;

		// Create new Functionary
		$scope.create = function() {
			// Create new Functionary object
			var functionary = new Functionaries ({
				firstName: this.firstName,
				firstSurname: this.firstSurname,
				secondSurname: this.secondSurname,
				identification: this.identification,
				maritalStatus: this.maritalStatus,
				address: this.address,
				phoneNumber: this.phoneNumber,
				cellphoneNumber: this.cellphoneNumber,
				email: this.email,
				hireDate: this.hireDate,
				status: this.status,
			});

			// Redirect after save
			functionary.$save(function(response) {
				$location.path('functionaries/' + response._id);
				// Clear form fields
				$scope.firstName  = '';
				$scope.firstSurname = '';
				$scope.secondSurname = '';
				$scope.identification = '';
				$scope.maritalStatus = '';
				$scope.phoneNumber = '';
				$scope.cellphoneNumber = '';
				$scope.email = '';
				$scope.hireDate = '';
				$scope.status = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Functionary
		$scope.remove = function(functionary) {
			if ( functionary ) { 
				functionary.$remove();

				for (var i in $scope.functionaries) {
					if ($scope.functionaries [i] === functionary) {
						$scope.functionaries.splice(i, 1);
					}
				}
			} else {
				$scope.functionary.$remove(function() {
					$location.path('functionaries');
				});
			}
		};

		// Update existing Functionary
		$scope.update = function() {
			var functionary = $scope.functionary;

			functionary.$update(function() {
				$location.path('functionaries/' + functionary._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Functionaries
		$scope.find = function() {
			$scope.functionaries = Functionaries.query();
		};

		// Find existing Functionary
		$scope.findOne = function() {
			$scope.functionary = Functionaries.get({ 
				functionaryId: $stateParams.functionaryId
			});
		};
	}
]);
