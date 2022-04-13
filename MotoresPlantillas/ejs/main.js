const express = require('express')
const { Router } = express;
//const handleBars = require('express-handlebars');

const app = express();

const PORT = 8080;


app.set('view engine', 'ejs');
//app.set('views','./views');


 app.use(express.json());
 app.use(express.urlencoded({ extended: true }));




//lista de productos
const listaProductos = [];

//Servicios
app.get('/', (req, res) => {
    res.render('cargaProductos');
});

app.get('/productos', (req, res) => {
    let tieneDatos = false;
    if (listaProductos.length > 0) {
        tieneDatos = true;
    }
    res.render('listaProductos', {productos: listaProductos, tieneDatos: tieneDatos});
});



app.post('/productos', (req, res) => {
    let product = req.body;
    let newId = 0;

    for (let index = 0; index < listaProductos.length; index++) {
        if(newId < listaProductos[index].id){
            newId = listaProductos[index].id;
        }
    }
    newId = newId +1;
    console.log(product);
    product.id = newId;

    listaProductos.push(product);
    console.log(listaProductos);
    res.render('cargaProductos');
    
});

const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${server.address().port}`)
})
server.on('error', error => console.log(`Error en servidor ${error}`))