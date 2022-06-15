export default {
    mongoAtlas: {
        URL: 'mongodb+srv://angie:Angie1989@cluster0.u2jio.mongodb.net/ecommerce?retryWrites=true&w=majority'
    },
    sqlite3: {
        client: 'sqlite3',
        connection: {
            filename: `./DB/ecommerce.sqlite`
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
    },
    fileSystem: {
        path: './DB'
    },
    PORT: 8080,
    TIEMPO_EXPIRACION:60000
}