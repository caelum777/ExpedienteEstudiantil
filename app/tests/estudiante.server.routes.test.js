'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Estudiante = mongoose.model('Estudiante'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, estudiante;

/**
 * Estudiante routes tests
 */
describe('Estudiante CRUD tests', function() {
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

		// Save a user to the test db and create new Estudiante
		user.save(function() {
			estudiante = {
				name: 'Estudiante Name'
			};

			done();
		});
	});

	it('should be able to save Estudiante instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Estudiante
				agent.post('/estudiantes')
					.send(estudiante)
					.expect(200)
					.end(function(estudianteSaveErr, estudianteSaveRes) {
						// Handle Estudiante save error
						if (estudianteSaveErr) done(estudianteSaveErr);

						// Get a list of Estudiantes
						agent.get('/estudiantes')
							.end(function(estudiantesGetErr, estudiantesGetRes) {
								// Handle Estudiante save error
								if (estudiantesGetErr) done(estudiantesGetErr);

								// Get Estudiantes list
								var estudiantes = estudiantesGetRes.body;

								// Set assertions
								(estudiantes[0].user._id).should.equal(userId);
								(estudiantes[0].name).should.match('Estudiante Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Estudiante instance if not logged in', function(done) {
		agent.post('/estudiantes')
			.send(estudiante)
			.expect(401)
			.end(function(estudianteSaveErr, estudianteSaveRes) {
				// Call the assertion callback
				done(estudianteSaveErr);
			});
	});

	it('should not be able to save Estudiante instance if no name is provided', function(done) {
		// Invalidate name field
		estudiante.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Estudiante
				agent.post('/estudiantes')
					.send(estudiante)
					.expect(400)
					.end(function(estudianteSaveErr, estudianteSaveRes) {
						// Set message assertion
						(estudianteSaveRes.body.message).should.match('Please fill Estudiante name');
						
						// Handle Estudiante save error
						done(estudianteSaveErr);
					});
			});
	});

	it('should be able to update Estudiante instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Estudiante
				agent.post('/estudiantes')
					.send(estudiante)
					.expect(200)
					.end(function(estudianteSaveErr, estudianteSaveRes) {
						// Handle Estudiante save error
						if (estudianteSaveErr) done(estudianteSaveErr);

						// Update Estudiante name
						estudiante.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Estudiante
						agent.put('/estudiantes/' + estudianteSaveRes.body._id)
							.send(estudiante)
							.expect(200)
							.end(function(estudianteUpdateErr, estudianteUpdateRes) {
								// Handle Estudiante update error
								if (estudianteUpdateErr) done(estudianteUpdateErr);

								// Set assertions
								(estudianteUpdateRes.body._id).should.equal(estudianteSaveRes.body._id);
								(estudianteUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Estudiantes if not signed in', function(done) {
		// Create new Estudiante model instance
		var estudianteObj = new Estudiante(estudiante);

		// Save the Estudiante
		estudianteObj.save(function() {
			// Request Estudiantes
			request(app).get('/estudiantes')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Estudiante if not signed in', function(done) {
		// Create new Estudiante model instance
		var estudianteObj = new Estudiante(estudiante);

		// Save the Estudiante
		estudianteObj.save(function() {
			request(app).get('/estudiantes/' + estudianteObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', estudiante.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Estudiante instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Estudiante
				agent.post('/estudiantes')
					.send(estudiante)
					.expect(200)
					.end(function(estudianteSaveErr, estudianteSaveRes) {
						// Handle Estudiante save error
						if (estudianteSaveErr) done(estudianteSaveErr);

						// Delete existing Estudiante
						agent.delete('/estudiantes/' + estudianteSaveRes.body._id)
							.send(estudiante)
							.expect(200)
							.end(function(estudianteDeleteErr, estudianteDeleteRes) {
								// Handle Estudiante error error
								if (estudianteDeleteErr) done(estudianteDeleteErr);

								// Set assertions
								(estudianteDeleteRes.body._id).should.equal(estudianteSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Estudiante instance if not signed in', function(done) {
		// Set Estudiante user 
		estudiante.user = user;

		// Create new Estudiante model instance
		var estudianteObj = new Estudiante(estudiante);

		// Save the Estudiante
		estudianteObj.save(function() {
			// Try deleting Estudiante
			request(app).delete('/estudiantes/' + estudianteObj._id)
			.expect(401)
			.end(function(estudianteDeleteErr, estudianteDeleteRes) {
				// Set message assertion
				(estudianteDeleteRes.body.message).should.match('User is not logged in');

				// Handle Estudiante error error
				done(estudianteDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Estudiante.remove().exec();
		done();
	});
});