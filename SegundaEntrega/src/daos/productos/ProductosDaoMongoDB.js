import ContenedorMongoDb from "../../contenedores/ContenedorMongoDb.js"

class ProductosDaoMongoDb extends ContenedorMongoDb {

    productSchema = new mongoose.Schema({
        id: { type: Number, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true},
        code: { type: String, required: true }, 
        price: { type: Number, required: true },
        thumbnail: { String: Number, required: true },
        stock: { type: Number, required: true },
        timestamp: { type: Date, required: true }
    });

    productDAO = mongoose.model('productos', productSchema);

}

export default ProductosDaoMongoDb