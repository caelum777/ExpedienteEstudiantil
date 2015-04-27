'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Curso = mongoose.model('Curso'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, curso;

/**
 * Curso routes tests
 */
describe('Curso CRUD tests', function() {
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

		// Save a user to the test db and create new Curso
		user.save(function() {
			curso = {
				name: 'Curso Name'
			};

			done();
		});
	});

	it('should be able to save Curso instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Curso
				agent.post('/cursos')
					.send(curso)
					.expect(200)
					.end(function(cursoSaveErr, cursoSaveRes) {
						// Handle Curso save error
						if (cursoSaveErr) done(cursoSaveErr);

						// Get a list of Cursos
						agent.get('/cursos')
							.end(function(cursosGetErr, cursosGetRes) {
								// Handle Curso save error
								if (cursosGetErr) done(cursosGetErr);

								// Get Cursos list
								var cursos = cursosGetRes.body;

								// Set assertions
								(cursos[0].user._id).should.equal(userId);
								(cursos[0].name).should.match('Curso Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Curso instance if not logged in', function(done) {
		agent.post('/cursos')
			.send(curso)
			.expect(401)
			.end(function(cursoSaveErr, cursoSaveRes) {
				// Call the assertion callback
				done(cursoSaveErr);
			});
	});

	it('should not be able to save Curso instance if no name is provided', function(done) {
		// Invalidate name field
		curso.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Curso
				agent.post('/cursos')
					.send(curso)
					.expect(400)
					.end(function(cursoSaveErr, cursoSaveRes) {
						// Set message assertion
						(cursoSaveRes.body.message).should.match('Please fill Curso name');
						
						// Handle Curso save error
						done(cursoSaveErr);
					});
			});
	});

	it('should be able to update Curso instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Curso
				agent.post('/cursos')
					.send(curso)
					.expect(200)
					.end(function(cursoSaveErr, cursoSaveRes) {
						// Handle Curso save error
						if (cursoSaveErr) done(cursoSaveErr);

						// Update Curso name
						curso.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Curso
						agent.put('/cursos/' + cursoSaveRes.body._id)
							.send(curso)
							.expect(200)
							.end(function(cursoUpdateErr, cursoUpdateRes) {
								// Handle Curso update error
								if (cursoUpdateErr) done(cursoUpdateErr);

								// Set assertions
								(cursoUpdateRes.body._id).should.equal(cursoSaveRes.body._id);
								(cursoUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Cursos if not signed in', function(done) {
		// Create new Curso model instance
		var cursoObj = new Curso(curso);

		// Save the Curso
		cursoObj.save(function() {
			// Request Cursos
			request(app).get('/cursos')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Curso if not signed in', function(done) {
		// Create new Curso model instance
		var cursoObj = new Curso(curso);

		// Save the Curso
		cursoObj.save(function() {
			request(app).get('/cursos/' + cursoObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', curso.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Curso instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Curso
				agent.post('/cursos')
					.send(curso)
					.expect(200)
					.end(function(cursoSaveErr, cursoSaveRes) {
						// Handle Curso save error
						if (cursoSaveErr) done(cursoSaveErr);

						// Delete existing Curso
						agent.delete('/cursos/' + cursoSaveRes.body._id)
							.send(curso)
							.expect(200)
							.end(function(cursoDeleteErr, cursoDeleteRes) {
								// Handle Curso error error
								if (cursoDeleteErr) done(cursoDeleteErr);

								// Set assertions
								(cursoDeleteRes.body._id).should.equal(cursoSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Curso instance if not signed in', function(done) {
		// Set Curso user 
		curso.user = user;

		// Create new Curso model instance
		var cursoObj = new Curso(curso);

		// Save the Curso
		cursoObj.save(function() {
			// Try deleting Curso
			request(app).delete('/cursos/' + cursoObj._id)
			.expect(401)
			.end(function(cursoDeleteErr, cursoDeleteRes) {
				// Set message assertion
				(cursoDeleteRes.body.message).should.match('User is not logged in');

				// Handle Curso error error
				done(cursoDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Curso.remove().exec();
		done();
	});
});