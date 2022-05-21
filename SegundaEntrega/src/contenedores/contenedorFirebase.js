import admin from "firebase-admin"
import config from '../config.js'

class ContenedorFirebase {
    constructor(collectionName){
        this.model = model;
        const serviceAccount = config.firebase.serviceAccount;

        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          databaseURL: config.firebase.databaseURL
        });
        this.db = admin.firestore();
        this.query = db.collection(collectionName);
    }

        //CREATE
        insert(object) {
            try {
               return await query.add(object);

            } catch (error) {
                console.log(error);
            }           
        }

    
        //READ ALL
        readAll(){
            try {
                const querySnapshot = await query.get();
                return querySnapshot.docs;
            } catch (error) {
                console.log(error);
            }
        }


        //READ BY ID
        readById(id){
            try {
                const doc = query.doc(`${id}`);
                return await doc.get();
            } catch (error) {
                console.log(error);
            }           
        }

    
        // UPDATE
        updateById(id){
            try {
                const doc = query.doc(`${id}`);
                return await doc.update({dni: 123})

            } catch (error) {
                console.log(error);
            }
        }

    
        // DELETE
        deleteById(id){
            try {
                const doc = query.doc(`${id}`);
                return await doc.delete();
            } catch (error) {
                console.log(error);
            }
        }

}

export default ContenedorFirebase