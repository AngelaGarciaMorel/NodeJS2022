import mongoose from "mongoose";

export const cartCollection = 'carritos';

export const cartSchema = new mongoose.Schema({
            //_id: { type: Number},
            timestamp: { type: Date},
            productos: [ 
                        {   title: { type: String},
                            description: { type: String},
                            code: { type: String}, 
                            price: { type: Number},
                            thumbnail: { type: String},
                            stock: { type: Number},
                            timestamp: { type: Date}
                        } 
                        ] 
});

//export const carts = mongoose.model(cartCollection, cartSchema);