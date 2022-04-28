
class Contenedor {
    constructor(nombreArchivo){
        this.nombreArchivo = nombreArchivo;
    }

    async save(objeto){
        try {
            //generador id
            const fs = require('fs');
            let id = 0;
            let info = [];
            const contenido = await fs.promises.readFile(this.nombreArchivo,'utf-8');
             if(contenido.length > 0){
                info =  JSON.parse(contenido);

                for (let index = 0; index < info.length; index++) {
                    if(id < info[index].id){
                        id = info[index].id;
                    }
                }
             }
            objeto.id = ++id;
            objeto.timestamp = Date.now();
            info.push(objeto);
            await fs.promises.writeFile(this.nombreArchivo,JSON.stringify(info,null,2));
            return objeto.id;
        } catch (error) {
            console.log (error) ;     
        }
        
    }
    async updateById(id, objeto) {
        try {
            objeto.id = id;
            const fs = require('fs');
            const contenido = await fs.promises.readFile(this.nombreArchivo,'utf-8');
            
            if(contenido.length > 0){
                const info = JSON.parse(contenido);             
                for (let index = 0; index < info.length; index++) {
                    let element = info[index];
                    if(element.id == objeto.id) {                       
                        info.splice(index,1,objeto)
                    }
                }
                await fs.promises.writeFile(this.nombreArchivo,JSON.stringify(info,null,2));
                return objeto;
            }
            return null;
        } catch (error) {
            console.log (error) ;           
        }
    }
    async getById(idObjeto) {
        try {
            const fs = require('fs');
            const contenido = await fs.promises.readFile(this.nombreArchivo,'utf-8');

            if(contenido.length > 0){
                const info = JSON.parse(contenido);
                
                const objetoDelId = new Object;
                info.forEach(element => {
                    if(element.id == idObjeto)
                        Object.assign(objetoDelId,element);
                });

                return objetoDelId;
            }
            return null;
        } catch (error) {
            console.log (error) ;           
        }
    }

    async getAll() {
        try {
            const fs = require('fs');
            const contenido = await fs.promises.readFile(this.nombreArchivo,'utf-8');
            console.log('longitud: ' + contenido.length);
            if(contenido.length > 0){
                const info = JSON.parse(contenido);
                return info;
            }
            return null;
        } catch (error) {
            console.log (error) ;  
        }
    }

    async deleteById(idObjeto){
        try {
            const fs = require('fs');
            const contenido = await fs.promises.readFile(this.nombreArchivo,'utf-8');
            if(contenido.length > 0){
                let info = JSON.parse(contenido);

                for (let index = 0; index < info.length; index++) {
                    const element = info[index];
                    if(element.id == idObjeto){
                        info.splice(index,1);
                        
                    }
                }
                await fs.promises.writeFile(this.nombreArchivo,JSON.stringify(info,null,2));
            }
        } catch (error) {
            console.log (error) ;

            
        }
    }

    async deleteAll(){
        try {
            const fs = require('fs');
            await fs.promises.writeFile(this.nombreArchivo,'');
        } catch (error) {
            console.log (error) ;  
        }
    }

}

module.exports = {Contenedor};
