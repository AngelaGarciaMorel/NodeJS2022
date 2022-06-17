export default {
    mongoAtlas: {
        URL: ''
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
