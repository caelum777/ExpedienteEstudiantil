'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	LogrosAcademico = mongoose.model('LogrosAcademico');

/**
 * Globals
 */
var user, logrosAcademico;

/**
 * Unit tests
 */
describe('Logros academico Model Unit Tests:', function() {
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
			logrosAcademico = new LogrosAcademico({
				name: 'Logros academico Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return logrosAcademico.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			logrosAcademico.name = '';

			return logrosAcademico.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		LogrosAcademico.remove().exec();
		User.remove().exec();

		done();
	});
});