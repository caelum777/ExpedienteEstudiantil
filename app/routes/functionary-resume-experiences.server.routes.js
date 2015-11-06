'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var functionaryResumeExperiences = require('../../app/controllers/functionary-resume-experiences.server.controller');

	// Functionary resume experiences Routes
	app.route('/functionary-resume-experiences')
		.get(functionaryResumeExperiences.list)
		.post(users.requiresLogin, functionaryResumeExperiences.create);

	app.route('/functionary-resume-experiences/:functionaryResumeExperienceId')
		.get(functionaryResumeExperiences.read)
		.put(users.requiresLogin, functionaryResumeExperiences.hasAuthorization, functionaryResumeExperiences.update)
		.delete(users.requiresLogin, functionaryResumeExperiences.hasAuthorization, functionaryResumeExperiences.delete);

	// Finish by binding the Functionary resume experience middleware
	app.param('functionaryResumeExperienceId', functionaryResumeExperiences.functionaryResumeExperienceByID);
};
