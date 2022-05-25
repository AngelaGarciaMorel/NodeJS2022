import { setUncaughtExceptionCaptureCallback } from "process";
import { json } from "stream/consumers";
import { resourceLimits } from "worker_threads";
import ContenedorMongoDb from "../../contenedores/ContenedorMongoDb.js";
import { cartCollection, cartSchema } from '../../model/cart.js';


class CarritosDaoMongoDb extends ContenedorMongoDb {
    constructor() {
        super(cartCollection,cartSchema);
    }
    
    async getAll(){
        return super.getAll() 
    }
    async getById(cart){
        return super.getById(cart);
    }
    async insert(cart){
        super.insert(cart);
    }
    async updateById(idCart, valueCart){
        return super.updateById(idCart, valueCart);
    }
    async deleteById(idCart){
        return super.deleteById(idCart);
    }
}
export default CarritosDaoMongoDb