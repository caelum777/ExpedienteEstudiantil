'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Functionary = mongoose.model('Functionary'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, functionary;

/**
 * Functionary routes tests
 */
describe('Functionary CRUD tests', function() {
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

		// Save a user to the test db and create new Functionary
		user.save(function() {
			functionary = {
				name: 'Functionary Name'
			};

			done();
		});
	});

	it('should be able to save Functionary instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Functionary
				agent.post('/functionaries')
					.send(functionary)
					.expect(200)
					.end(function(functionarySaveErr, functionarySaveRes) {
						// Handle Functionary save error
						if (functionarySaveErr) done(functionarySaveErr);

						// Get a list of Functionaries
						agent.get('/functionaries')
							.end(function(functionariesGetErr, functionariesGetRes) {
								// Handle Functionary save error
								if (functionariesGetErr) done(functionariesGetErr);

								// Get Functionaries list
								var functionaries = functionariesGetRes.body;

								// Set assertions
								(functionaries[0].user._id).should.equal(userId);
								(functionaries[0].name).should.match('Functionary Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Functionary instance if not logged in', function(done) {
		agent.post('/functionaries')
			.send(functionary)
			.expect(401)
			.end(function(functionarySaveErr, functionarySaveRes) {
				// Call the assertion callback
				done(functionarySaveErr);
			});
	});

	it('should not be able to save Functionary instance if no name is provided', function(done) {
		// Invalidate name field
		functionary.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Functionary
				agent.post('/functionaries')
					.send(functionary)
					.expect(400)
					.end(function(functionarySaveErr, functionarySaveRes) {
						// Set message assertion
						(functionarySaveRes.body.message).should.match('Please fill Functionary name');
						
						// Handle Functionary save error
						done(functionarySaveErr);
					});
			});
	});

	it('should be able to update Functionary instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Functionary
				agent.post('/functionaries')
					.send(functionary)
					.expect(200)
					.end(function(functionarySaveErr, functionarySaveRes) {
						// Handle Functionary save error
						if (functionarySaveErr) done(functionarySaveErr);

						// Update Functionary name
						functionary.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Functionary
						agent.put('/functionaries/' + functionarySaveRes.body._id)
							.send(functionary)
							.expect(200)
							.end(function(functionaryUpdateErr, functionaryUpdateRes) {
								// Handle Functionary update error
								if (functionaryUpdateErr) done(functionaryUpdateErr);

								// Set assertions
								(functionaryUpdateRes.body._id).should.equal(functionarySaveRes.body._id);
								(functionaryUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Functionaries if not signed in', function(done) {
		// Create new Functionary model instance
		var functionaryObj = new Functionary(functionary);

		// Save the Functionary
		functionaryObj.save(function() {
			// Request Functionaries
			request(app).get('/functionaries')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Functionary if not signed in', function(done) {
		// Create new Functionary model instance
		var functionaryObj = new Functionary(functionary);

		// Save the Functionary
		functionaryObj.save(function() {
			request(app).get('/functionaries/' + functionaryObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', functionary.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Functionary instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Functionary
				agent.post('/functionaries')
					.send(functionary)
					.expect(200)
					.end(function(functionarySaveErr, functionarySaveRes) {
						// Handle Functionary save error
						if (functionarySaveErr) done(functionarySaveErr);

						// Delete existing Functionary
						agent.delete('/functionaries/' + functionarySaveRes.body._id)
							.send(functionary)
							.expect(200)
							.end(function(functionaryDeleteErr, functionaryDeleteRes) {
								// Handle Functionary error error
								if (functionaryDeleteErr) done(functionaryDeleteErr);

								// Set assertions
								(functionaryDeleteRes.body._id).should.equal(functionarySaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Functionary instance if not signed in', function(done) {
		// Set Functionary user 
		functionary.user = user;

		// Create new Functionary model instance
		var functionaryObj = new Functionary(functionary);

		// Save the Functionary
		functionaryObj.save(function() {
			// Try deleting Functionary
			request(app).delete('/functionaries/' + functionaryObj._id)
			.expect(401)
			.end(function(functionaryDeleteErr, functionaryDeleteRes) {
				// Set message assertion
				(functionaryDeleteRes.body.message).should.match('User is not logged in');

				// Handle Functionary error error
				done(functionaryDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Functionary.remove().exec();
		done();
	});
});