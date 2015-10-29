'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	FunctionaryResumeEducation = mongoose.model('FunctionaryResumeEducation'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, functionaryResumeEducation;

/**
 * Functionary resume education routes tests
 */
describe('Functionary resume education CRUD tests', function() {
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

		// Save a user to the test db and create new Functionary resume education
		user.save(function() {
			functionaryResumeEducation = {
				name: 'Functionary resume education Name'
			};

			done();
		});
	});

	it('should be able to save Functionary resume education instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Functionary resume education
				agent.post('/functionary-resume-educations')
					.send(functionaryResumeEducation)
					.expect(200)
					.end(function(functionaryResumeEducationSaveErr, functionaryResumeEducationSaveRes) {
						// Handle Functionary resume education save error
						if (functionaryResumeEducationSaveErr) done(functionaryResumeEducationSaveErr);

						// Get a list of Functionary resume educations
						agent.get('/functionary-resume-educations')
							.end(function(functionaryResumeEducationsGetErr, functionaryResumeEducationsGetRes) {
								// Handle Functionary resume education save error
								if (functionaryResumeEducationsGetErr) done(functionaryResumeEducationsGetErr);

								// Get Functionary resume educations list
								var functionaryResumeEducations = functionaryResumeEducationsGetRes.body;

								// Set assertions
								(functionaryResumeEducations[0].user._id).should.equal(userId);
								(functionaryResumeEducations[0].name).should.match('Functionary resume education Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Functionary resume education instance if not logged in', function(done) {
		agent.post('/functionary-resume-educations')
			.send(functionaryResumeEducation)
			.expect(401)
			.end(function(functionaryResumeEducationSaveErr, functionaryResumeEducationSaveRes) {
				// Call the assertion callback
				done(functionaryResumeEducationSaveErr);
			});
	});

	it('should not be able to save Functionary resume education instance if no name is provided', function(done) {
		// Invalidate name field
		functionaryResumeEducation.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Functionary resume education
				agent.post('/functionary-resume-educations')
					.send(functionaryResumeEducation)
					.expect(400)
					.end(function(functionaryResumeEducationSaveErr, functionaryResumeEducationSaveRes) {
						// Set message assertion
						(functionaryResumeEducationSaveRes.body.message).should.match('Please fill Functionary resume education name');
						
						// Handle Functionary resume education save error
						done(functionaryResumeEducationSaveErr);
					});
			});
	});

	it('should be able to update Functionary resume education instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Functionary resume education
				agent.post('/functionary-resume-educations')
					.send(functionaryResumeEducation)
					.expect(200)
					.end(function(functionaryResumeEducationSaveErr, functionaryResumeEducationSaveRes) {
						// Handle Functionary resume education save error
						if (functionaryResumeEducationSaveErr) done(functionaryResumeEducationSaveErr);

						// Update Functionary resume education name
						functionaryResumeEducation.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Functionary resume education
						agent.put('/functionary-resume-educations/' + functionaryResumeEducationSaveRes.body._id)
							.send(functionaryResumeEducation)
							.expect(200)
							.end(function(functionaryResumeEducationUpdateErr, functionaryResumeEducationUpdateRes) {
								// Handle Functionary resume education update error
								if (functionaryResumeEducationUpdateErr) done(functionaryResumeEducationUpdateErr);

								// Set assertions
								(functionaryResumeEducationUpdateRes.body._id).should.equal(functionaryResumeEducationSaveRes.body._id);
								(functionaryResumeEducationUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Functionary resume educations if not signed in', function(done) {
		// Create new Functionary resume education model instance
		var functionaryResumeEducationObj = new FunctionaryResumeEducation(functionaryResumeEducation);

		// Save the Functionary resume education
		functionaryResumeEducationObj.save(function() {
			// Request Functionary resume educations
			request(app).get('/functionary-resume-educations')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Functionary resume education if not signed in', function(done) {
		// Create new Functionary resume education model instance
		var functionaryResumeEducationObj = new FunctionaryResumeEducation(functionaryResumeEducation);

		// Save the Functionary resume education
		functionaryResumeEducationObj.save(function() {
			request(app).get('/functionary-resume-educations/' + functionaryResumeEducationObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', functionaryResumeEducation.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Functionary resume education instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Functionary resume education
				agent.post('/functionary-resume-educations')
					.send(functionaryResumeEducation)
					.expect(200)
					.end(function(functionaryResumeEducationSaveErr, functionaryResumeEducationSaveRes) {
						// Handle Functionary resume education save error
						if (functionaryResumeEducationSaveErr) done(functionaryResumeEducationSaveErr);

						// Delete existing Functionary resume education
						agent.delete('/functionary-resume-educations/' + functionaryResumeEducationSaveRes.body._id)
							.send(functionaryResumeEducation)
							.expect(200)
							.end(function(functionaryResumeEducationDeleteErr, functionaryResumeEducationDeleteRes) {
								// Handle Functionary resume education error error
								if (functionaryResumeEducationDeleteErr) done(functionaryResumeEducationDeleteErr);

								// Set assertions
								(functionaryResumeEducationDeleteRes.body._id).should.equal(functionaryResumeEducationSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Functionary resume education instance if not signed in', function(done) {
		// Set Functionary resume education user 
		functionaryResumeEducation.user = user;

		// Create new Functionary resume education model instance
		var functionaryResumeEducationObj = new FunctionaryResumeEducation(functionaryResumeEducation);

		// Save the Functionary resume education
		functionaryResumeEducationObj.save(function() {
			// Try deleting Functionary resume education
			request(app).delete('/functionary-resume-educations/' + functionaryResumeEducationObj._id)
			.expect(401)
			.end(function(functionaryResumeEducationDeleteErr, functionaryResumeEducationDeleteRes) {
				// Set message assertion
				(functionaryResumeEducationDeleteRes.body.message).should.match('User is not logged in');

				// Handle Functionary resume education error error
				done(functionaryResumeEducationDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		FunctionaryResumeEducation.remove().exec();
		done();
	});
});