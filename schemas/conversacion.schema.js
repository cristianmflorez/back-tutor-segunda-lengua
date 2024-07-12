const Joi = require('joi');

const mensajes = Joi.array().items({
    parts: Joi.array().required(),
    role: Joi.string().required()
});
const _id = Joi.string();
const userId = Joi.string();
// const language = Joi.string();

const conversacion = Joi.object({
    mensajes : mensajes.required(),
    _id: _id,
    userId: userId.required(),
    // language : language.required(),
})

module.exports = { conversacion }