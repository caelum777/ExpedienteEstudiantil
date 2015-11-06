'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var functionaryResumeLanguages = require('../../app/controllers/functionary-resume-languages.server.controller');

	// Functionary resume languages Routes
	app.route('/functionary-resume-languages')
		.get(functionaryResumeLanguages.list)
		.post(users.requiresLogin, functionaryResumeLanguages.create);

	app.route('/functionary-resume-languages/:functionaryResumeLanguageId')
		.get(functionaryResumeLanguages.read)
		.put(users.requiresLogin, functionaryResumeLanguages.hasAuthorization, functionaryResumeLanguages.update)
		.delete(users.requiresLogin, functionaryResumeLanguages.hasAuthorization, functionaryResumeLanguages.delete);

	// Finish by binding the Functionary resume language middleware
	app.param('functionaryResumeLanguageId', functionaryResumeLanguages.functionaryResumeLanguageByID);
};
