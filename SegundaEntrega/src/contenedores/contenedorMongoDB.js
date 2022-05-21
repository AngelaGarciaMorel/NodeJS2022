import mongoose from 'mongoose'
import config from '../config.js'
//import model from '';

class ContenedorMongoDb {

    constructor(table, eschema){
        this.schema = new mongoose.Schema(eschema)
        console.log('table: ' + table)
        console.log('eschema: ' + JSON.stringify(eschema))
        this.model = mongoose.model(table,this.schema);
        mongoose.connect(config.mongodb.URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    }

    //insert
    // insert(object){

    //     return this.model.save(object);
    // }
    
    //get all
    readAll(){
        return this.model.find({});
    }
    //get by id
    readById(id){
        return this.model.findById(1);
    }    
    // deletebyid

    //updateby id
    // updateById(object, id){
    //     const updates = {};
    //     for (let i = 0; i < object.length; i++) {
    //         updates[object[i]] = Object.values(object)[i];
    //     }

    //     return this.model.updateOne({id:id}, {$set: updates})
    // }

}

export default ContenedorMongoDb