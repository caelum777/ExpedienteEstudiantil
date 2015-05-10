'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Encargado = mongoose.model('Encargado'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, encargado;

/**
 * Encargado routes tests
 */
describe('Encargado CRUD tests', function() {
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

		// Save a user to the test db and create new Encargado
		user.save(function() {
			encargado = {
				name: 'Encargado Name'
			};

			done();
		});
	});

	it('should be able to save Encargado instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Encargado
				agent.post('/encargados')
					.send(encargado)
					.expect(200)
					.end(function(encargadoSaveErr, encargadoSaveRes) {
						// Handle Encargado save error
						if (encargadoSaveErr) done(encargadoSaveErr);

						// Get a list of Encargados
						agent.get('/encargados')
							.end(function(encargadosGetErr, encargadosGetRes) {
								// Handle Encargado save error
								if (encargadosGetErr) done(encargadosGetErr);

								// Get Encargados list
								var encargados = encargadosGetRes.body;

								// Set assertions
								(encargados[0].user._id).should.equal(userId);
								(encargados[0].name).should.match('Encargado Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Encargado instance if not logged in', function(done) {
		agent.post('/encargados')
			.send(encargado)
			.expect(401)
			.end(function(encargadoSaveErr, encargadoSaveRes) {
				// Call the assertion callback
				done(encargadoSaveErr);
			});
	});

	it('should not be able to save Encargado instance if no name is provided', function(done) {
		// Invalidate name field
		encargado.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Encargado
				agent.post('/encargados')
					.send(encargado)
					.expect(400)
					.end(function(encargadoSaveErr, encargadoSaveRes) {
						// Set message assertion
						(encargadoSaveRes.body.message).should.match('Please fill Encargado name');
						
						// Handle Encargado save error
						done(encargadoSaveErr);
					});
			});
	});

	it('should be able to update Encargado instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Encargado
				agent.post('/encargados')
					.send(encargado)
					.expect(200)
					.end(function(encargadoSaveErr, encargadoSaveRes) {
						// Handle Encargado save error
						if (encargadoSaveErr) done(encargadoSaveErr);

						// Update Encargado name
						encargado.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Encargado
						agent.put('/encargados/' + encargadoSaveRes.body._id)
							.send(encargado)
							.expect(200)
							.end(function(encargadoUpdateErr, encargadoUpdateRes) {
								// Handle Encargado update error
								if (encargadoUpdateErr) done(encargadoUpdateErr);

								// Set assertions
								(encargadoUpdateRes.body._id).should.equal(encargadoSaveRes.body._id);
								(encargadoUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Encargados if not signed in', function(done) {
		// Create new Encargado model instance
		var encargadoObj = new Encargado(encargado);

		// Save the Encargado
		encargadoObj.save(function() {
			// Request Encargados
			request(app).get('/encargados')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Encargado if not signed in', function(done) {
		// Create new Encargado model instance
		var encargadoObj = new Encargado(encargado);

		// Save the Encargado
		encargadoObj.save(function() {
			request(app).get('/encargados/' + encargadoObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', encargado.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Encargado instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Encargado
				agent.post('/encargados')
					.send(encargado)
					.expect(200)
					.end(function(encargadoSaveErr, encargadoSaveRes) {
						// Handle Encargado save error
						if (encargadoSaveErr) done(encargadoSaveErr);

						// Delete existing Encargado
						agent.delete('/encargados/' + encargadoSaveRes.body._id)
							.send(encargado)
							.expect(200)
							.end(function(encargadoDeleteErr, encargadoDeleteRes) {
								// Handle Encargado error error
								if (encargadoDeleteErr) done(encargadoDeleteErr);

								// Set assertions
								(encargadoDeleteRes.body._id).should.equal(encargadoSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Encargado instance if not signed in', function(done) {
		// Set Encargado user 
		encargado.user = user;

		// Create new Encargado model instance
		var encargadoObj = new Encargado(encargado);

		// Save the Encargado
		encargadoObj.save(function() {
			// Try deleting Encargado
			request(app).delete('/encargados/' + encargadoObj._id)
			.expect(401)
			.end(function(encargadoDeleteErr, encargadoDeleteRes) {
				// Set message assertion
				(encargadoDeleteRes.body.message).should.match('User is not logged in');

				// Handle Encargado error error
				done(encargadoDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Encargado.remove().exec();
		done();
	});
});