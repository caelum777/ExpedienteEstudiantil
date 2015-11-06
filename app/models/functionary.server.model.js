'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Functionary Schema
 */
var FunctionarySchema = new Schema({

	firstName: {
		type: String,
		default: '',
		required: 'Porfavor llene el nombre del funcionario',
		trim: true
	},

	firstSurname: {
		type: String,
		default: '',
		required: 'Porfavor llene el primer apellido del funcionario',
		trim: true
	},

	secondSurname: {
		type: String,
		default: '',
		required: 'Porfavor llene el segundo apellido del funcionario',
		trim: true
	},

	identification: {
		type: String,
		default: '',
		required: 'Porfavor llene la cedula del funcionario',
		trim: true
	},

	maritalStatus: {
		type: String,
		default: '',
		trim: true
	},

	role: {
		type: String,
		default: '',
		trim: true
	},

	birthdate: {
		type: Date,
		default: '',
		required: 'Porfavor la fecha de nacimiento del funcionario',
		trim: true
	},

	address: {
		type: String,
		default: '',
		required: 'Porfavor llene la direccion del funcionario',
		trim: true
	},

	phoneNumber: {
		type: String,
		default: '',
		required: 'Porfavor llene el telefono del funcionario',
		trim: true
	},

	cellphoneNumber: {
		type: String,
		default: '',
		required: 'Porfavor llene el celular del funcionario',
		trim: true
	},


	resume:{
		summary:{
			type: String,
			default: '',
			trim: true
		},
		experience:[{ type:Schema.ObjectId, ref:'FunctionaryResumeExperience'}],
		education:[{type:Schema.ObjectId, ref:'FunctionaryResumeEducation'}],
		language:[{ type:Schema.ObjectId, ref:'FunctionaryResumeLanguage'}]
	},

	email: {
		type: String,
		default: '',
		required: 'Porfavor llene el email del funcionario',
		trim: true
	},

	hireDate: {
		type: Date,
		default: Date.now,
		required: 'Porfavor llene la fecha de contratacion del funcionario',
		trim: true
	},

	/*
	 *  Work status:
	 *
	 *  Active, Fired, Resign.
	 * */

	status: {
		type: String,
		default: ''
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

mongoose.model('Functionary', FunctionarySchema);
