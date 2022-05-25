import ContenedorMongoDb from "../../contenedores/contenedorMongoDB.js"
import { productCollection, productSchema } from '../../model/product.js';

class ProductosDaoMongoDb extends ContenedorMongoDb {

    constructor() {
        super(productCollection, productSchema);
    }

    async getAll(){
        return super.getAll() 
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

export default ProductosDaoMongoDb