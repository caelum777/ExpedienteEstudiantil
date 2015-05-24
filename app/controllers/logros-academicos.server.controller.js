'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	LogrosAcademico = mongoose.model('LogrosAcademico'),
	_ = require('lodash');

/**
 * Create a Logros academico
 */
exports.create = function(req, res) {
	var logrosAcademico = new LogrosAcademico(req.body);
	logrosAcademico.user = req.user;

	logrosAcademico.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(logrosAcademico);
		}
	});
};

/**
 * Show the current Logros academico
 */
exports.read = function(req, res) {
	res.jsonp(req.logrosAcademico);
};

/**
 * Update a Logros academico
 */
exports.update = function(req, res) {
	var logrosAcademico = req.logrosAcademico ;

	logrosAcademico = _.extend(logrosAcademico , req.body);

	logrosAcademico.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(logrosAcademico);
		}
	});
};

/**
 * Delete an Logros academico
 */
exports.delete = function(req, res) {
	var logrosAcademico = req.logrosAcademico ;

	logrosAcademico.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(logrosAcademico);
		}
	});
};

/**
 * List of Logros academicos
 */
exports.list = function(req, res) { 
	LogrosAcademico.find().sort('-created').populate('user', 'displayName').exec(function(err, logrosAcademicos) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(logrosAcademicos);
		}
	});
};

/**
 * Logros academico middleware
 */
exports.logrosAcademicoByID = function(req, res, next, id) { 
	LogrosAcademico.findById(id).populate('user', 'displayName').exec(function(err, logrosAcademico) {
		if (err) return next(err);
		if (! logrosAcademico) return next(new Error('Failed to load Logros academico ' + id));
		req.logrosAcademico = logrosAcademico ;
		next();
	});
};

/**
 * Logros academico authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.logrosAcademico.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
