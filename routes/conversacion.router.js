const express = require('express');
const validatorHandler = require('../middleware/validator.handler');
const { conversacion } =  require('../schemas/conversacion.schema');
const ConversacionController = require('../controllers/conversacion.controller');
const router = express.Router();
const conversacionController = new ConversacionController();
const tokenHandler = require('../middleware/token.handler');

router.post('/',
    tokenHandler(),
    validatorHandler(conversacion, 'body'),
    conversacionController.crear
)

router.patch('/',
    tokenHandler(),
    validatorHandler(conversacion, 'body'),
    conversacionController.continuar
)

router.get('/',
    tokenHandler(),
    conversacionController.getAll
)

router.get('/:id',
    tokenHandler(),
    conversacionController.getOne
)

router.get('/buscar/:buscar',
    tokenHandler(),
    conversacionController.getOne
)

module.exports = router;