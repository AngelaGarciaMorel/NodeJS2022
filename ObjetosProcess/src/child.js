let contador = 0

process.on('message',msg => {
    console.log('Mensaje del padre: ', msg)
    setInterval(() => {
        console.log('contador: ' + contador++)
    },1000)
})
