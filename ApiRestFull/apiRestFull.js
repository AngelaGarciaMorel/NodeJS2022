const express = require('express')
const { Router } = express;
const app = express();

const PORT = 8080;

//Router Productos
const routerProducts = new Router();
routerProducts.use(express.json());
routerProducts.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.use('/api/productos', routerProducts);

//lista de productos
const listaProductos = [];

//Servicios
routerProducts.get('/', (req, res) => {
    res.json({listaProductos});
});

routerProducts.get('/:id', (req, res) => {
    const idProd = req.params.id;
    let unProd = new Object;
    let findProd = 0;
    listaProductos.forEach(p => {
        if(p.id == idProd){
            Object.assign(unProd,p);
            findProd = 1;
        }
    });
    if(findProd == 1){
    res.json({unProd});
    } else{
        res.json({ error : 'producto no encontrado' });
    }
});

routerProducts.post('/', (req, res) => {
    let product = req.body;
    let newId = 0;

    for (let index = 0; index < listaProductos.length; index++) {
        if(newId < listaProductos[index].id){
            newId = listaProductos[index].id;
        }
    }
    newId = newId +1;
    product.id = newId;

    listaProductos.push(product);
    res.json({ product });
    
});

routerProducts.put('/:id', (req, res) => {
    const idProd = req.params.id;
    const prodUpdate = req.body;
    let findProd = 0;

    listaProductos.forEach(p => {
        if(p.id == idProd){
            Object.assign(p,prodUpdate);
            findProd = 1;
        }
    });
    if(findProd == 1){
        res.json({id: idProd});
    } else{
        res.json({ error : 'producto no encontrado' });
    }

});

routerProducts.delete('/:id', (req, res) => {
    const idProd = req.params.id;
    for (let index = 0; index < listaProductos.length; index++) {
        const element = listaProductos[index];
        if(element.id == idProd){
            listaProductos.splice(index,1);
        }
    }
    res.json({id: idProd});
});

const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${server.address().port}`)
})
server.on('error', error => console.log(`Error en servidor ${error}`))