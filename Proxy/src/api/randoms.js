import { Router } from 'express'
import { fork } from 'child_process'
import path from 'path';
const __dirname = path.resolve();

const forked = fork('./api/child.js')

const randomRouter = new Router()

randomRouter.get('/info', (req,res) => {
    let respuesta = {}
    respuesta.Argumentos_Entrada = config.PORT + ", " + config.TIEMPOEXPIRACION
    respuesta.SO = process.platform
    respuesta.NodeVer = process.version
    respuesta.TotMemoria = process.memoryUsage()
    respuesta.Path = process.execPath
    respuesta.pid = process.pid
    respuesta.Dir = process.cwd()
    console.log(respuesta)
    res.json({respuesta});
});


forked.on('message', msg => {
    console.log('Mensaje del hijo', msg)
})


export function calculaRandom(numPosibilidades) {
    let numbers = []
    for (let index = 0; index < numPosibilidades; index++) {
        const element = Math.floor((Math.random() * (1000 - 1 + 1)) + 1)
        numbers.push(element)
    }
    const frequency = numbers.reduce((acc, item) => {
        // This tertiary statement says to add one to whatever 
        // is at acc[item] if it exists, or just set acc[item] to one.
        acc[item] = acc[item] ? acc[item] + 1 : 1;
        return acc;
      }, {});
    return frequency
}

randomRouter.get('/api/randoms', (req,res) => {
    let numPosibilidades = req.query.cant
    console.log('numPosibilidades: ' +numPosibilidades)
    if(numPosibilidades === undefined){
        numPosibilidades = 100000000
    }
    console.log('num: ' +numPosibilidades)
    res.json(calculaRandom(numPosibilidades))
});

setTimeout(() => {
    forked.send({mensaje: 'Hola'})
})

export default randomRouter