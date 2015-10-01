'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Functionary resume experience Schema
 */
var FunctionaryResumeExperienceSchema = new Schema({
	companyName: {
		type: String,
		default: '',
		required: 'Porfavor llene el nombre de la compa�ia',
		trim: true
	},

	companyLocation: {
		type: String,
		default: '',
		trim: true
	},

	functionaryTitle: {
		type: String,
		default: '',
		trim: true
	},

	startDate: {
		type: Date,
		default: '',
		required: 'Porfavor llene la fecha en que inicia a trabajar  en la compa�ia'
	},

	endDate: {
		type: Date,
		default: '',
		required: 'Porfavor llene la fecha en que termina de trabajar en la compa�ia'
	},

	description: {
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
	}

});

mongoose.model('FunctionaryResumeExperience', FunctionaryResumeExperienceSchema);
