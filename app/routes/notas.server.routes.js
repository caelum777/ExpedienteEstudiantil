'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var notas = require('../../app/controllers/notas.server.controller');

	// Notas Routes
	app.route('/notas')
		.get(notas.list)
		.post(users.requiresLogin, notas.create);

	/*app.route('/notas/:notaId')
		.get(notas.read)
		.put(users.requiresLogin, notas.update)
		.delete(users.requiresLogin, notas.delete);*/

    app.route('/notas/:cedula_estudiante')
        .get(notas.read);

    app.route('/notas/:notaId')
        .put(users.requiresLogin, notas.update)
        .delete(users.requiresLogin, notas.delete);

	// Finish by binding the Nota middleware
    app.param('cedula_estudiante', notas.notaByCedula);
    app.param('notaId', notas.notaByID);
};
