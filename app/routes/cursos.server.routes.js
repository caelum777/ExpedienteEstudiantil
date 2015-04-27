'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var cursos = require('../../app/controllers/cursos.server.controller');

	// Cursos Routes
	app.route('/cursos')
		.get(cursos.list)
		.post(users.requiresLogin, cursos.create);

	app.route('/cursos/:cursoId')
		.get(cursos.read)
		.put(users.requiresLogin, cursos.update)
		.delete(users.requiresLogin,  cursos.delete);

	// Finish by binding the Curso middleware
	app.param('cursoId', cursos.cursoByID);
};
