'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Curso = mongoose.model('Curso'),
	_ = require('lodash');

/**
 * Create a Curso
 */
exports.create = function(req, res) {
	var curso = new Curso(req.body);
	curso.user = req.user;

	curso.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(curso);
		}
	});
};

/**
 * Show the current Curso
 */
exports.read = function(req, res) {
	res.jsonp(req.curso);
};

/**
 * Update a Curso
 */
exports.update = function(req, res) {
	var curso = req.curso ;

	curso = _.extend(curso , req.body);

	curso.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(curso);
		}
	});
};

/**
 * Delete an Curso
 */
exports.delete = function(req, res) {
	var curso = req.curso ;

	curso.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(curso);
		}
	});
};

/**
 * List of Cursos
 */
exports.list = function(req, res) { 
	Curso.find().sort('-created').populate('user', 'displayName').exec(function(err, cursos) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(cursos);
		}
	});
};

/**
 * Curso middleware
 */
exports.cursoByID = function(req, res, next, id) { 
	Curso.findById(id).populate('user', 'displayName').exec(function(err, curso) {
		if (err) return next(err);
		if (! curso) return next(new Error('Failed to load Curso ' + id));
		req.curso = curso ;
		next();
	});
};

/**
 * Curso authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.curso.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
