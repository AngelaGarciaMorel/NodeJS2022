import config from 'dotenv/config'
export default {
    mongoAtlas: {
        URL: process.env.MONGOATLASURL
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
    PORT: process.env.PORT || 8080,
    TIEMPOEXPIRACION: process.env.TIEMPOEXPIRACION,
    EJECSERVER: process.env.EJECSERVER || FORK
}
