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
//Agrega un producto
routerProducts.post('/', (req, res) => {
    let product = productsApi.save(req.body);
    res.json({ product });
    
});
//modifica un producto
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
//elimina un producto
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
//obtiene todos los carritos
routerCart.get('/', (req, res) => {
    listaCarritos = cartApi.getAll();
    listaCarritos.then( value => {
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

//obtiene los productos del carrito
routerCart.get('/:id/productos', (req, res) => {
    let unProd = cartApi.getById(req.params.id);
    unProd.then( value => {
        if(value === null){
            res.json({ error : 'producto no encontrado' });
        } else {
            res.json({value});
        }
    });

});

//agrega un carrito
routerCart.post('/', (req, res) => {
    let id = cartApi.save(req.body);
    res.json({ id });
    
});

//agrega un producto al carrito
routerCart.post('/:id/productos', (req, res) => {   
    let unProd = productsApi.getById(req.body.id);

    unProd.then( value => {   
        let unCarrito = cartApi.getById(req.params.id);

        unCarrito.then( valueCarrito => { 
            if (valueCarrito.productos === undefined) {
                valueCarrito.productos = [];  
            }           
            valueCarrito.productos.push(value);
            
            valueCarrito = cartApi.updateById(req.params.id, valueCarrito);
            valueCarrito.then( value2Carrito => {
                if(value2Carrito === null){
                    res.json({ error : 'producto no encontrado' });
                } else {
                    res.json({value2Carrito});
                }
            });
        });
    });    
});

//elimina un carrito
routerCart.delete('/:id', (req, res) => {
    const idProd = req.params.id;
    let id = cartApi.deleteById(req.params.id);
    res.json({id: idProd});
});

//elimina un producto del carrito
routerCart.delete('/:id/productos/:idP', (req, res) => {
    const idProd = req.params.id;
    let id = cartApi.deleteObjectById(req.params.id,req.params.idP);
    res.json({id: idProd});
});





//export del modulo
module.exports = app