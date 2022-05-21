import mongoose from 'mongoose'
import config from '../config.js'
//import model from '';

class ContenedorMongoDb {

    constructor(table, eschema){
        this.schema = new mongoose.Schema(eschema)

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
        return this.model.findById(id);
    }    
    // deletebyid

    //updateby id
    updateById(id, object){
        console.log('id: ' + id)

        const updates = {};
        for (let i = 0; i < Object.keys(object).length; i++) {
            console.log('object param: ' + JSON.stringify(Object.keys(object)[i]))
            updates[Object.keys(object)[i]] = Object.values(object)[i];
            console.log('updates: ' + JSON.stringify(updates))
        }

        //return this.model.updateOne({_id:id}, {$set: updates})
        return this.model.findOneAndUpdate({_id:id}, updates)
    }

}

export default ContenedorMongoDb