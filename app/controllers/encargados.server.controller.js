'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Encargado = mongoose.model('Encargado'),
	_ = require('lodash');

/**
 * Create a Encargado
 */
exports.create = function(req, res) {
	var encargado = new Encargado(req.body);
	encargado.user = req.user;

	encargado.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(encargado);
		}
	});
};

/**
 * Show the current Encargado
 */
exports.read = function(req, res) {
	res.jsonp(req.encargado);
};

/**
 * Update a Encargado
 */
exports.update = function(req, res) {
	var encargado = req.encargado ;

	encargado = _.extend(encargado , req.body);

	encargado.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(encargado);
		}
	});
};

/**
 * Delete an Encargado
 */
exports.delete = function(req, res) {
	var encargado = req.encargado ;

	encargado.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(encargado);
		}
	});
};

/**
 * List of Encargados
 */
exports.list = function(req, res) { 
	Encargado.find().sort('-created').populate('user', 'displayName').exec(function(err, encargados) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(encargados);
		}
	});
};

/**
 * Encargado middleware
 */
exports.encargadoByID = function(req, res, next, id) { 
	Encargado.findById(id).populate('user', 'displayName').exec(function(err, encargado) {
		if (err) return next(err);
		if (! encargado) return next(new Error('Failed to load Encargado ' + id));
		req.encargado = encargado ;
		next();
	});
};

/**
 * Encargado authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.encargado.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
