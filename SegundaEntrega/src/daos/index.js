let productosDao
let carritosDao
process.env.PERS = 'mongodb';
//process.env.PERS = 'firebase';

console.log('process.env.PERS: ' +process.env.PERS)

switch (process.env.PERS) {
    case 'json':
        const { default: ProductosDaoArchivo } = await import('./productos/ProductosDaoArchivo.js')
        const { default: CarritosDaoArchivo } = await import('./carritos/CarritosDaoArchivo.js')

        productosDao = new ProductosDaoArchivo()
        carritosDao = new CarritosDaoArchivo()
        break
    case 'firebase':
        const { default: ProductosDaoFirebase } = await import('./productos/ProductosDaoFirebase.js')
        const { default: CarritosDaoFirebase } = await import('./carritos/CarritosDaoFirebase.js')

        productosDao = new ProductosDaoFirebase()
        carritosDao = new CarritosDaoFirebase()
        break        
    case 'mongodb':
        const { default: ProductosDaoMongoDB } = await import('./productos/ProductosDaoMongoDB.js')
        const { default: CarritosDaoMongoDB } = await import('./carritos/CarritosDaoMongoDB.js')

        productosDao = new ProductosDaoMongoDB()
        //carritosDao = new CarritosDaoMongoDB()
        console.log('Hola: ' + productosDao);
        break        
    case 'mariadb':
        const { default: ProductosDaoMariaDB } = await import('./productos/ProductosDaoMariaDB.js')
        const { default: CarritosDaoMariaDB } = await import('./carritos/CarritosDaoMariaDB.js')

        productosDao = new ProductosDaoMariaDB()
        carritosDao = new CarritosDaoMariaDB()
        break        
    case 'sqlite3':
        const { default: ProductosDaoSQLite3 } = await import('./productos/ProductosDaoSQLite3.js')
        const { default: CarritosDaoSQLite3 } = await import('./carritos/CarritosDaoSQLite3.js')

        productosDao = new ProductosDaoSQLite3()
        carritosDao = new CarritosDaoSQLite3()
        break       
    default:
        
        break
}

export { productosDao, carritosDao }