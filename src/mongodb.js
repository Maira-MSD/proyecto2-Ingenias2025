//conexion con datos guardados en archivo.env

const dotenv = require("dotenv");
dotenv.config();

const {MongoClient} = require("mongodb");

//acceso al cluster MongoDB

const URI = process.env.MONGODB_URLSTRING;
const client = new MongoClient(URI);

//funciones asincronas para conexion/desconexion de la bbdd

async function connectToMongoDB() {
    try {
        await client.connect();
            console.log("Conectado a cluster19");
        return client;
    } catch (error) {
            console.log("Error al conectar a MongoDB: ", error);
        return null;
    }
}

async function disconnectFromMongoDB () {
    try {
        await client.close();
            console.log("Desconectado de MongoDB");
    } catch (error) {
            console.log("Error al desconectar de MongoDB: ", error);
    }
    
}

//Exportar las funciones de conexion/desconexion

module.exports = {connectToMongoDB , disconnectFromMongoDB};
