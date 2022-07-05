import { Router } from 'express'
import passport from 'passport'
import LocalStrategy from 'passport-local'
import path from 'path'
import { User } from '../../models/models.js';
import { loggerDefault, loggerWarn } from '../../loggers/log4js.js' 

passport.use('login', new LocalStrategy(
    (username, password, done) => {
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

const authWebRouter = new Router()

authWebRouter.getRoot('/',(req, res) => {
    loggerDefault.info(`Ruta /, Metodo GET`);
    res.send('Bienvenido');
})

//LOGIN
authWebRouter.getLogin('/login',(req, res) => {
    loggerDefault.info(`Ruta /login, Metodo GET`);
    if (req.isAuthenticated()) {
        const user = req.user;
        res.render('login-ok', {
            usuario: user.username,
            nombre: user.firstName,
            apellido: user.lastName,
            email: user.email
        });
    } else {
        
        res.sendFile('login.html', { root: path.join(__dirname, '../public/views/') });
    }
})

authWebRouter.getSignup('/register', (req, res) => {
    loggerDefault.info(`Ruta /register, Metodo GET`);
    //console.log(JSON.stringify(req))
    //res.sendFile(__dirname + '../public/views/signup.html');
    res.sendFile('register.html', { root: path.join(__dirname, '../public/views/') });
})

authWebRouter.postLogin('/login',(req, res) => {
    loggerDefault.info(`Ruta /login, Metodo POST`);
    res.sendFile('index.html', { root: path.join(__dirname, '../public/views/') });
})

authWebRouter.postSignup('/register', (req, res) => {
    loggerDefault.info(`Ruta /register, Metodo POST`);
    res.sendFile('index.html', { root: path.join(__dirname, '../public/views/') });
})

authWebRouter.getFailLogin('/faillogin', (req, res)  => {
    res.render('login-error', {});
})

authWebRouter.getFailsignup('/failsignup', (req, res) => {
    res.render('register-error', {});
})

authWebRouter.getLogout('/logout', (req, res) => {
    loggerDefault.info(`Ruta /logout, Metodo POST`);
    req.logout(function(err) {
        if (err) { 
            return next(err); }
        res.render('logout')
        
      });
    
})

// export function failRoute(req, res) {
//     res.status(404).render('routing-error', {});
// }

export default authWebRouter