'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Functionary resume language Schema
 */
var FunctionaryResumeLanguageSchema = new Schema({

	language: {
		type: String,
		default: '',
		required: 'Porfavor llene el lenguaje',
		trim: true
	},

	proficiency: {
		type: String,
		default: '',
		trim: true
	},

	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	functionaryResume: { type:Schema.ObjectId, ref:"Parent", childPath:"children" }

});

mongoose.model('FunctionaryResumeLanguage', FunctionaryResumeLanguageSchema);
