// import express from 'express'
// import faker from 'faker';

// import { Server as HttpServer } from 'http'
// import { Server as Socket } from 'socket.io'

// import ContenedorSQL from './contenedores/ContenedorSQL.js'
// import ContenedorArchivo from './contenedores/ContenedorArchivo.js'

// import config from './config.js'

// //--------------------------------------------
// // instancio servidor, socket y api

// const app = express()
// const httpServer = new HttpServer(app)
// const io = new Socket(httpServer)

// const productosApi = new ContenedorSQL(config.mariaDb, 'productos')
// const mensajesApi = new ContenedorArchivo(`${config.fileSystem.path}/mensajes.json`)

// //--------------------------------------------
// // NORMALIZACIÓN DE MENSAJES
// import normalizr from 'normalizr';
// const normalize = normalizr.normalize;
// const denormalize = normalizr.denormalize;
// const schema = normalizr.schema


// // Definimos un esquema de autor
// const authorSchema = new schema.Entity('author', {}, {idAttribute:'email'})

// // Definimos un esquema de mensaje
// const messageSchema = new schema.Entity('message',{author: authorSchema})

// // Definimos un esquema de posts
// const postsSchema = new schema.Entity('posts', {
//     //author: authorSchema,
//     messages: [messageSchema]
// })

// // print
// import util from 'util';

// function print(objeto) {
// console.log(util.inspect(objeto,false,12,true));
// }
// //--------------------------------------------
// // configuro el socket

// io.on('connection', async socket => {
//     console.log('Nuevo cliente conectado!');

//     // carga inicial de mensajes

//     socket.on('nuevoMensaje', mensaje => {        
//         mensajesApi.save(mensaje)
//         .then(() => {
//             console.log('--------------objeto normalizado--------')
//             const objParaNorm = {}
//             objParaNorm.id = "Mensajes";
//             mensajesApi.getAll()
//             .then(mes => {
//                 objParaNorm.mensajes =mes;
//                 const obj = normalize(objParaNorm, postsSchema);
//                 print(obj)
//                 return obj
//             })

//         })
//         .then( value => {
//             io.sockets.emit('mensajes', value);
//         })
//         .catch((err) => {
//             console.log(err); throw err;
//         })
//     });

//     // actualizacion de mensajes
//     const objParaNorm = {}
//     objParaNorm.id = "Mensajes";
//     mensajesApi.getAll()
//     .then(mes => {
//         objParaNorm.mensajes = mes;
//         //const obj = normalize(mes, postsSchema);
//         let messages = normalize(objParaNorm, postsSchema);
//         print(messages)
//         io.sockets.emit('mensajes', messages);
//     })
//     .catch((err) => {
//         console.log(err); throw err;
//     })
        
// });

// // async function listarMensajesNormalizados() {
    
// // }

// //--------------------------------------------
// // agrego middlewares
// import path from 'path';
// const __dirname = path.resolve();
// app.use(express.json())
// app.use(express.urlencoded({ extended: true }))
// //app.use(express.static('public'));
// app.use(express.static(path.join(__dirname, '../public')));

// //--------------------------------------------

// app.get("/products",function (req, res) {
//     console.log(__dirname)
//     res.sendFile('productos-vista-test.html', { root: path.join(__dirname, '../public') });
//   });

// app.get("/",function (req, res) {
//     console.log(__dirname)
//     res.sendFile('index.html', { root: path.join(__dirname, '../public') });
//   });

// app.get('/api/productos-test', (req, res) => {
//     faker.locale = 'es'
//     const { commerce, image } = faker;
    
//     let prods = [];
    
//     for (let index = 0; index < 5; index++) {
//         let prod= {}
//         prod.title = commerce.product()
//         prod.price = commerce.price()
//         prod.thumbnail = image.image()
//         prods.push(prod)
//     } 
    
//     res.json(prods);
// })

// //--------------------------------------------
// // inicio el servidor

// const PORT = 8080
// const connectedServer = httpServer.listen(PORT, () => {
//     console.log(`Servidor http escuchando en el puerto ${connectedServer.address().port}`)
// })
// connectedServer.on('error', error => console.log(`Error en servidor ${error}`))

import express from 'express'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import config from './config.js'

import { Server as HttpServer } from 'http'
import { Server as Socket } from 'socket.io'

import authWebRouter from './routers/web/auth.js'
import homeWebRouter from './routers/web/home.js'
import productosApiRouter from './routers/api/productos.js'

import addProductosHandlers from './routers/ws/productos.js'
import addMensajesHandlers from './routers/ws/mensajes.js'

//--------------------------------------------
// instancio servidor, socket y api

const app = express()
const httpServer = new HttpServer(app)
const io = new Socket(httpServer)

//--------------------------------------------
// configuro el socket

io.on('connection', async socket => {
    
});

//--------------------------------------------
// configuro el servidor
import path from 'path';
const __dirname = path.resolve();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, '../public')));



app.set('view engine', 'ejs');
app.set('views',path.join(__dirname, '../public/pages'));

app.use(session({
    secret:'secreto',
    resave:false,
    saveUninitialized:false,
    cookie: {
        // Session expires after 1 min of inactivity.
        expires: 60000
    }
}));

//--------------------------------------------
// rutas del servidor API REST

//--------------------------------------------
// rutas del servidor web

app.get('/', (req,res) => {
    console.log(__dirname)
    res.sendFile('login.html', { root: path.join(__dirname, '../public') });

})
app.post('/login', (req,res) => {
    req.session.user = req.body.nombre;
    console.log(req.session)
    res.render('home',{nombre: req.session.user});  
})

app.get('/logout', (req,res) => {
    const nombre = req.session.user;
    req.session.destroy(err => {
        if(err) {
            res.json({ status: 'Log out error', body: err })
        } else {
            res.render('logout',{nombre: nombre});  
        }
     })
})

//--------------------------------------------
// inicio el servidor

const connectedServer = httpServer.listen(config.PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en servidor ${error}`))