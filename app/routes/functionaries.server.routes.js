'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var functionaries = require('../../app/controllers/functionaries.server.controller');

	// Functionaries Routes
	app.route('/functionaries')
		.get(functionaries.list)
		.post(users.requiresLogin, functionaries.create);

	app.route('/functionaries/:functionaryId')
		.get(functionaries.read)
		.put(users.requiresLogin, functionaries.hasAuthorization, functionaries.update)
		.delete(users.requiresLogin, functionaries.hasAuthorization, functionaries.delete);

	// Finish by binding the Functionary middleware
	app.param('functionaryId', functionaries.functionaryByID);
};
