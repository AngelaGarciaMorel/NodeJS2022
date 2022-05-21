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
    insert(object){
        const savedObject = new this.model(object);
        return savedObject.save(object);
    }

    //get all
    getAll(){
        return this.model.find({});
    }
    //get by id
    getById(id){
        return this.model.findById(id);
    }    
    // deletebyid
    deleteById(id){
        return this.model.deleteOne({_id:id})
    }
    //updateby id
    updateById(id, object){
        return this.model.findOneAndUpdate({_id:id}, object)
    }

}

export default ContenedorMongoDb