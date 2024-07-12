const { Schema, model } = require('mongoose');

const Conversacion = Schema({
    mensajes : {
        type: Array,
        required: true,
    },
    userId : {
        type: String,
        required: true,
    },
}, { timestamps: true, collection: 'conversacion'})

module.exports = model( 'Conversacion', Conversacion );