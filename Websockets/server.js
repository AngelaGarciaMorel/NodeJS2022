const express = require('express');
const { engine } = require('express-handlebars');
const { Server: IOServer } = require('socket.io');
const { Server: HttpServer } = require('http');

//Acceso archivos
const  pkg  = require('./contenedor.cjs');
const {Contenedor} = pkg;
const fileProd = new Contenedor('productos.txt');
const fileMens = new Contenedor('mensajes.txt');
//

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);


app.use(express.static('./public'));


app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname });
});

httpServer.listen(8080, () => console.log('server on')); 



io.on('connection', (socket) => {
    console.log('Un cliente se ha conectado');
    let products = fileProd.getAll();
    products.then( value => {
        io.sockets.emit('products', value);
    });


    socket.on('new-product', product => {
        fileProd.save(product);
        products = fileProd.getAll();
        products.then( value => {
            io.sockets.emit('products', value);
        });   
    });


    let messages = fileMens.getAll();
    messages.then( value => {
        io.sockets.emit('messages', value);
    });


    socket.on('new-message', message => {
        fileMens.save(message);
        messages = fileMens.getAll();
        messages.then( value => {
            io.sockets.emit('messages', value);
        });
    });
})