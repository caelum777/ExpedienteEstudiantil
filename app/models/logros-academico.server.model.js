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
		required: 'Debe escribir el nombre del logro academico',
		trim: true
	},
    estudiante: {
        type: String,
        required: 'Debe escribir la cédula del estudiante que recibió el premio',
        trim: true
    },
    descripcion: {
        type: String,
        default: '',
        required: 'Debe escribir la descripción del logro académico',
        trim: true
    },
    premio: {
        type: String,
        default: '',
        required: 'Debe escribir el premio que recibe el estudiante',
        trim: true
    },
    anno: {
        type: Number,
        trim: true
    }

});

mongoose.model('LogrosAcademico', LogrosAcademicoSchema);
