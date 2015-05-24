'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Logros academico Schema
 */
var LogrosAcademicoSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Logros academico name',
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

mongoose.model('LogrosAcademico', LogrosAcademicoSchema);