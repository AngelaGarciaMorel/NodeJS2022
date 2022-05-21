import mongoose from 'mongoose'
import config from '../config.js'
import model from '';

class ContenedorMongoDb {

    constructor(model){
        this.model = model;
        await mongoose.connect(config.mongodb.URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    }

    //insert
    insert(object){
        return await this.model.save(object);
    }
    //get all
    readAll(){
        return await this.model.find({});
    }
    // deletebyid

    //updateby id
    updateById(object, id){
        const updates = {};
        for (let i = 0; i < object.length; i++) {
            updates[object[i]] = Object.values(object)[i];
        }

        return await this.model.updateOne({id:id}, {$set: updates})
    }

}

export default ContenedorMongoDb