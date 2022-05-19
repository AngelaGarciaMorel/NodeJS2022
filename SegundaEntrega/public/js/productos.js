const productosApi = {
    get: () => {
        return fetch('/api/productos')
            .then(data => data.json())
    },
    post: (nuevoProd) => {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(nuevoProd)
        }
        return fetch('/api/productos', options)
    },
    put: (idProd, nuevoProd) => {
        const options = {
            method: 'PUT',
            body: JSON.stringify(nuevoProd),
            headers: {
                'Content-Type': 'application/json',
            }
        }
        return fetch(`/api/productos/${idProd}`, options)
    },
    delete: (idProd) => {
        const options = {
            method: 'DELETE'
        }
        return fetch(`/api/productos/${idProd}`, options)
    },
}

//-------------------------------------------------------------------
// productos

actualizarListaProductos()

const formAgregarProducto = document.getElementById('formAgregarProducto')
formAgregarProducto.addEventListener('submit', e => {
    e.preventDefault()
    const producto = leerProductoDelFormulario()
    productosApi.post(producto)
        .then(actualizarListaProductos)
        .then(() => {
            formAgregarProducto.reset()
        })
        .catch((err) => {
            alert(err.message)
        })
})

function leerProductoDelFormulario() {
    const producto = {
        title: formAgregarProducto[0].value,
        description: formAgregarProducto[1].value,
        code: formAgregarProducto[2].value,
        price: formAgregarProducto[3].value,
        thumbnail: formAgregarProducto[4].value,
        stock: formAgregarProducto[5].value
    }
    return producto
}

function actualizarListaProductos() {
    return productosApi.get()
        .then(prods => makeHtmlTable(prods))
        .then(html => {
            document.getElementById('productos').innerHTML = html
        })
}

function borrarProducto(idProd) {
    productosApi.delete(idProd)
        .then(actualizarListaProductos)
        .then(() => {
            formAgregarProducto.reset()
        })
}

function actualizarProducto(idProd) {
    const nuevoProd = leerProductoDelFormulario()
    productosApi.put(idProd, nuevoProd)
        .then(actualizarListaProductos)
        .then(() => {
            formAgregarProducto.reset()
        })
}


function llenarFormulario(title = '', description = '', code= '', price = '', thumbnail = '', stock = '') {
    formAgregarProducto[0].value = title
    formAgregarProducto[1].value = description
    formAgregarProducto[2].value = code
    formAgregarProducto[3].value = price
    formAgregarProducto[4].value = thumbnail
    formAgregarProducto[5].value = stock
}

function makeHtmlTable(productos) {
    
    let html = `
        <style>
            .table td,
            .table th {
                vertical-align: middle;
            }
        </style>`
     
    if (productos.value.length > 0) {
        html += `
        <h2>Lista de Productos</h2>
        <div class="table-responsive">
            <table class="table table-dark">
                <tr>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Foto</th>
                </tr>`
        for (const prod of productos.value) {
            
            html += `
                    <tr>
                    <td><a type="button" onclick="llenarFormulario('${prod.title}', '${prod.code}', '${prod.description}', '${prod.price}','${prod.thumbnail}', '${prod.stock}')" title="copiar a formulario...">${prod.title}</a></td>
                    <td>$${prod.price}</td>
                    <td><img width="50" src=${prod.thumbnail} alt="not found"></td>
                    <td><a type="button" onclick="borrarProducto('${prod.id}')">borrar</a></td>
                    <td><a type="button" onclick="actualizarProducto('${prod.id}')">actualizar</a></td>
                    </tr>`
        }
        html += `
            </table>
        </div >`
    }
    return Promise.resolve(html)
}