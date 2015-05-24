'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	LogrosAcademico = mongoose.model('LogrosAcademico'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, logrosAcademico;

/**
 * Logros academico routes tests
 */
describe('Logros academico CRUD tests', function() {
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

		// Save a user to the test db and create new Logros academico
		user.save(function() {
			logrosAcademico = {
				name: 'Logros academico Name'
			};

			done();
		});
	});

	it('should be able to save Logros academico instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Logros academico
				agent.post('/logros-academicos')
					.send(logrosAcademico)
					.expect(200)
					.end(function(logrosAcademicoSaveErr, logrosAcademicoSaveRes) {
						// Handle Logros academico save error
						if (logrosAcademicoSaveErr) done(logrosAcademicoSaveErr);

						// Get a list of Logros academicos
						agent.get('/logros-academicos')
							.end(function(logrosAcademicosGetErr, logrosAcademicosGetRes) {
								// Handle Logros academico save error
								if (logrosAcademicosGetErr) done(logrosAcademicosGetErr);

								// Get Logros academicos list
								var logrosAcademicos = logrosAcademicosGetRes.body;

								// Set assertions
								(logrosAcademicos[0].user._id).should.equal(userId);
								(logrosAcademicos[0].name).should.match('Logros academico Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Logros academico instance if not logged in', function(done) {
		agent.post('/logros-academicos')
			.send(logrosAcademico)
			.expect(401)
			.end(function(logrosAcademicoSaveErr, logrosAcademicoSaveRes) {
				// Call the assertion callback
				done(logrosAcademicoSaveErr);
			});
	});

	it('should not be able to save Logros academico instance if no name is provided', function(done) {
		// Invalidate name field
		logrosAcademico.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Logros academico
				agent.post('/logros-academicos')
					.send(logrosAcademico)
					.expect(400)
					.end(function(logrosAcademicoSaveErr, logrosAcademicoSaveRes) {
						// Set message assertion
						(logrosAcademicoSaveRes.body.message).should.match('Please fill Logros academico name');
						
						// Handle Logros academico save error
						done(logrosAcademicoSaveErr);
					});
			});
	});

	it('should be able to update Logros academico instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Logros academico
				agent.post('/logros-academicos')
					.send(logrosAcademico)
					.expect(200)
					.end(function(logrosAcademicoSaveErr, logrosAcademicoSaveRes) {
						// Handle Logros academico save error
						if (logrosAcademicoSaveErr) done(logrosAcademicoSaveErr);

						// Update Logros academico name
						logrosAcademico.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Logros academico
						agent.put('/logros-academicos/' + logrosAcademicoSaveRes.body._id)
							.send(logrosAcademico)
							.expect(200)
							.end(function(logrosAcademicoUpdateErr, logrosAcademicoUpdateRes) {
								// Handle Logros academico update error
								if (logrosAcademicoUpdateErr) done(logrosAcademicoUpdateErr);

								// Set assertions
								(logrosAcademicoUpdateRes.body._id).should.equal(logrosAcademicoSaveRes.body._id);
								(logrosAcademicoUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Logros academicos if not signed in', function(done) {
		// Create new Logros academico model instance
		var logrosAcademicoObj = new LogrosAcademico(logrosAcademico);

		// Save the Logros academico
		logrosAcademicoObj.save(function() {
			// Request Logros academicos
			request(app).get('/logros-academicos')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Logros academico if not signed in', function(done) {
		// Create new Logros academico model instance
		var logrosAcademicoObj = new LogrosAcademico(logrosAcademico);

		// Save the Logros academico
		logrosAcademicoObj.save(function() {
			request(app).get('/logros-academicos/' + logrosAcademicoObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', logrosAcademico.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Logros academico instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Logros academico
				agent.post('/logros-academicos')
					.send(logrosAcademico)
					.expect(200)
					.end(function(logrosAcademicoSaveErr, logrosAcademicoSaveRes) {
						// Handle Logros academico save error
						if (logrosAcademicoSaveErr) done(logrosAcademicoSaveErr);

						// Delete existing Logros academico
						agent.delete('/logros-academicos/' + logrosAcademicoSaveRes.body._id)
							.send(logrosAcademico)
							.expect(200)
							.end(function(logrosAcademicoDeleteErr, logrosAcademicoDeleteRes) {
								// Handle Logros academico error error
								if (logrosAcademicoDeleteErr) done(logrosAcademicoDeleteErr);

								// Set assertions
								(logrosAcademicoDeleteRes.body._id).should.equal(logrosAcademicoSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Logros academico instance if not signed in', function(done) {
		// Set Logros academico user 
		logrosAcademico.user = user;

		// Create new Logros academico model instance
		var logrosAcademicoObj = new LogrosAcademico(logrosAcademico);

		// Save the Logros academico
		logrosAcademicoObj.save(function() {
			// Try deleting Logros academico
			request(app).delete('/logros-academicos/' + logrosAcademicoObj._id)
			.expect(401)
			.end(function(logrosAcademicoDeleteErr, logrosAcademicoDeleteRes) {
				// Set message assertion
				(logrosAcademicoDeleteRes.body.message).should.match('User is not logged in');

				// Handle Logros academico error error
				done(logrosAcademicoDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		LogrosAcademico.remove().exec();
		done();
	});
});