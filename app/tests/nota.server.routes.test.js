'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Nota = mongoose.model('Nota'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, nota;

/**
 * Nota routes tests
 */
describe('Nota CRUD tests', function() {
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

		// Save a user to the test db and create new Nota
		user.save(function() {
			nota = {
				name: 'Nota Name'
			};

			done();
		});
	});

	it('should be able to save Nota instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Nota
				agent.post('/notas')
					.send(nota)
					.expect(200)
					.end(function(notaSaveErr, notaSaveRes) {
						// Handle Nota save error
						if (notaSaveErr) done(notaSaveErr);

						// Get a list of Notas
						agent.get('/notas')
							.end(function(notasGetErr, notasGetRes) {
								// Handle Nota save error
								if (notasGetErr) done(notasGetErr);

								// Get Notas list
								var notas = notasGetRes.body;

								// Set assertions
								(notas[0].user._id).should.equal(userId);
								(notas[0].name).should.match('Nota Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Nota instance if not logged in', function(done) {
		agent.post('/notas')
			.send(nota)
			.expect(401)
			.end(function(notaSaveErr, notaSaveRes) {
				// Call the assertion callback
				done(notaSaveErr);
			});
	});

	it('should not be able to save Nota instance if no name is provided', function(done) {
		// Invalidate name field
		nota.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Nota
				agent.post('/notas')
					.send(nota)
					.expect(400)
					.end(function(notaSaveErr, notaSaveRes) {
						// Set message assertion
						(notaSaveRes.body.message).should.match('Please fill Nota name');
						
						// Handle Nota save error
						done(notaSaveErr);
					});
			});
	});

	it('should be able to update Nota instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Nota
				agent.post('/notas')
					.send(nota)
					.expect(200)
					.end(function(notaSaveErr, notaSaveRes) {
						// Handle Nota save error
						if (notaSaveErr) done(notaSaveErr);

						// Update Nota name
						nota.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Nota
						agent.put('/notas/' + notaSaveRes.body._id)
							.send(nota)
							.expect(200)
							.end(function(notaUpdateErr, notaUpdateRes) {
								// Handle Nota update error
								if (notaUpdateErr) done(notaUpdateErr);

								// Set assertions
								(notaUpdateRes.body._id).should.equal(notaSaveRes.body._id);
								(notaUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Notas if not signed in', function(done) {
		// Create new Nota model instance
		var notaObj = new Nota(nota);

		// Save the Nota
		notaObj.save(function() {
			// Request Notas
			request(app).get('/notas')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Nota if not signed in', function(done) {
		// Create new Nota model instance
		var notaObj = new Nota(nota);

		// Save the Nota
		notaObj.save(function() {
			request(app).get('/notas/' + notaObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', nota.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Nota instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Nota
				agent.post('/notas')
					.send(nota)
					.expect(200)
					.end(function(notaSaveErr, notaSaveRes) {
						// Handle Nota save error
						if (notaSaveErr) done(notaSaveErr);

						// Delete existing Nota
						agent.delete('/notas/' + notaSaveRes.body._id)
							.send(nota)
							.expect(200)
							.end(function(notaDeleteErr, notaDeleteRes) {
								// Handle Nota error error
								if (notaDeleteErr) done(notaDeleteErr);

								// Set assertions
								(notaDeleteRes.body._id).should.equal(notaSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Nota instance if not signed in', function(done) {
		// Set Nota user 
		nota.user = user;

		// Create new Nota model instance
		var notaObj = new Nota(nota);

		// Save the Nota
		notaObj.save(function() {
			// Try deleting Nota
			request(app).delete('/notas/' + notaObj._id)
			.expect(401)
			.end(function(notaDeleteErr, notaDeleteRes) {
				// Set message assertion
				(notaDeleteRes.body.message).should.match('User is not logged in');

				// Handle Nota error error
				done(notaDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Nota.remove().exec();
		done();
	});
});