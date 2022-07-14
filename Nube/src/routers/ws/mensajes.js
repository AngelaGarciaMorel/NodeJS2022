import mensajesApi from '../../api/mensajes.js'
import { normalizarMensajes } from '../../normalizacion/index.js'
import { loggerDefault, loggerError, loggerWarn } from '../../loggers/log4js.js' 

export default async function configurarSocket(socket, sockets) {

    // carga inicial de mensajes
      socket.on('nuevoMensaje', mensaje => {  
        loggerDefault.info(`Ruta /nuevoMensaje, Metodo POST`);      
        mensajesApi.save(mensaje)
        .then(() => {
            const objParaNorm = {}
            objParaNorm.id = "Mensajes";
            mensajesApi.getAll()
            .then(mes => {
                objParaNorm.mensajes =mes;
                const obj = normalize(objParaNorm, normalizarMensajes);
                return obj
            })

        })
        .then( value => {
            sockets.emit('mensajes', value);
        })
        .catch((err) => {
            loggerError.error(`Error postMensajes: ${err}`);
            console.log(err); throw err;
        })
    });

    // actualizacion de mensajes
    const objParaNorm = {}
    objParaNorm.id = "Mensajes";
    mensajesApi.getAll()
    .then(mes => {
        loggerDefault.info(`Ruta /mensajes, Metodo GET`);    
        objParaNorm.mensajes = mes;
        let messages = normalize(objParaNorm, normalizarMensajes);
        sockets.emit('mensajes', messages);
    })
    .catch((err) => {
        loggerError.error(`Error getMensajes: ${err}`);
        console.log(err); throw err;
    })  
}