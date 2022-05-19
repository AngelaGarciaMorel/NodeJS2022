const knewLib = require('knex');
import { asPOJO } from '../utils/objectUtils.js'

class ContenedorSQL {

    constructor(config, table){
        this.knex = knewLib(config);
        this.table = table;
    }
    insert(object) {
        return this.knex(this.table).insert(object);
    }
    getAll() {
        return this.knex(this.table).select('*');
    }
    deleteById(id) {
        return this.knex.from(this.table).where('id',id).del();
    }
    updateById(product, id) {
        //return this.knex.from(this.table).where('id',id).update({ title: product.title, price: product.price, thumbnail: product.thumbnail})
    }

    close() {
        this.knex.destroy();
    }
}

export default ContenedorSQL
