'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	FunctionaryResumeExperience = mongoose.model('FunctionaryResumeExperience'),
	_ = require('lodash');

/**
 * Create a Functionary resume experience
 */
exports.create = function(req, res) {
	var functionaryResumeExperience = new FunctionaryResumeExperience(req.body);
	functionaryResumeExperience.user = req.user;

	functionaryResumeExperience.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(functionaryResumeExperience);
		}
	});
};

/**
 * Show the current Functionary resume experience
 */
exports.read = function(req, res) {
	res.jsonp(req.functionaryResumeExperience);
};

/**
 * Update a Functionary resume experience
 */
exports.update = function(req, res) {
	var functionaryResumeExperience = req.functionaryResumeExperience ;

	functionaryResumeExperience = _.extend(functionaryResumeExperience , req.body);

	functionaryResumeExperience.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(functionaryResumeExperience);
		}
	});
};

/**
 * Delete an Functionary resume experience
 */
exports.delete = function(req, res) {
	var functionaryResumeExperience = req.functionaryResumeExperience ;

	functionaryResumeExperience.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(functionaryResumeExperience);
		}
	});
};

/**
 * List of Functionary resume experiences
 */
exports.list = function(req, res) { 
	FunctionaryResumeExperience.find().sort('-created').populate('user', 'displayName').exec(function(err, functionaryResumeExperiences) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(functionaryResumeExperiences);
		}
	});
};

/**
 * Functionary resume experience middleware
 */
exports.functionaryResumeExperienceByID = function(req, res, next, id) { 
	FunctionaryResumeExperience.findById(id).populate('user', 'displayName').exec(function(err, functionaryResumeExperience) {
		if (err) return next(err);
		if (! functionaryResumeExperience) return next(new Error('Failed to load Functionary resume experience ' + id));
		req.functionaryResumeExperience = functionaryResumeExperience ;
		next();
	});
};

/**
 * Functionary resume experience authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.functionaryResumeExperience.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
