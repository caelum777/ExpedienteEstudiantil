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
		required: 'Nombre del padre, madre o encargado',
		trim: true
	},
    primer_apellido: {
        type: String,
        required: 'Primer apellido del encargado',
        trim: true
    },
    segundo_apellido: {
        type: String,
        required: 'Segundo apellido del encargado',
        trim: true
    },
    cedula: {
        type: String,
        required: 'Cédula o número de pasaporte del encargado',
        trim: true
    },
    ocupacion: {
        type: String,
        required: 'Profesión u ocupación del encargado',
        trim: true
    },
    estado_civil: {
        type: String,
        required: 'Casado, soltero, divorciado..',
        trim: true
    },
    nacionalidad: {
        type: String,
        required: 'Costarricense, Nicaragüense',
        trim: true
    },
    telefono: {
        type: String,
        required: '8854-8724',
        trim: true
    },
    correo: {
        type: String,
        required: 'usuario@hotmail.com',
        trim: true
    },
    direccion: {
        type: String,
        required: 'direción exacta de la vivienda',
        trim: true
    },
    responsable: {
        type: Boolean,
        required: 'Es quien autoriza al estudiante de ingresar el Colegio Científico',
        trim: true
    }
});

mongoose.model('Encargado', EncargadoSchema);