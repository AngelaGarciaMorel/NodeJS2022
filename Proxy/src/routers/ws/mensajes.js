import mensajesApi from '../../api/mensajes.js'
import { normalizarMensajes } from '../../normalizacion/index.js'

export default async function configurarSocket(socket, sockets) {

    // carga inicial de mensajes
      socket.on('nuevoMensaje', mensaje => {        
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
            console.log(err); throw err;
        })
    });

    // actualizacion de mensajes
    const objParaNorm = {}
    objParaNorm.id = "Mensajes";
    mensajesApi.getAll()
    .then(mes => {
        console.log('mes: '+mes)
        objParaNorm.mensajes = mes;
        let messages = normalize(objParaNorm, normalizarMensajes);
        sockets.emit('mensajes', messages);
    })
    .catch((err) => {
        console.log(err); throw err;
    })  
}