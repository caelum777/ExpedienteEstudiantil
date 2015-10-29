'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Functionary = mongoose.model('Functionary'),
	_ = require('lodash');

/**
 * Create a Functionary
 */
exports.create = function(req, res) {
	var functionary = new Functionary(req.body);
	functionary.user = req.user;

	functionary.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(functionary);
		}
	});
};

/**
 * Show the current Functionary
 */
exports.read = function(req, res) {
	res.jsonp(req.functionary);
};

/**
 * Update a Functionary
 */
exports.update = function(req, res) {
	var functionary = req.functionary ;

	functionary = _.extend(functionary , req.body);

	functionary.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(functionary);
		}
	});
};

/**
 * Delete an Functionary
 */
exports.delete = function(req, res) {
	var functionary = req.functionary ;

	functionary.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(functionary);
		}
	});
};

/**
 * List of Functionaries
 */
exports.list = function(req, res) { 
	Functionary.find().sort('-created').populate('user', 'displayName').exec(function(err, functionaries) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(functionaries);
		}
	});
};

/**
 * Functionary middleware
 */
exports.functionaryByID = function(req, res, next, id) { 
	Functionary.findById(id).populate('user', 'displayName').exec(function(err, functionary) {
		if (err) return next(err);
		if (! functionary) return next(new Error('Failed to load Functionary ' + id));
		req.functionary = functionary ;
		next();
	});
};

/**
 * Functionary authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.functionary.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
