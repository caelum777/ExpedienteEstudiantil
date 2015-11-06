'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Encargado Schema
 */
var EncargadoSchema = new Schema({
    estudiante: {
        type: String,
        required: 'Cédula o número de pasaporte del estudiante',
        trim: true
    },
    name: {
		type: String,
		default: '',
		required: 'Debe ingresar el nombre del encargado',
		trim: true
	},
    primer_apellido: {
        type: String,
        required: 'Debe ingresar el primer apellido del encargado',
        trim: true
    },
    segundo_apellido: {
        type: String,
        required: 'Debe ingresar el segundo apellido del encargado ',
        trim: true
    },
    cedula: {
        type: String,
        unique: true,
        required: 'Debe ingresar la cédula o número de pasaporte del encargado',
        trim: true
    },
    parentesco: {
        type: String,
        required: 'Debe ingresar el parentesco con el estudiante',
        trim: true
    },
    ocupacion: {
        type: String,
        required: 'Debe ingresar la prrofesión u ocupación del encargado',
        trim: true
    },
    estado_civil: {
        type: String,
        required: 'Debe ingresar el estado civil del encargado',
        trim: true
    },
    nacionalidad: {
        type: String,
        required: 'Debe ingresar la nacionalidad del encargado',
        trim: true
    },
    telefono: {
        type: String,
        required: 'Debe ingresar el teléfono del encargado',
        trim: true
    },
    correo: {
        type: String,
        required: 'Debe ingresar el correo electrónico del encargado',
        trim: true
    },
    direccion: {
        type: String,
        required: 'Debe ingresar la direción exacta de la vivienda del encargado',
        trim: true
    }
});

mongoose.model('Encargado', EncargadoSchema);
