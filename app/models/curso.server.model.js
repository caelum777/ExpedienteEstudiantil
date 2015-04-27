'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Curso Schema
 */
var CursoSchema = new Schema({
    name: {
        type: String,
        default: '',
        required: 'Nombre del estudiante',
        trim: true
    },
    cedulaEstudiante: {
        type: String,
        default: '',
        required: 'Introduzca la cédula del estudiante',
        trim: true
    },
    nota: {
        type: String,
        default: '',
        required: 'Introduzca la nota del curso',
        trim: true
    },
    year: {
        type: String,
        default: '',
        required: 'Introduzca el año en el que el estudiante recibió el curso',
        trim: true
    },
    semestre: {
        type: String,
        default: '',
        required: 'Introduzca el semestre en el que el estudiante recibió el curso',
        trim: true
    }
});

mongoose.model('Curso', CursoSchema);