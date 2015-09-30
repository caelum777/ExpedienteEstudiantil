'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	FunctionaryResumeEducation = mongoose.model('FunctionaryResumeEducation');

/**
 * Globals
 */
var user, functionaryResumeEducation;

/**
 * Unit tests
 */
describe('Functionary resume education Model Unit Tests:', function() {
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
			functionaryResumeEducation = new FunctionaryResumeEducation({
				name: 'Functionary resume education Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return functionaryResumeEducation.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			functionaryResumeEducation.name = '';

			return functionaryResumeEducation.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		FunctionaryResumeEducation.remove().exec();
		User.remove().exec();

		done();
	});
});