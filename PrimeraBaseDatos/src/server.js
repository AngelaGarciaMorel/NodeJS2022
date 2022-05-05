const express = require('express');
const { engine } = require('express-handlebars');
const { Server: IOServer } = require('socket.io');
const { Server: HttpServer } = require('http');

const  pkg  = require('./contenedores/contenedorDB.cjs');
const {ContenedorBD} = pkg;

//persistencia products
const { options } = require('./options/mariaDB');
const sqlP = new ContenedorBD(options, 'products');

//persistencia messages
const { optionsS } = require('./options/SQLite');
const sqlS = new ContenedorBD(optionsS, 'messages');
//

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);


app.use(express.static('../public'));


app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname });
});

httpServer.listen(8080, () => console.log('server on')); 



io.on('connection', (socket) => {
    console.log('Un cliente se ha conectado');
//products
    let products = sqlP.getAll();
    products.then( value => {
        io.sockets.emit('products', value);
    })
    .catch((err) => {
        console.log(err); throw err;
    })

    socket.on('new-product', product => {
        sqlP.insert(product)
        .then(() => {
        return sqlP.getAll();
        })
        .then( value => {
            io.sockets.emit('products', value);
        })
        .catch((err) => {
            console.log(err); throw err;
        })
    });
//messages
    let messages = sqlS.getAll();
    messages.then( value => {
        io.sockets.emit('messages', value);
    })
    .catch((err) => {
        console.log(err); throw err;
    })

    socket.on('new-message', message => {
        sqlS.insert(message)
        .then(() => {
        return sqlS.getAll();
        })
        .then( value => {
            io.sockets.emit('messages', value);
        })
        .catch((err) => {
            console.log(err); throw err;
        })
    });
})