import { json } from "stream/consumers";
import { resourceLimits } from "worker_threads";
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
                    return 'producto no encontrado';
                } else {
                    return value2Carrito;
                }
            });
        });
    }

    deleteProductFromCart(idCart,idProduct){
        super.getById(idCart) 
        .then( cart => {
            for (let index = 0; index < cart.productos.length; index++) {
                
                const hijo = cart.productos[index];

                if(hijo._id == idProduct){
                    cart.productos.splice(index,1); 
                }
            }               
            super.updateById(idCart, cart)
            .then(result => {
                if(result === null){
                    return 'producto no encontrado';
                } else {
                    return result;
                }
            })    
        });
           
    }
}

export default CarritosDaoMongoDb