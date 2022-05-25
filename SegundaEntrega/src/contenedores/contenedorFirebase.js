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
                return querySnapshot.docs.map(doc => doc.data());
            } catch (error) {
                console.log(error);
            }
        }


        //READ BY ID
        async getById(id){
            try {
                const doc = this.query.doc(`${id}`);
                const item = await doc.get()
                return item.data()
            } catch (error) {
                console.log(error);
            }           
        }

    
        // UPDATE
        async updateById(id, body){
            try {
                const doc = this.query.doc(`${id}`);
                return await doc.update(body)
            } catch (error) {
                console.log(error);
            }
        }
        // Delete child
        async deleteChildById(id, childCollection, idChild){
            try {
                // define document location (Collection Name > Document Name > Collection Name >)
                let docRef = this.query.doc(`${id}`).collection(childCollection);
                // delete the document
                return docRef.doc(idChild).delete();

                // const doc =  this.query.doc(`${id}`).update({body});
                // const ret =  await doc.update(body)
                
                // return ret      
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