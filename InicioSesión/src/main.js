import express from 'express'
import engine  from 'express-handlebars'
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



// app.set('view engine', 'ejs');
// app.engine('.hbs',exphbs({ extname: '.hbs', defaultLayout: 'main.hbs' }))
app.engine('.hbs', engine.engine({ extname: '.hbs', defaultLayout: 'main.hbs' }));
app.set('view engine','.hbs')
app.set('views',path.join(__dirname, '../public/pages'));
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };
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
        expires: 600000

    }
}));


//--------------------------------------------
// rutas del servidor API REST

//--------------------------------------------
// rutas del servidor web

// app.get('/', (req,res) => {
//     console.log(__dirname)
//     res.sendFile('login.html', { root: path.join(__dirname, '../public') });

// })
// app.get('/login', (req,res) => {
//     if(!req.session.user){
//         res.sendFile('login.html', { root: path.join(__dirname, '../public') });
//     }else {
//         res.render('home',{nombre: req.session.user});  
//     }
    
// })
//Registro
app.get('/register', (req,res) => {
    res.sendFile('register.html', { root: path.join(__dirname, '../public/views/') });
})

app.post('/register', (req,res) => {
    const { nombre, password, direccion } = req.body;
    const usuario = usuarios.find(usuarui => usuarui.nombre === nombre)
    if(usuario) {
        return res.render('register-error')
    }

    usuario.push({nombre, password, direccion})

    res.redirect('/login')
})

//LOGIN
app.get('/login', (req,res) => {
    res.sendFile('login.html', { root: path.join(__dirname, '../public/views/') });
})

app.post('/login', (req,res) => {
    const { nombre, password} = req.body
    const usuario = usuarios.find(usuario => usuario.nombre === nombre && usuario.password === password)
    if(!usuario) {
        return res.render('login-error')
    }
    req.session.nombre = nombre
    req.session.contador = 0

    res.redirect('/datos')
})
app.post('/login', (req,res) => {
    req.session.user = req.body.nombre;
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