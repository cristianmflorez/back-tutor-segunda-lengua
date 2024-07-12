const mongoose = require('mongoose');
const {config} = require('./../config/config');

const dbConnection = async () =>{

    try {
        await mongoose.connect( config.dbCnx,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        console.log( '-- DB online --' );
    } catch (error) {
        console.log( error );
        throw new Error('Error al conectar a la base de datos ver log');
    }

}

module.exports = {
    dbConnection
};