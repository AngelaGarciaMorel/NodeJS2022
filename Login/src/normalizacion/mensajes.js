import { normalize, schema, } from 'normalizr'

// Definimos un esquema de autor
const authorSchema = new schema.Entity('author', {}, {idAttribute:'email'})

// Definimos un esquema de mensaje
const messageSchema = new schema.Entity('message',{author: authorSchema})

// Definimos un esquema de posts
const normalizarMensajes = new schema.Entity('posts', {
    //author: authorSchema,
    messages: [messageSchema]
})

export { normalizarMensajes }