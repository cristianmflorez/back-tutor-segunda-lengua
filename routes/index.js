const express = require('express');
const router = express.Router();
const usuarioRouter = require('../routes/usuario.router') 
const conversacionRouter = require('./conversacion.router')

function routerApi(app){
  app.use('/api', router);
  router.use('/usuario', usuarioRouter);
  router.use('/chat', conversacionRouter);
}

module.exports = routerApi;
