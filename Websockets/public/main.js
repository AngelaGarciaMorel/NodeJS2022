const socket = io.connect();

//Productos
function render(products) {
    let templateText = `<table class="table table-dark table-striped">
        <thead>
            <tr>
            <th scope="col">Nombre</th>
            <th scope="col">Precio</th>
            <th scope="col">Foto</th>
            </tr>
        </thead>
        <tbody>
            {{#each array}}
            <tr>
                <td>{{this.title}}</td>
                <td>{{this.price}}</td>
                <td><img src="{{this.thumbnail}}" style="height: 50px; width:50px"></td>
            </tr>
            {{/each}}
        </tbody>
    </table>`

    // Compile the Handlebars template.
    let tableTemplate = Handlebars.compile(templateText);

    // Add the compiled html to the page
    document.getElementById('productos').innerHTML = tableTemplate({ array: products });
 }

function addProduct(e) {
    const product = {
        title: document.getElementById("title").value,
        price: document.getElementById("price").value,
        thumbnail: document.getElementById("thumbnail").value
    };
    socket.emit('new-product', product);
    return false;//para que la pagina no se recargue
}

socket.on('products', data => {
    render(data);
});


//mensajes
function renderM(messages) {
    if(messages != null){
        const html = messages.map((message, index) => {
            return (`<div><strong style="color: blue;">${message.author}</strong>:<em style="color: brown;">${message.date}</em>:<em style=" font-style: italic; color: green;">${message.text}</em>
                    </div>`)
        }).join(" ");
        document.getElementById('messages').innerHTML = html;
    }

}

function addMessage(e) {
    const message = {
        author: document.getElementById("username").value,
        date: new Date().toLocaleString(),
        text: document.getElementById("text").value
    };
    socket.emit('new-message', message);
    return false;//para que la pagina no se recargue????
}

socket.on('messages', data => {
    renderM(data);
});