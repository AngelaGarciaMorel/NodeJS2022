import admin from "firebase-admin"
import config from '../config.js'

class ContenedorFirebase {
    constructor(collectionName){
        const serviceAccount = config.firebase.serviceAccount;
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                databaseURL: config.firebase.databaseURL
              });
        }
        this.db = admin.firestore();
        this.query = this.db.collection(collectionName);
    }

        //CREATE
        async insert(object) {
            try {
               return await  this.query.add(object);

            } catch (error) {
                console.log(error);
            }           
        }

    
        //READ ALL
        async getAll(){
            try {
                const querySnapshot =  await this.query.get();
                let documents = [];
                querySnapshot.forEach(doc => {
                    let newDoc = {};
                    newDoc = doc.data();
                    newDoc.id = doc.id;
                    console.log(newDoc)
                    documents.push(newDoc);
                    return documents;
                });

            } catch (error) {
                console.log(error);
            }
        }


        //READ BY ID
        async getById(id){
            try {
                const doc = this.query.doc(`${id}`);
                return await doc.get();
            } catch (error) {
                console.log(error);
            }           
        }

    
        // UPDATE
        async updateById(id, body){
            try {
                const doc =  this.query.doc(`${id}`);
                return await doc.update(body)

            } catch (error) {
                console.log(error);
            }
        }

    
        // DELETE
        async deleteById(id){
            try {
                const doc =  this.query.doc(`${id}`);
                return await doc.delete();
            } catch (error) {
                console.log(error);
            }
        }

}

export default ContenedorFirebase