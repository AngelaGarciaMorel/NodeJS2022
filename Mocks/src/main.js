import express from 'express'
import faker from 'faker';

import { Server as HttpServer } from 'http'
import { Server as Socket } from 'socket.io'

import ContenedorSQL from './contenedores/ContenedorSQL.js'
import ContenedorArchivo from './contenedores/ContenedorArchivo.js'

import config from './config.js'

//--------------------------------------------
// instancio servidor, socket y api

const app = express()
const httpServer = new HttpServer(app)
const io = new Socket(httpServer)

const productosApi = new ContenedorSQL(config.mariaDb, 'productos')
const mensajesApi = new ContenedorArchivo(`${config.fileSystem.path}/mensajes.json`)

//--------------------------------------------
// NORMALIZACIÓN DE MENSAJES
import normalizr from 'normalizr';
const normalize = normalizr.normalize;
const denormalize = normalizr.denormalize;
const schema = normalizr.schema


// Definimos un esquema de autor
const author = new schema.Entity('author')

// Definimos un esquema de mensaje
const message = new schema.Entity('message')

// Definimos un esquema de posts
const posts = new schema.Entity('posts', {
    author: author,
    messages: [message]
})

console.log('--------------objeto normalizado--------')
//const normalizeData = normalize(mensajesApi.getAll(), posts);
//print(normalizeData)

//--------------------------------------------
// configuro el socket

io.on('connection', async socket => {
    console.log('Nuevo cliente conectado!');

    // // carga inicial de productos
    // socket.on('new-product', product => {
    //     sqlP.insert(product)
    //     .then(() => {
    //     return sqlP.getAll();
    //     })
    //     .then( value => {
    //         io.sockets.emit('productos', value);
    //     })
    //     .catch((err) => {
    //         console.log(err); throw err;
    //     })
    // });   

    // // actualizacion de productos
    // let products = sqlP.getAll();
    // products.then( value => {
    //     io.sockets.emit('productos', value);
    // })
    // .catch((err) => {
    //     console.log(err); throw err;
    // })   

    // carga inicial de mensajes

    socket.on('nuevoMensaje', message => {
        mensajesApi.save(message)
        .then(() => {
        return normalize(mensajesApi.getAll(), posts);;
        })
        .then( value => {
            io.sockets.emit('mensajes', value);
        })
        .catch((err) => {
            console.log(err); throw err;
        })
    });

    // actualizacion de mensajes
    let messages = normalize(mensajesApi.getAll(), posts);;
    messages.then( value => {
        io.sockets.emit('mensajes', value);
    })
    .catch((err) => {
        console.log(err); throw err;
    })
        
});

async function listarMensajesNormalizados() {
    
}

//--------------------------------------------
// agrego middlewares
import path from 'path';
const __dirname = path.resolve();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
//app.use(express.static('public'));
app.use(express.static(path.join(__dirname, '../public')));

//--------------------------------------------

app.get("/products",function (req, res) {
    console.log(__dirname)
    res.sendFile('productos-vista-test.html', { root: path.join(__dirname, '../public') });
  });

app.get("/",function (req, res) {
    console.log(__dirname)
    res.sendFile('index.html', { root: path.join(__dirname, '../public') });
  });

app.get('/api/productos-test', (req, res) => {
    faker.locale = 'es'
    const { commerce, image } = faker;
    
    let prods = [];
    
    for (let index = 0; index < 5; index++) {
        let prod= {}
        prod.title = commerce.product()
        prod.price = commerce.price()
        prod.thumbnail = image.image()
        prods.push(prod)
    } 
    
    res.json(prods);
})

//--------------------------------------------
// inicio el servidor

const PORT = 8080
const connectedServer = httpServer.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en servidor ${error}`))