'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	FunctionaryResumeLanguage = mongoose.model('FunctionaryResumeLanguage'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, functionaryResumeLanguage;

/**
 * Functionary resume language routes tests
 */
describe('Functionary resume language CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Functionary resume language
		user.save(function() {
			functionaryResumeLanguage = {
				name: 'Functionary resume language Name'
			};

			done();
		});
	});

	it('should be able to save Functionary resume language instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Functionary resume language
				agent.post('/functionary-resume-languages')
					.send(functionaryResumeLanguage)
					.expect(200)
					.end(function(functionaryResumeLanguageSaveErr, functionaryResumeLanguageSaveRes) {
						// Handle Functionary resume language save error
						if (functionaryResumeLanguageSaveErr) done(functionaryResumeLanguageSaveErr);

						// Get a list of Functionary resume languages
						agent.get('/functionary-resume-languages')
							.end(function(functionaryResumeLanguagesGetErr, functionaryResumeLanguagesGetRes) {
								// Handle Functionary resume language save error
								if (functionaryResumeLanguagesGetErr) done(functionaryResumeLanguagesGetErr);

								// Get Functionary resume languages list
								var functionaryResumeLanguages = functionaryResumeLanguagesGetRes.body;

								// Set assertions
								(functionaryResumeLanguages[0].user._id).should.equal(userId);
								(functionaryResumeLanguages[0].name).should.match('Functionary resume language Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Functionary resume language instance if not logged in', function(done) {
		agent.post('/functionary-resume-languages')
			.send(functionaryResumeLanguage)
			.expect(401)
			.end(function(functionaryResumeLanguageSaveErr, functionaryResumeLanguageSaveRes) {
				// Call the assertion callback
				done(functionaryResumeLanguageSaveErr);
			});
	});

	it('should not be able to save Functionary resume language instance if no name is provided', function(done) {
		// Invalidate name field
		functionaryResumeLanguage.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Functionary resume language
				agent.post('/functionary-resume-languages')
					.send(functionaryResumeLanguage)
					.expect(400)
					.end(function(functionaryResumeLanguageSaveErr, functionaryResumeLanguageSaveRes) {
						// Set message assertion
						(functionaryResumeLanguageSaveRes.body.message).should.match('Please fill Functionary resume language name');
						
						// Handle Functionary resume language save error
						done(functionaryResumeLanguageSaveErr);
					});
			});
	});

	it('should be able to update Functionary resume language instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Functionary resume language
				agent.post('/functionary-resume-languages')
					.send(functionaryResumeLanguage)
					.expect(200)
					.end(function(functionaryResumeLanguageSaveErr, functionaryResumeLanguageSaveRes) {
						// Handle Functionary resume language save error
						if (functionaryResumeLanguageSaveErr) done(functionaryResumeLanguageSaveErr);

						// Update Functionary resume language name
						functionaryResumeLanguage.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Functionary resume language
						agent.put('/functionary-resume-languages/' + functionaryResumeLanguageSaveRes.body._id)
							.send(functionaryResumeLanguage)
							.expect(200)
							.end(function(functionaryResumeLanguageUpdateErr, functionaryResumeLanguageUpdateRes) {
								// Handle Functionary resume language update error
								if (functionaryResumeLanguageUpdateErr) done(functionaryResumeLanguageUpdateErr);

								// Set assertions
								(functionaryResumeLanguageUpdateRes.body._id).should.equal(functionaryResumeLanguageSaveRes.body._id);
								(functionaryResumeLanguageUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Functionary resume languages if not signed in', function(done) {
		// Create new Functionary resume language model instance
		var functionaryResumeLanguageObj = new FunctionaryResumeLanguage(functionaryResumeLanguage);

		// Save the Functionary resume language
		functionaryResumeLanguageObj.save(function() {
			// Request Functionary resume languages
			request(app).get('/functionary-resume-languages')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Functionary resume language if not signed in', function(done) {
		// Create new Functionary resume language model instance
		var functionaryResumeLanguageObj = new FunctionaryResumeLanguage(functionaryResumeLanguage);

		// Save the Functionary resume language
		functionaryResumeLanguageObj.save(function() {
			request(app).get('/functionary-resume-languages/' + functionaryResumeLanguageObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', functionaryResumeLanguage.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Functionary resume language instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Functionary resume language
				agent.post('/functionary-resume-languages')
					.send(functionaryResumeLanguage)
					.expect(200)
					.end(function(functionaryResumeLanguageSaveErr, functionaryResumeLanguageSaveRes) {
						// Handle Functionary resume language save error
						if (functionaryResumeLanguageSaveErr) done(functionaryResumeLanguageSaveErr);

						// Delete existing Functionary resume language
						agent.delete('/functionary-resume-languages/' + functionaryResumeLanguageSaveRes.body._id)
							.send(functionaryResumeLanguage)
							.expect(200)
							.end(function(functionaryResumeLanguageDeleteErr, functionaryResumeLanguageDeleteRes) {
								// Handle Functionary resume language error error
								if (functionaryResumeLanguageDeleteErr) done(functionaryResumeLanguageDeleteErr);

								// Set assertions
								(functionaryResumeLanguageDeleteRes.body._id).should.equal(functionaryResumeLanguageSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Functionary resume language instance if not signed in', function(done) {
		// Set Functionary resume language user 
		functionaryResumeLanguage.user = user;

		// Create new Functionary resume language model instance
		var functionaryResumeLanguageObj = new FunctionaryResumeLanguage(functionaryResumeLanguage);

		// Save the Functionary resume language
		functionaryResumeLanguageObj.save(function() {
			// Try deleting Functionary resume language
			request(app).delete('/functionary-resume-languages/' + functionaryResumeLanguageObj._id)
			.expect(401)
			.end(function(functionaryResumeLanguageDeleteErr, functionaryResumeLanguageDeleteRes) {
				// Set message assertion
				(functionaryResumeLanguageDeleteRes.body.message).should.match('User is not logged in');

				// Handle Functionary resume language error error
				done(functionaryResumeLanguageDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		FunctionaryResumeLanguage.remove().exec();
		done();
	});
});