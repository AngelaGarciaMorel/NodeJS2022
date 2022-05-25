import ContenedorFirebase from "../../contenedores/ContenedorFirebase.js"
import { cartCollection } from '../../model/cart.js';
import { productCollection } from '../../model/product.js';

class CarritosDaoFirebase extends ContenedorFirebase {
    constructor() {
        super('carritos');
    }

    async getAll(){
        const products = super.getAll() 
            return products
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
    async deleteChildById(idCart,product){
        return super.deleteChildById(idCart,productCollection,product.id)
    }
}

export default CarritosDaoFirebase