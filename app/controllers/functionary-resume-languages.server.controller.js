'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	FunctionaryResumeLanguage = mongoose.model('FunctionaryResumeLanguage'),
	_ = require('lodash');

/**
 * Create a Functionary resume language
 */
exports.create = function(req, res) {
	var functionaryResumeLanguage = new FunctionaryResumeLanguage(req.body);
	functionaryResumeLanguage.user = req.user;

	functionaryResumeLanguage.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(functionaryResumeLanguage);
		}
	});
};

/**
 * Show the current Functionary resume language
 */
exports.read = function(req, res) {
	res.jsonp(req.functionaryResumeLanguage);
};

/**
 * Update a Functionary resume language
 */
exports.update = function(req, res) {
	var functionaryResumeLanguage = req.functionaryResumeLanguage ;

	functionaryResumeLanguage = _.extend(functionaryResumeLanguage , req.body);

	functionaryResumeLanguage.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(functionaryResumeLanguage);
		}
	});
};

/**
 * Delete an Functionary resume language
 */
exports.delete = function(req, res) {
	var functionaryResumeLanguage = req.functionaryResumeLanguage ;

	functionaryResumeLanguage.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(functionaryResumeLanguage);
		}
	});
};

/**
 * List of Functionary resume languages
 */
exports.list = function(req, res) { 
	FunctionaryResumeLanguage.find().sort('-created').populate('user', 'displayName').exec(function(err, functionaryResumeLanguages) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(functionaryResumeLanguages);
		}
	});
};

/**
 * Functionary resume language middleware
 */
exports.functionaryResumeLanguageByID = function(req, res, next, id) { 
	FunctionaryResumeLanguage.findById(id).populate('user', 'displayName').exec(function(err, functionaryResumeLanguage) {
		if (err) return next(err);
		if (! functionaryResumeLanguage) return next(new Error('Failed to load Functionary resume language ' + id));
		req.functionaryResumeLanguage = functionaryResumeLanguage ;
		next();
	});
};

/**
 * Functionary resume language authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.functionaryResumeLanguage.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
