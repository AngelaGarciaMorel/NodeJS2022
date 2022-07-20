import express from 'express'
import engine  from 'express-handlebars'
import session from 'express-session'
import normalizr from 'normalizr';
import MongoStore from 'connect-mongo'
import bcrypt  from 'bcrypt'
import passport from 'passport'
import path from 'path';
const __dirname = path.resolve();
import os from 'os'
import cluster from 'cluster';

import config from './config.js'

import { Server as HttpServer, Server } from 'http'
import { Server as Socket } from 'socket.io'

import ContenedorSQL from './contenedores/ContenedorSQL.js'
import ContenedorArchivo from './contenedores/ContenedorArchivo.js'

//import authWebRouter from './routers/web/auth.js'
import randomRouter from './api/randoms.js'

//import productosApiRouter from './routers/api/productos.js'

// import addProductosHandlers from './routers/ws/productos.js'
 import addMensajesHandlers from './routers/ws/mensajes.js'

//--------------------------------------------
// instancio servidor, socket y api

const app = express()
const httpServer = new HttpServer(app)
const io = new Socket(httpServer)


const productosApi = new ContenedorSQL(config.mariaDb, 'productos')
const mensajesApi = new ContenedorArchivo(`${config.fileSystem.path}/mensajes.json`)
//--------------------------------------------
// configuro el socket
io.on('connection', async socket => {
    console.log('Nuevo cliente conectado!');
    addMensajesHandlers(socket,io.sockets)       
});

//--------------------------------------------
// configuro el servidor
// import path from 'path';
// const __dirname = path.resolve();
// app.use(express.json())
// app.use(express.urlencoded({ extended: true }))
// app.use(express.static(path.join(__dirname, '../public')));

//--------------------------------------------
// configuro del passport
import * as controllersdb from './controllersdb.js';

//--------------------------------------------
//configuración vistas

app.engine('.hbs', engine.engine({ extname: '.hbs', defaultLayout: 'main.hbs' }));
app.set('view engine','.hbs')
app.set('views',path.join(__dirname, '../public/views'));
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };
//--------------------------------------------

app.use(session({
    store: MongoStore.create({
        mongoUrl: config.mongoAtlas.URL,
        mongoOptions: advancedOptions
    }),
    secret:'secreto',
    resave:false,
    saveUninitialized:false,
    cookie: {
        // Session expires after 10 min of inactivity.
        expires: Number(config.TIEMPO_EXPIRACION)

    }
}));


//--------------------------------------------
// rutas del servidor web
app.use(passport.initialize());
app.use(passport.session());
//app.use(authWebRouter)
//app.use(homeWebRouter)

app.use(randomRouter)

if(config.EJECSERVER === 'FORK'){

// controllersdb.conectarDB(config.mongoAtlas.URL, err => {
//     if (err) return console.log('error bdd')
//     console.log('Base de datos conectada');

    app.listen(config.PORT, (err) => {
        if (err) return console.log('error en listen server');
        console.log(`Server running PID ${process.pid}`);
    })
// })
} else {
    const numCpu = os.cpus().length
    if(cluster.isPrimary) {
        console.log(numCpu);
        console.log(`PID MASTER ${process.pid}`);
    
        for(let i=0; i< numCpu; i++) {
            cluster.fork()
        }
    
        cluster.on('exit', worker => {
           console.log(`Worker ${worker.process.pid} died`);
           cluster.fork();
        });
    } else {
        // controllersdb.conectarDB(config.mongoAtlas.URL, err => {
        //     if (err) return console.log('error bdd')
        //     console.log('Base de datos conectada');
            app.listen(config.PORT, (err) => {
                if (err) return console.log('error en listen server');
                console.log(`Server running PID ${process.pid}`);
            })
        // })
    }
}


