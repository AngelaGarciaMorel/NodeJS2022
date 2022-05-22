import { json } from "stream/consumers";
import ContenedorMongoDb from "../../contenedores/ContenedorMongoDb.js";
import { cartCollection, cartSchema } from '../../model/cart.js';


class CarritosDaoMongoDb extends ContenedorMongoDb {
    constructor() {
        super(cartCollection,cartSchema);
    }

    addProductsinCart(idCart, product){ 
        super.getById(idCart) 
        .then( valueCarrito => { 
            if (valueCarrito.productos === undefined) {
                valueCarrito.productos = [];  
            }           
            valueCarrito.productos.push(product);

            super.updateById(idCart, valueCarrito)
            .then( value2Carrito => {
                if(value2Carrito === null){
                    return('producto no encontrado');
                } else {
                    return(value2Carrito);
                }
            });
        });
    }
}

export default CarritosDaoMongoDb