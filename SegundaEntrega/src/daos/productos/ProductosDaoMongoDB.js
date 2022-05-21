import ContenedorMongoDb from "../../contenedores/contenedorMongoDB.js"

class ProductosDaoMongoDb extends ContenedorMongoDb {

    constructor() {
        const productSchema = {
            _id: { type: Number, required: true },
            title: { type: String, required: true },
            description: { type: String, required: true},
            code: { type: String, required: true }, 
            price: { type: Number, required: true },
            thumbnail: { type: String, required: true },
            stock: { type: Number, required: true },
            timestamp: { type: Date, required: true }
        };

        super('productos', productSchema);
    }


}

export default ProductosDaoMongoDb