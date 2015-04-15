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
		required: 'Nombre del estudiante',
		trim: true
	},
    primer_apellido: {
      type: String,
      required: 'Primer apellido del estudiante',
      trim: true
    },
    segundo_apellido: {
        type: String,
        required: 'Segundo apellido del estudiante',
        trim: true
    },
    fecha_de_nacimiento: {
        type: String,
        required: 'Fecha de nacimiento del estudiante',
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