'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var encargados = require('../../app/controllers/encargados.server.controller');

	// Encargados Routes
	app.route('/encargados')
		.get(encargados.list)
		.post(users.requiresLogin, encargados.create);

    app.route('/encargados/estudiante/:cedula')
        .get(encargados.read)

	app.route('/encargados/:encargadoId')
		.get(encargados.read)
		.put(users.requiresLogin, encargados.update)
		.delete(users.requiresLogin, encargados.delete);

	// Finish by binding the Encargado middleware
	app.param('encargadoId', encargados.encargadoByID);
    app.param('cedula', encargados.encargadoByCedula);
};
