import ContenedorMongoDb from "../../contenedores/contenedorMongoDB.js"

class ProductosDaoMongoDb extends ContenedorMongoDb {

    constructor() {
        const productSchema = {
            //_id: { type: Number},
            title: { type: String, required: true },
            description: { type: String},
            code: { type: String}, 
            price: { type: Number, required: true },
            thumbnail: { type: String, required: true },
            stock: { type: Number, required: true },
            timestamp: { type: Date}
        };

        super('productos', productSchema);
    }
}

export default ProductosDaoMongoDb