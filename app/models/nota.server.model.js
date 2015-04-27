'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Nota Schema
 */
var NotaSchema = new Schema({
	cedula_estudiante: {
		type: String,
		trim: true
	},
    grado: {
        type: String,
        trim: true
    },
    curso: {
        type: String,
        trim: true
    },
    nota: {
        type: Number,
        trim: true
    },
    anno: {
        type: Number,
        trim: true
    },
    semestre: {
        type: Number,
        trim: true
    }
});

mongoose.model('Nota', NotaSchema);