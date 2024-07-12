const { Schema, model } = require('mongoose');

const Usuario = Schema({
    nombre : {
        type: String,
        required: true,
        unique: false
    },
    apellido : {
        type: String,
        required: true,
    },
    correo : {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    contrasena : {
        type: String,
        required: true,
    },
    idiomaNativo : {
        type: String,
        required: true,
    },
    fechaNacimiento : {
        type: Date,
        required: true,
    },
}, { timestamps: true, collection: 'usuario'})

module.exports = model( 'Usuario', Usuario );