const jwt = require('jsonwebtoken');
const {config} = require('../config/config')

function tokenHandler () {
    return (req, res, next) => {

        try {
            if(req.headers.authorization === null || req.headers.authorization === undefined){
                return res.status(400).json({message: "Debes iniciar sesión"})
            }else{
                let payload = jwt.verify(req.headers.authorization, config.jwtSecret);
                // let payload = jwt.verify(req.headers.authorization, config.jwtSecret);
                if(payload.nombre){
                    req.body = {...req.body, userId: payload.userId}
                    next();
                }
            }
            
        } catch (error) {
            console.log(error)
            res.status(400).json({message: "Problemas de autenticación"})
        }
      }
}

module.exports = tokenHandler;