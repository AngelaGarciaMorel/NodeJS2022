import express from 'express'
const { Router } = express

//instancia del servidor
const app = express();

//intancia de la persistencia
import {
    productosDao as productsApi,
    carritosDao as cartApi
} from './daos/index.js'

// permisos de administrador MIDDLEWARES
const esAdmin = true

function crearErrorNoEsAdmin(ruta, metodo) {
    const error = {
        error: 1,
    }
    if (ruta && metodo) {
        error.routerProducts= `ruta '${ruta}' metodo '${metodo}' no autorizado`;
    } else {
        error.descripcion = 'no autorizado';
    }
    return error;
}

function soloAdmins(req, res, next) {
    if (!esAdmin) {
        res.json(crearErrorNoEsAdmin());
    } else {
        next();
    } 
}

//Router Productos
const routerProducts = new Router();

routerProducts.get('/', async (req, res) => {
    productsApi.getAll()
    .then(products => {
        console.log(products);
        res.json(products)
    })

})

routerProducts.get('/:id', (req, res) => {
    productsApi.getById(req.params.id)
    .then( value => {
        if(value === null){
            res.json({ error : 'producto no encontrado' });
        } else {
            res.json({value});
        }
    });
});

// //Agrega un producto
routerProducts.post('/', soloAdmins, (req, res) => {
    productsApi.insert(req.body)
    .then(product => {
        res.json({ product });
    })    
});

//modifica un producto
routerProducts.put('/:id', soloAdmins, (req, res) => {

    productsApi.updateById(req.params.id, req.body)
    .then( value => {    
        if(value === null){
            res.json({ error : 'producto no encontrado' });
        } else {
            res.json({value});
        }
    });
});
// //elimina un producto
routerProducts.delete('/:id', soloAdmins, (req, res) => {
    const idProd = req.params.id;
    productsApi.deleteById(idProd)
    .then(idProd => {
        res.json({id: idProd});
    })

});

// //Router Carrito    
const routerCart = new Router();
routerCart.get('/', async (req, res) => {
    cartApi.getAll()
    .then(carts => {
        console.log(carts);
        res.json(carts)
    })
})

// //agrega un carrito
routerCart.post('/', (req, res) => {
    let id = cartApi.insert(req.body);
    res.json({ id });
    
});


// //obtiene los productos del carrito
routerCart.get('/:id/productos', (req, res) => {
    cartApi.getById(req.params.id)
   .then( value => {
        if(value === null){
            res.json({ error : 'No hay productos' });
        } else {
            res.json({value});
        }
    });

});

// //agrega un producto al carrito
routerCart.post('/:id/productos', (req, res) => { 
    productsApi.getById(req.body._id)
    .then( product => { 
        res.json(cartApi.addProductsinCart(req.params.id,product)); 
    })
       
});

// //elimina un carrito
routerCart.delete('/:id', (req, res) => {
    cartApi.deleteById(req.params.id)
    .then(id => {
        res.json({id: id});
    })

});

// //elimina un producto del carrito
routerCart.delete('/:id/productos/:idP', (req, res) => {
    const idProd = req.params.id;
    const resp = cartApi.deleteProductFromCart(req.params.id,req.params.idP)
    res.json(resp);


});

//--------------------------------------------
// configuro el servidor

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
//carpeta estatica
app.use(express.static('../public'));

app.use('/api/productos', routerProducts)
app.use('/api/carritos', routerCart)



// //Servicios Carrito


// //elimina un producto del carrito
// routerCart.delete('/:id/productos/:idP', (req, res) => {
//     const idProd = req.params.id;
//     let id = cartApi.deleteObjectById(req.params.id,req.params.idP);
//     res.json({id: idProd});
// });





//export del modulo
export default app