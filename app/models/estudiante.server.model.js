'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Estudiante Schema
 */
var EstudianteSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Estudiante name',
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

mongoose.model('Estudiante', EstudianteSchema);