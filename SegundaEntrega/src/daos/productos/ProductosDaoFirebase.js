import ContenedorFirebase from "../../contenedores/ContenedorFirebase.js"
import { productCollection } from '../../model/product.js';

class ProductosDaoFirebase extends ContenedorFirebase {
    constructor() {
        super(productCollection);
    }
    async getAll(){
        return await super.getAll() 
    }
    async getById(product){
        return super.getById(product);
    }
    async insert(product){
        return super.insert(product);
    }
    async updateById(idProduct, valueProduct){
        return super.updateById(idProduct, valueProduct);
    }
    async deleteById(idProduct){
        return super.deleteById(idProduct);
    }
}

export default ProductosDaoFirebase