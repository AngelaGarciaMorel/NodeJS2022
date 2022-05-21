import express from 'express'
const { Router } = express

//instancia del servidor
const app = express();

//intancia de la persistencia
import {
    productosDao as productsApi,
    //carritosDao as cartApi
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
    cartApi.readAll()
    .then(carts => {
        console.log(carts);
        res.json(carts)
    })
})
//--------------------------------------------
// configuro el servidor

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
//carpeta estatica
app.use(express.static('../public'));

app.use('/api/productos', routerProducts)
app.use('/api/carritos', routerCart)

//Servicios Productos
// routerProducts.get('/', (req, res) => {
//     listaProductos = productsApi.getAll();
//     listaProductos.then( value => {
//         if(value === null){
//             res.json({ error : 'No hay productos disponibles' });
//         } else {
//             res.json({value});
//         }
//     });

// });

// routerProducts.get('/:id', (req, res) => {
//     let unProd = productsApi.getById(req.params.id);
//     unProd.then( value => {
//         if(value === null){
//             res.json({ error : 'producto no encontrado' });
//         } else {
//             res.json({value});
//         }
//     });

// });




// //elimina un producto
// routerProducts.delete('/:id', soloAdmins, (req, res) => {
//     const idProd = req.params.id;
//     let id = productsApi.deleteById(idProd);
//     res.json({id: idProd});
// });


// //Servicios Carrito
// //obtiene todos los carritos
// routerCart.get('/', (req, res) => {
//     listaCarritos = cartApi.getAll();
//     listaCarritos.then( value => {
//         if(value === null){
//             res.json({ error : 'No hay productos disponibles' });
//         } else {
//             res.json({value});
//         }
//     });

// });

// routerCart.get('/:id', (req, res) => {
//     let unProd = cartApi.getById(req.params.id);
//     unProd.then( value => {
//         if(value === null){
//             res.json({ error : 'producto no encontrado' });
//         } else {
//             res.json({value});
//         }
//     });

// });

// //obtiene los productos del carrito
// routerCart.get('/:id/productos', (req, res) => {
//     let unProd = cartApi.getById(req.params.id);
//     unProd.then( value => {
//         if(value === null){
//             res.json({ error : 'producto no encontrado' });
//         } else {
//             res.json({value});
//         }
//     });

// });

// //agrega un carrito
// routerCart.post('/', (req, res) => {
//     let id = cartApi.save(req.body);
//     res.json({ id });
    
// });

// //agrega un producto al carrito
// routerCart.post('/:id/productos', (req, res) => {   
//     let unProd = productsApi.getById(req.body.id);

//     unProd.then( value => {   
//         let unCarrito = cartApi.getById(req.params.id);

//         unCarrito.then( valueCarrito => { 
//             if (valueCarrito.productos === undefined) {
//                 valueCarrito.productos = [];  
//             }           
//             valueCarrito.productos.push(value);
            
//             valueCarrito = cartApi.updateById(req.params.id, valueCarrito);
//             valueCarrito.then( value2Carrito => {
//                 if(value2Carrito === null){
//                     res.json({ error : 'producto no encontrado' });
//                 } else {
//                     res.json({value2Carrito});
//                 }
//             });
//         });
//     });    
// });

// //elimina un carrito
// routerCart.delete('/:id', (req, res) => {
//     const idProd = req.params.id;
//     let id = cartApi.deleteById(req.params.id);
//     res.json({id: idProd});
// });

// //elimina un producto del carrito
// routerCart.delete('/:id/productos/:idP', (req, res) => {
//     const idProd = req.params.id;
//     let id = cartApi.deleteObjectById(req.params.id,req.params.idP);
//     res.json({id: idProd});
// });





//export del modulo
export default app