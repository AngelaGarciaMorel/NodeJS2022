import mongoose from "mongoose";

export const productCollection = 'productos';

export const productSchema = new mongoose.Schema({
        //_id: { type: Number},
        title: { type: String},
        description: { type: String},
        code: { type: String}, 
        price: { type: Number},
        thumbnail: { type: String},
        stock: { type: Number},
        timestamp: { type: Date}
});
