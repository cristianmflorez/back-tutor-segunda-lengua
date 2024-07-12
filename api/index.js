// Load swagger support
const swagger = require('swagger-autogen')
swagger();
const express = require('express');
const routerApi = require('../routes/index');
const { logErrors, errorHandler, boomErrorHandler } = require('../middleware/error.handler');
const { dbConnection } = require('../database/config');
const port = process.env.PORT || 3001;
const app = express();
const http = require('http')
const server = http.Server(app);
// const { wsHandler } = require('./websocket/wsHandler');
const timeout = require('connect-timeout');
// const io = require('socket.io')(server, {cors: {origin: 'https://front-tutor-segunda-lengua.vercel.app'}});// 

// for invalid request
server.on('clientError', (err, socket) => {
  // console.error(err);
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

// timeout requests
function haltOnTimedout (req, res, next) {
  if (!req.timedout){
    next()
  }else{
    res.status(408).json({message: 'La solicitud ha excedido el tiempo de espera'});
  }
}
app.use(timeout('20s'));

// CORS headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://front-tutor-segunda-lengua.vercel.app') // https://front-tutor-segunda-lengua.vercel.app   http://localhost:3000
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Credentials', true )
  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization")
  next()
});

// io.on('connection', (socket) => {
//   // console.log('User connected');
//   //manejo de mensajes
//   wsHandler(socket, io);
//   //desconexión del socket
//   socket.on('disconnect', () => {
//     // console.log('User disconnected');
//   });
// });

// // DB
dbConnection();

app.use(express.json());
app.use(haltOnTimedout);

//gestión de rutas
routerApi(app);

//manejo de errores
app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);
app.use(haltOnTimedout);

server.listen(port, () => {
    console.log('Mi port ' +  port);
});

app.get('/', (req, res) => {
  res.send('API running')
});