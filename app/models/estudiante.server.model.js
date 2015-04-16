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
    nacionalidad: {
        type: String,
        required: 'Cédula o número de pasaporte del estudiante',
        trim: true
    },
    sexo: {
        type: Boolean,
        required: 'Sexo del estudiante',
        trim: true
    },
    fecha_de_nacimiento: {
        type: String,
        required: 'Fecha de nacimiento del estudiante',
        trim: true
    },
    telefono_casa: {
        type: String,
        required: 'Teléfono de la casa del estudiante',
        trim: true
    },
    celular: {
        type: String,
        required: 'Celular del estudiante',
        trim: true
    },
    correo: {
        type: String,
        required: 'Correo del estudiante',
        trim: true
    },
    provincia: {
        type: String,
        required: 'Provincia de provinencia',
        trim: true
    },
    canton: {
        type: String,
        required: 'Canton de provinencia',
        trim: true
    },
    distrito: {
        type: String,
        required: 'Distrito de provinencia',
        trim: true
    },
    barrio: {
        type: String,
        required: 'Barrio de provinencia',
        trim: true
    },
    direccion_exacta: {
        type: String,
        required: 'Dirección exacta del estudiante',
        trim: true
    },
    nombre_direcctor: {
        type: String,
        trim: true
    },
    admitido: {
        type: Boolean,
        default: 0,
        trim: true
    },
    foto: {
        type: String,
        trim: true
    },
    anno_ingreso: {
        type: Number,
        trim: true
    },
    graduado: {
        type: Boolean,
        default: 0,
        trim: true
    },
    traladado: {
        type: Boolean,
        default: 0,
        trim: true
    },
    fecha_traladado: {
        type: Date,
        trim: true
    },
    colegio_procedencia: {
        type: String,
        required: 'Nombre del colegio de procedencia',
        trim: true
    },
    adecuacion_sig: {
        type: Boolean,
        default: 0,
        trim: true
    },
    adecuacion_nsig: {
        type: Boolean,
        default: 0,
        trim: true
    }

});

mongoose.model('Estudiante', EstudianteSchema);