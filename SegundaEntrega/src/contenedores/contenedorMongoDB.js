import mongoose from 'mongoose'
import config from '../config.js'
//import model from '';

class ContenedorMongoDb {

    constructor(table, schema){
        this.schema = new mongoose.Schema(schema)

        this.model = mongoose.model(table,this.schema);
        mongoose.connect(config.mongodb.URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    }

    //insert
    async insert(object){
        try {
            const savedObject = new this.model(object);
            return await savedObject.save(object);           
        } catch (error) {
            console.log(error);
        }

    }

    //get all
    async getAll(){
        try {
            return await this.model.find({});
        } catch (error) {
            console.log(error);
        }
        
    }
    //get by id
    async getById(id){
        try {
            return await this.model.findById(id);  
        } catch (error) {
            console.log(error);
        }
        
    }    
    // deletebyid
    async deleteById(id){
        try {
            return await this.model.deleteOne({_id:id})
        } catch (error) {
            console.log(error);
        }
        
    }
    //updateby id
    async updateById(id, object){
        try {
            return await this.model.findOneAndUpdate({_id:id}, object)
        } catch (error) {
            console.log(error);
        }
        
    }
}

export default ContenedorMongoDb