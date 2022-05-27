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



// Definimos un esquema de autor


// Definimos un esquema de mensaje


// Definimos un esquema de posts




//--------------------------------------------
// configuro el socket

io.on('connection', async socket => {
    console.log('Nuevo cliente conectado!');

    // carga inicial de productos
   

    // actualizacion de productos
    

    // carga inicial de mensajes
    

    // actualizacion de mensajes
    
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
// import path from 'path';
// import { fileURLToPath } from 'url';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

app.get("/",function (req, res) {
    console.log(__dirname)
    res.sendFile('productos-vista-test.html', { root: path.join(__dirname, '../public') });
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