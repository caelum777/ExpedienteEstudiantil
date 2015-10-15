'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var functionaryResumeEducations = require('../../app/controllers/functionary-resume-educations.server.controller');

	// Functionary resume educations Routes
	app.route('/functionary-resume-educations')
		.get(functionaryResumeEducations.list)
		.post(users.requiresLogin, functionaryResumeEducations.create);

	app.route('/functionary-resume-educations/:functionaryResumeEducationId')
		.get(functionaryResumeEducations.read)
		.put(users.requiresLogin, functionaryResumeEducations.hasAuthorization, functionaryResumeEducations.update)
		.delete(users.requiresLogin, functionaryResumeEducations.hasAuthorization, functionaryResumeEducations.delete);

	// Finish by binding the Functionary resume education middleware
	app.param('functionaryResumeEducationId', functionaryResumeEducations.functionaryResumeEducationByID);
};
