const express = require('express')
const { Router } = express;

//instancia del servidor
const app = express();


//intancia de la persistencia
const  pkg  = require('./contenedores/contenedor.cjs');
const {Contenedor} = pkg;
const productsApi = new Contenedor('productos.txt');
const cartApi = new Contenedor('carrito.txt');

//carpeta estatica
app.use(express.static('../public'));

// permisos de administrador MIDDLEWARES
const esAdmin = true

function crearErrorNoEsAdmin(ruta, metodo) {
    
}

function soloAdmins(req, res, next) {
}

//Router Productos
const routerProducts = new Router();
routerProducts.use(express.json());
routerProducts.use(express.urlencoded({ extended: true }));

app.use('/api/productos', routerProducts);

//Servicios Productos
routerProducts.get('/', (req, res) => {
    listaProductos = productsApi.getAll();
    listaProductos.then( value => {
        if(value === null){
            res.json({ error : 'No hay productos disponibles' });
        } else {
            res.json({value});
        }
    });

});

routerProducts.get('/:id', (req, res) => {
    let unProd = productsApi.getById(req.params.id);
    unProd.then( value => {
        if(value === null){
            res.json({ error : 'producto no encontrado' });
        } else {
            res.json({value});
        }
    });

});

routerProducts.post('/', (req, res) => {
    let product = productsApi.save(req.body);
    res.json({ product });
    
});

routerProducts.put('/:id', (req, res) => {

    let unProd = productsApi.updateById(req.params.id, req.body);

    unProd.then( value => {    
        if(value === null){
            res.json({ error : 'producto no encontrado' });
        } else {
            res.json({value});
        }
    });

});

routerProducts.delete('/:id', (req, res) => {
    const idProd = req.params.id;
    let id = productsApi.deleteById(idProd);
    res.json({id: idProd});
});

//Router Carrito    
const routerCart = new Router();
routerCart.use(express.json());
routerCart.use(express.urlencoded({ extended: true }));

app.use('/api/carritos', routerCart);

//Servicios Carrito
routerCart.get('/', (req, res) => {
    listaProductos = cartApi.getAll();
    listaProductos.then( value => {
        if(value === null){
            res.json({ error : 'No hay productos disponibles' });
        } else {
            res.json({value});
        }
    });

});

routerCart.get('/:id', (req, res) => {
    let unProd = cartApi.getById(req.params.id);
    unProd.then( value => {
        if(value === null){
            res.json({ error : 'producto no encontrado' });
        } else {
            res.json({value});
        }
    });

});

routerCart.post('/', (req, res) => {
    let id = cartApi.save(req.body);
    res.json({ id });
    
});

routerCart.put('/:id', (req, res) => {

    let unProd = cartApi.updateById(req.params.id, req.body);

    unProd.then( value => {    
        if(value === null){
            res.json({ error : 'producto no encontrado' });
        } else {
            res.json({value});
        }
    });

});

routerCart.delete('/:id', (req, res) => {
    const idProd = req.params.id;
    let id = cartApi.deleteById(idProd);
    res.json({id: idProd});
});



//export del modulo
module.exports = app