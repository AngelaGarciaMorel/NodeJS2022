import express from 'express'
const { Router } = express

//instancia del servidor
const app = express();

//intancia de la persistencia
import {
    productosDao as productsApi,
    carritosDao as cartApi
} from './daos/index.js'

//import verificacion acceso
import { esAdmin, crearErrorNoEsAdmin, soloAdmins } from './middleware/access.js'

//Router Productos
const routerProducts = new Router();

//obtener todos los productos 
routerProducts.get('/', async (req, res) => {
    productsApi.getAll()
    .then(products => {
        res.json(products)
    })

})
//obtener un producto
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
        res.json({product: product });
    })    
});

//modifica un producto
routerProducts.put('/:id', soloAdmins, (req, res) => {

    productsApi.updateById(req.params.id, req.body)
    .then( value => {    
        if(value === null){
            res.json({ error : 'producto no encontrado' });
        } else {
            res.json({Valor_anterior: value});
        }
    });
});
//elimina un producto
routerProducts.delete('/:id', soloAdmins, (req, res) => {
    const idProd = req.params.id;
    productsApi.deleteById(idProd)
    .then(Prod => {
        res.json({id: Prod});
    })

});

// //Router Carrito    
const routerCart = new Router();
routerCart.get('/', async (req, res) => {
    cartApi.getAll()
    .then(carts => {
        res.json(carts)
    })
})

// //agrega un carrito
routerCart.post('/', (req, res) => {
    let id = cartApi.insert(req.body);
    res.json({ id });
    
});


//obtiene los productos del carrito
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

//agrega un producto al carrito
routerCart.post('/:id/productos/', (req, res) => { 
    productsApi.getById(req.body._id)
    .then( product => { 
        cartApi.getById(req.params.id) 
        .then( valueCarrito => { 
            //console.log('valueCarrito: '+ valueCarrito)
            if (valueCarrito.productos === undefined) {
                valueCarrito.productos = [];  
            } 
            product._id = req.body._id                
            valueCarrito.productos.push(product);
            cartApi.updateById(req.params.id, valueCarrito)
            .then( value2Carrito => {
                if(value2Carrito === null){
                    res.json({ error : 'producto no encontrado' });
                } else {
                    res.json({ value2Carrito });
                }
            });
        });
    })
       
});

//elimina un carrito
routerCart.delete('/:id', (req, res) => {
    cartApi.deleteById(req.params.id)
    .then(id => {
        res.json({id: id});
    })
});

//elimina un producto del carrito
routerCart.delete('/:id/productos/:idP', (req, res) => {
    const idProd = req.params.idP;
    cartApi.getById(req.params.id) 
    .then( cart => {
        for (let index = 0; index < cart.productos.length; index++) {
            const hijo = cart.productos[index];
  
            if(hijo._id == idProd){
                cart.productos.splice(index,1); 
            }
        }  
                  
        cartApi.updateById(req.params.id, cart)
        .then(result => {
            if(result === null){
                res.json({error: 'producto no encontrado'});
            } else {
                res.json({ result });
            }
        })    
    });


});

//--------------------------------------------
// configuro el servidor

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
//carpeta estatica
app.use(express.static('../public'));

app.use('/api/productos', routerProducts)
app.use('/api/carritos', routerCart)


//export del modulo
export default app