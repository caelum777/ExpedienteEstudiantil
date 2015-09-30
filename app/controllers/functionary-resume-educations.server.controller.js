'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	FunctionaryResumeEducation = mongoose.model('FunctionaryResumeEducation'),
	_ = require('lodash');

/**
 * Create a Functionary resume education
 */
exports.create = function(req, res) {
	var functionaryResumeEducation = new FunctionaryResumeEducation(req.body);
	functionaryResumeEducation.user = req.user;

	functionaryResumeEducation.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(functionaryResumeEducation);
		}
	});
};

/**
 * Show the current Functionary resume education
 */
exports.read = function(req, res) {
	res.jsonp(req.functionaryResumeEducation);
};

/**
 * Update a Functionary resume education
 */
exports.update = function(req, res) {
	var functionaryResumeEducation = req.functionaryResumeEducation ;

	functionaryResumeEducation = _.extend(functionaryResumeEducation , req.body);

	functionaryResumeEducation.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(functionaryResumeEducation);
		}
	});
};

/**
 * Delete an Functionary resume education
 */
exports.delete = function(req, res) {
	var functionaryResumeEducation = req.functionaryResumeEducation ;

	functionaryResumeEducation.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(functionaryResumeEducation);
		}
	});
};

/**
 * List of Functionary resume educations
 */
exports.list = function(req, res) { 
	FunctionaryResumeEducation.find().sort('-created').populate('user', 'displayName').exec(function(err, functionaryResumeEducations) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(functionaryResumeEducations);
		}
	});
};

/**
 * Functionary resume education middleware
 */
exports.functionaryResumeEducationByID = function(req, res, next, id) { 
	FunctionaryResumeEducation.findById(id).populate('user', 'displayName').exec(function(err, functionaryResumeEducation) {
		if (err) return next(err);
		if (! functionaryResumeEducation) return next(new Error('Failed to load Functionary resume education ' + id));
		req.functionaryResumeEducation = functionaryResumeEducation ;
		next();
	});
};

/**
 * Functionary resume education authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.functionaryResumeEducation.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
