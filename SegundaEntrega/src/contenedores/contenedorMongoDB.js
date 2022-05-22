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
        console.log('object: ' + JSON.stringify(object))
        return this.model.findOneAndUpdate({_id:id}, object)
    }
    // // deleteChildbyid
    // deleteChildById(idParent,idChild){
    //     this.model.children._id(idParent).remove();
    //     this.model.child.remove();
    //     return this.model.save(function (err) {
    //         if (err) return handleError(err);
    //         console.log('the subdocs were removed');
    //       });
    // }
}

export default ContenedorMongoDb