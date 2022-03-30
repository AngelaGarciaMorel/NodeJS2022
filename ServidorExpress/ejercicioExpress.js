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

app.get('/productos', (req,res) => {

    const productos = file.getAll();
 
 productos.then( value => {
     //console.log(value);
     res.send(value);
  });
 });

//respuesta, servicio 2
let visitas = 0;
app.get('/visitas', (req,res) => {
    res.send(`la cantidad de visitas es ${++visitas}`);
});

//respuesta, servicio 3
app.get('/fyh', (req,res) => {
    res.send({fyh: new Date().toLocaleString()});
});

const server = app.listen(8080, () => {
    console.log('servidor http en el puerto 8080');
})
server.on('error',error =>`error en el servidor ${error}`);