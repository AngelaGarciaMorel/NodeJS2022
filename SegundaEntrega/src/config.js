export default {
    fileSystem: {
        
    },
    mongodb: {
        URL: 'mongodb://localhost:27017/ecommerce'       
    },
    firebase: {
        serviceAccount: require("./db/ecommerce-7c1fd-firebase-adminsdk-d986t-7d7bdf86c1.json"),
        credential: admin.credential.cert(serviceAccount),
        databaseURL: 'https://ecommerce-7c1fd.firebaseio.com'       
    },
    sqlite3: {
        client: 'sqlite3',
        connection: {
            filename: "./DB/ecommerce.sqlite"
        },
        useNullAsDefault: true
    },
    mariaDb: {
        client: 'mysql',
        connection: {
            host: '127.0.0.1',
            user: 'root',
            password: '',
            database:'ecommerce'
        }        
    }
}