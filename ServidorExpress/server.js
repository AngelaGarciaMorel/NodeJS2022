const { response } = require('express');
//import response from 'express';
const express = require('express');
//import express from 'express';
let app = express();

const  pkg  = require('./Contenedor.cjs');
//import pkg from './Contenedor.cjs';
const {Contenedor} = pkg;

const file = new Contenedor('productos.txt');

//respuesta, servicio 1
app.get('/', (req,res) => {
    res.send('<h1 style= "color: blue">Bienvenidos al servidor</h1>');
});

//respuesta, servicio: obtener todos los productos
app.get('/productos', (req,res) => {

    const productos = file.getAll();
     productos.then( value => {
         res.send(value);
      });
 });

//respuesta, servicio producto random
app.get('/producto', (req,res) => {
   const min = 1;
   const max = 3;
   const numRandom = Math.round(Math.random() * (max - min) + min);

   const producto = file.getById(numRandom);
    producto.then( value => {
      res.send(value);
    });

});


const server = app.listen(8080, () => {
    console.log('servidor http en el puerto 8080');
})
server.on('error',error =>`error en el servidor ${error}`);