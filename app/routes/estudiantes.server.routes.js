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

    app.route('/nacionalidad/:cedula')
        .get(estudiantes.read),

    app.route('/admitidos/:admitido')
        .get(estudiantes.read),

    app.route('/estudiantes_decimo/')
        .get(estudiantes.decimo),

    app.route('/estudiantes_undecimo/')
        .get(estudiantes.undecimo),

	// Finish by binding the Estudiante middleware
	app.param('estudianteId', estudiantes.estudianteByID),
    app.param('cedula', estudiantes.estudianteByCedula),
    app.param('admitido', estudiantes.admitidoss);



};
