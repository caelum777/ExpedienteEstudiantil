'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Functionary resume education Schema
 */
var FunctionaryResumeEducationSchema = new Schema({

	school: {
		type: String,
		default: '',
		required: 'Porfavor llene la universidad',
		trim: true
	},

	description: {
		type: String,
		default: '',
		trim: true
	},

	degree: {
		type: String,
		default: '',
		trim: true
	},

	attendedStartDate: {
		type: Date,
		default: '',
		required: 'Porfavor llene la fecha en que comenzó en la universidad',
		trim: true
	},

	attendedEndDate: {
		type: Date,
		default: '',
		required: 'Porfavor llene la fecha en que terminó/terminará  la universidad',
		trim: true
	},

	created: {
		type: Date,
		default: Date.now
	},

	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}

});

mongoose.model('FunctionaryResumeEducation', FunctionaryResumeEducationSchema);
