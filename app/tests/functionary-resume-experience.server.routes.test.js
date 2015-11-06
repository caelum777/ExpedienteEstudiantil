'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	FunctionaryResumeExperience = mongoose.model('FunctionaryResumeExperience'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, functionaryResumeExperience;

/**
 * Functionary resume experience routes tests
 */
describe('Functionary resume experience CRUD tests', function() {
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

		// Save a user to the test db and create new Functionary resume experience
		user.save(function() {
			functionaryResumeExperience = {
				name: 'Functionary resume experience Name'
			};

			done();
		});
	});

	it('should be able to save Functionary resume experience instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Functionary resume experience
				agent.post('/functionary-resume-experiences')
					.send(functionaryResumeExperience)
					.expect(200)
					.end(function(functionaryResumeExperienceSaveErr, functionaryResumeExperienceSaveRes) {
						// Handle Functionary resume experience save error
						if (functionaryResumeExperienceSaveErr) done(functionaryResumeExperienceSaveErr);

						// Get a list of Functionary resume experiences
						agent.get('/functionary-resume-experiences')
							.end(function(functionaryResumeExperiencesGetErr, functionaryResumeExperiencesGetRes) {
								// Handle Functionary resume experience save error
								if (functionaryResumeExperiencesGetErr) done(functionaryResumeExperiencesGetErr);

								// Get Functionary resume experiences list
								var functionaryResumeExperiences = functionaryResumeExperiencesGetRes.body;

								// Set assertions
								(functionaryResumeExperiences[0].user._id).should.equal(userId);
								(functionaryResumeExperiences[0].name).should.match('Functionary resume experience Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Functionary resume experience instance if not logged in', function(done) {
		agent.post('/functionary-resume-experiences')
			.send(functionaryResumeExperience)
			.expect(401)
			.end(function(functionaryResumeExperienceSaveErr, functionaryResumeExperienceSaveRes) {
				// Call the assertion callback
				done(functionaryResumeExperienceSaveErr);
			});
	});

	it('should not be able to save Functionary resume experience instance if no name is provided', function(done) {
		// Invalidate name field
		functionaryResumeExperience.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Functionary resume experience
				agent.post('/functionary-resume-experiences')
					.send(functionaryResumeExperience)
					.expect(400)
					.end(function(functionaryResumeExperienceSaveErr, functionaryResumeExperienceSaveRes) {
						// Set message assertion
						(functionaryResumeExperienceSaveRes.body.message).should.match('Please fill Functionary resume experience name');
						
						// Handle Functionary resume experience save error
						done(functionaryResumeExperienceSaveErr);
					});
			});
	});

	it('should be able to update Functionary resume experience instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Functionary resume experience
				agent.post('/functionary-resume-experiences')
					.send(functionaryResumeExperience)
					.expect(200)
					.end(function(functionaryResumeExperienceSaveErr, functionaryResumeExperienceSaveRes) {
						// Handle Functionary resume experience save error
						if (functionaryResumeExperienceSaveErr) done(functionaryResumeExperienceSaveErr);

						// Update Functionary resume experience name
						functionaryResumeExperience.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Functionary resume experience
						agent.put('/functionary-resume-experiences/' + functionaryResumeExperienceSaveRes.body._id)
							.send(functionaryResumeExperience)
							.expect(200)
							.end(function(functionaryResumeExperienceUpdateErr, functionaryResumeExperienceUpdateRes) {
								// Handle Functionary resume experience update error
								if (functionaryResumeExperienceUpdateErr) done(functionaryResumeExperienceUpdateErr);

								// Set assertions
								(functionaryResumeExperienceUpdateRes.body._id).should.equal(functionaryResumeExperienceSaveRes.body._id);
								(functionaryResumeExperienceUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Functionary resume experiences if not signed in', function(done) {
		// Create new Functionary resume experience model instance
		var functionaryResumeExperienceObj = new FunctionaryResumeExperience(functionaryResumeExperience);

		// Save the Functionary resume experience
		functionaryResumeExperienceObj.save(function() {
			// Request Functionary resume experiences
			request(app).get('/functionary-resume-experiences')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Functionary resume experience if not signed in', function(done) {
		// Create new Functionary resume experience model instance
		var functionaryResumeExperienceObj = new FunctionaryResumeExperience(functionaryResumeExperience);

		// Save the Functionary resume experience
		functionaryResumeExperienceObj.save(function() {
			request(app).get('/functionary-resume-experiences/' + functionaryResumeExperienceObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', functionaryResumeExperience.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Functionary resume experience instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Functionary resume experience
				agent.post('/functionary-resume-experiences')
					.send(functionaryResumeExperience)
					.expect(200)
					.end(function(functionaryResumeExperienceSaveErr, functionaryResumeExperienceSaveRes) {
						// Handle Functionary resume experience save error
						if (functionaryResumeExperienceSaveErr) done(functionaryResumeExperienceSaveErr);

						// Delete existing Functionary resume experience
						agent.delete('/functionary-resume-experiences/' + functionaryResumeExperienceSaveRes.body._id)
							.send(functionaryResumeExperience)
							.expect(200)
							.end(function(functionaryResumeExperienceDeleteErr, functionaryResumeExperienceDeleteRes) {
								// Handle Functionary resume experience error error
								if (functionaryResumeExperienceDeleteErr) done(functionaryResumeExperienceDeleteErr);

								// Set assertions
								(functionaryResumeExperienceDeleteRes.body._id).should.equal(functionaryResumeExperienceSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Functionary resume experience instance if not signed in', function(done) {
		// Set Functionary resume experience user 
		functionaryResumeExperience.user = user;

		// Create new Functionary resume experience model instance
		var functionaryResumeExperienceObj = new FunctionaryResumeExperience(functionaryResumeExperience);

		// Save the Functionary resume experience
		functionaryResumeExperienceObj.save(function() {
			// Try deleting Functionary resume experience
			request(app).delete('/functionary-resume-experiences/' + functionaryResumeExperienceObj._id)
			.expect(401)
			.end(function(functionaryResumeExperienceDeleteErr, functionaryResumeExperienceDeleteRes) {
				// Set message assertion
				(functionaryResumeExperienceDeleteRes.body.message).should.match('User is not logged in');

				// Handle Functionary resume experience error error
				done(functionaryResumeExperienceDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		FunctionaryResumeExperience.remove().exec();
		done();
	});
});