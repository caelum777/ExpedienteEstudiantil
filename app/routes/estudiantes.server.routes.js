'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var estudiantes = require('../../app/controllers/estudiantes.server.controller');

	// Estudiantes Routes
	app.route('/estudiantes')
		.get(estudiantes.list)
		.post(users.requiresLogin, estudiantes.create);

	app.route('/estudiantes/:estudianteId')
		.get(estudiantes.read)
		.put(users.requiresLogin, estudiantes.update)
		.delete(users.requiresLogin, estudiantes.delete);

    app.route('/admitidos/:admitido')
        .get(estudiantes.read);

	// Finish by binding the Estudiante middleware
	app.param('estudianteId', estudiantes.estudianteByID);

    app.param('admitido', estudiantes.admitidoss);
};
