'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var logrosAcademicos = require('../../app/controllers/logros-academicos.server.controller');

	// Logros academicos Routes
	app.route('/logros-academicos')
		.get(logrosAcademicos.list)
		.post(users.requiresLogin, logrosAcademicos.create);

    app.route('/logros-academicos/estudiante/:cedula')
        .get(logrosAcademicos.read);

	app.route('/logros-academicos/:logrosAcademicoId')
		.get(logrosAcademicos.read)
		.put(users.requiresLogin, logrosAcademicos.update)
		.delete(users.requiresLogin, logrosAcademicos.delete);

	// Finish by binding the Logros academico middleware
	app.param('logrosAcademicoId', logrosAcademicos.logrosAcademicoByID);
    app.param('cedula', logrosAcademicos.logroByCedula);
};
