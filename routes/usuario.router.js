const express = require('express');
const validatorHandler = require('../middleware/validator.handler');
const { crearUsuario, editarUsuario, idUsuario, loginUsuario } =  require('../schemas/usuario.schema');
const UsuarioController = require('../controllers/usuario.controller');
const router = express.Router();
const usuarioController = new UsuarioController();
const tokenHandler = require('../middleware/token.handler');

router.post('/',
    validatorHandler(crearUsuario, 'body'),
    usuarioController.create
)

router.post('/login',
    validatorHandler(loginUsuario, 'body'),
    usuarioController.login
)

router.patch('/',
    tokenHandler(),
    validatorHandler(editarUsuario, 'body'),
    usuarioController.edit
)

router.get('/',
    tokenHandler(),
    usuarioController.get
)

router.delete('/',
    tokenHandler(),
    validatorHandler(idUsuario, 'query'),
    usuarioController.delete
)

module.exports = router;