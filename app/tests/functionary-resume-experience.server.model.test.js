'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	FunctionaryResumeExperience = mongoose.model('FunctionaryResumeExperience');

/**
 * Globals
 */
var user, functionaryResumeExperience;

/**
 * Unit tests
 */
describe('Functionary resume experience Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			functionaryResumeExperience = new FunctionaryResumeExperience({
				name: 'Functionary resume experience Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return functionaryResumeExperience.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			functionaryResumeExperience.name = '';

			return functionaryResumeExperience.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		FunctionaryResumeExperience.remove().exec();
		User.remove().exec();

		done();
	});
});