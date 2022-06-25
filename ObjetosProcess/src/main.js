import express from 'express'
import engine  from 'express-handlebars'
import session from 'express-session'
import normalizr from 'normalizr';
import MongoStore from 'connect-mongo'
import bcrypt  from 'bcrypt'
import passport from 'passport'
import LocalStrategy from 'passport-local'
import config from './config.js'

import { Server as HttpServer, Server } from 'http'
import { Server as Socket } from 'socket.io'

import ContenedorSQL from './contenedores/ContenedorSQL.js'
import ContenedorArchivo from './contenedores/ContenedorArchivo.js'

// import authWebRouter from './routers/web/auth.js'

//import productosApiRouter from './routers/api/productos.js'

// import addProductosHandlers from './routers/ws/productos.js'
 import addMensajesHandlers from './routers/ws/mensajes.js'

//--------------------------------------------
// instancio servidor, socket y api

const app = express()
const httpServer = new HttpServer(app)
const io = new Socket(httpServer)

// controllersdb.conectarDB(config.mongoAtlas.URL, err => {
//     if (err) return console.log('error bdd')
//     console.log('Base de datos conectada');

    app.listen(config.PORT, (err) => {
        if (err) return console.log('error en listen server');
        console.log('Server running');
    })
// })


app.get('/info', (req,res) => {
    let respuesta = {}
    respuesta.Argumentos_Entrada = config.PORT + ", " + config.TIEMPOEXPIRACION
    respuesta.SO = process.platform
    respuesta.NodeVer = process.version
    respuesta.TotMemoria = process.memoryUsage()
    respuesta.Path = process.execPath
    respuesta.pid = process.pid
    respuesta.Dir = process.cwd()
    console.log(respuesta)
    res.json({respuesta});
});


import { fork } from 'child_process'
const forked = fork('child.js')


forked.on('message', msg => {
    console.log('Mensaje del hijo', msg)
})


export function calculaRandom(numPosibilidades) {
    let numbers = []
    for (let index = 0; index < numPosibilidades; index++) {
        const element = Math.floor((Math.random() * (1000 - 1 + 1)) + 1)
        numbers.push(element)
    }
    const frequency = numbers.reduce((acc, item) => {
        // This tertiary statement says to add one to whatever 
        // is at acc[item] if it exists, or just set acc[item] to one.
        acc[item] = acc[item] ? acc[item] + 1 : 1;
        return acc;
      }, {});
    return frequency
}

app.get('/api/randoms', (req,res) => {
    let numPosibilidades = req.query.cant
    console.log('numPosibilidades: ' +numPosibilidades)
    if(numPosibilidades === undefined){
        numPosibilidades = 100000000
    }
    console.log('num: ' +numPosibilidades)
    res.json(calculaRandom(numPosibilidades))
});

setTimeout(() => {
    forked.send({mensaje: 'Hola'})
})