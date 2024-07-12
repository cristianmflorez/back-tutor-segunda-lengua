require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'dev',
  jwtSecret: process.env.JWT_SECRET,
  dbCnx: process.env.DB_CNX,
}


module.exports = {config};