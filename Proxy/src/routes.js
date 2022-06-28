import path from 'path';
const __dirname = path.resolve();

export function getRoot(req, res) {
    res.send('Bienvenido');
}

//LOGIN
export function getLogin(req, res) {
    if (req.isAuthenticated()) {
        const user = req.user;
        console.log('user logueado');
        res.render('login-ok', {
            usuario: user.username,
            nombre: user.firstName,
            apellido: user.lastName,
            email: user.email
        });
    } else {
        console.log('user no logueado');
        res.sendFile('login.html', { root: path.join(__dirname, '../public/views/') });
    }
}

export function getSignup(req, res) {
    //console.log(JSON.stringify(req))
    //res.sendFile(__dirname + '../public/views/signup.html');
    res.sendFile('register.html', { root: path.join(__dirname, '../public/views/') });
}

export function postLogin(req, res) {
    res.sendFile('index.html', { root: path.join(__dirname, '../public/views/') });
}

export function postSignup(req, res) {
    res.sendFile('index.html', { root: path.join(__dirname, '../public/views/') });
}

export function getFailLogin(req, res) {
    res.render('login-error', {});
}

export function getFailsignup(req, res) {
    res.render('register-error', {});
}

export function getLogout(req, res) {
    console.log('holoo')
    req.logout(function(err) {
        if (err) { 
            return next(err); }
        console.log('err: '+err)
        //res.redirect('logout');
        res.render('logout')
        
      });
    
}

export function failRoute(req, res) {
    res.status(404).render('routing-error', {});
}

