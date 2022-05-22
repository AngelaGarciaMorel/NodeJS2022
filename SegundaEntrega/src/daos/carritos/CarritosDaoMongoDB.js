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

    deleteProductFromCart(idCart,idProduct){
        super.getById(idCart) 
        .then( cart => {
            console.log('cart.productos.length: '+ cart.productos.length)
            for (let index = 0; index < cart.productos.length; index++) {
                
                const hijo = cart.productos[index];

                if(hijo._id == idProduct){
                    cart.productos.splice(index,1); 
                    console.log('cart inside: '+ JSON.stringify(cart))
                }
            }  
            console.log('id: '+ idCart)
            console.log('cart: '+ JSON.stringify(cart))                
            super.updateById(idCart, cart)
            .then(result => {
                console.log('result: '+ result)
            })    
        });
           
    }
}

export default CarritosDaoMongoDb