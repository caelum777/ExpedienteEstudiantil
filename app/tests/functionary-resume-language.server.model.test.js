'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	FunctionaryResumeLanguage = mongoose.model('FunctionaryResumeLanguage');

/**
 * Globals
 */
var user, functionaryResumeLanguage;

/**
 * Unit tests
 */
describe('Functionary resume language Model Unit Tests:', function() {
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
			functionaryResumeLanguage = new FunctionaryResumeLanguage({
				name: 'Functionary resume language Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return functionaryResumeLanguage.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			functionaryResumeLanguage.name = '';

			return functionaryResumeLanguage.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		FunctionaryResumeLanguage.remove().exec();
		User.remove().exec();

		done();
	});
});