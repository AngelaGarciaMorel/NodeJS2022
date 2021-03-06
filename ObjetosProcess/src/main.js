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


const productosApi = new ContenedorSQL(config.mariaDb, 'productos')
const mensajesApi = new ContenedorArchivo(`${config.fileSystem.path}/mensajes.json`)
//--------------------------------------------
// configuro el socket
const normalize = normalizr.normalize;

io.on('connection', async socket => {
    console.log('Nuevo cliente conectado!');
    addMensajesHandlers(socket,io.sockets)
       
});

//--------------------------------------------
// configuro el servidor
import path from 'path';
const __dirname = path.resolve();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, '../public')));

//--------------------------------------------
// configuro del passport
import * as routes from './routes.js';
import * as controllersdb from './controllersdb.js';
import { User } from './models.js';

passport.use('login', new LocalStrategy(
    (username, password, done) => {
        console.log('username: '+username)
        User.findOne({ username }, (err, user) => {
            if (err)
                return done(err);
            if (!user) {
                console.log('User not found ' + username);
                return done(null, false);
            }
            if (!isValidPassword(user, password)) {
                return done(null, false);
            }

            return done(null, user);
        });
    }
));

passport.use('register', new LocalStrategy({
    passReqToCallback: true
}, (req, username, password, done) => {
    User.findOne({ 'username': username }, (err, user) => {
        if (err) {
            return done(err);
        }
        if (user) {
            return done(null, false);
        }

        const newUser = {
            username: username,
            password: createHash(password),
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        }

        User.create(newUser, (err, userWithId) => {
            if (err) {
                return done(err);
            }
            return done(null, userWithId);
        })
    })
}));

passport.serializeUser((user, done) => {
    done(null, user._id);
})

passport.deserializeUser((id, done) => {
    User.findById(id, done);
});

function isValidPassword(user, password) {
    return bcrypt.compareSync(password, user.password);
}

function createHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

//--------------------------------------------
//configuraci??n vistas

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

app.use(passport.initialize());
app.use(passport.session());

app.get('/', routes.getRoot);

//LOGIN
app.get('/login', routes.getLogin);
app.post('/login', passport.authenticate('login', {failureRedirect: '/faillogin'}), routes.postLogin)
app.get('/faillogin', routes.getFailLogin);

//REGISTER
app.get('/register', routes.getSignup);
app.post('/register', passport.authenticate('register', {failureRedirect: '/failsignup'}), routes.postSignup)
app.get('/failsignup', routes.getFailsignup);

function checkAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login');
    }
}


app.get('/logout', routes.getLogout);

controllersdb.conectarDB(config.mongoAtlas.URL, err => {
    if (err) return console.log('error bdd')
    console.log('Base de datos conectada');

    app.listen(config.PORT, (err) => {
        if (err) return console.log('error en listen server');
        console.log('Server running');
    })
})


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