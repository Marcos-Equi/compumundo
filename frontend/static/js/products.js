
function printProducts(products) {
    let container = document.querySelector('.product-container');
    for (const prod of products) {
        let nombre = document.createElement('h1');
        let tipo = document.createElement('p');
        let precio = document.createElement('p');
        let descripcion = document.createElement('p');
        let imagen = document.createElement('img');
        nombre.innerText = prod.nombre;
        tipo.innerText = `Tipo: ${prod.tipo}`;
        precio.innerText = `Precio: ${prod.precio}`;
        descripcion.innerText = `Descripción: ${prod.descripcion}`;
        imagen.src = prod.imagen;
        container.appendChild(nombre)
        container.appendChild(tipo)
        container.appendChild(precio)
        container.appendChild(descripcion)
        container.appendChild(imagen)
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(window.location.search);
    let productName = params.get('nombre');

    if (!productName) {
        fetch('/api/productos')
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error('Error al obtener productos:', data.error);
                    return;
                }
                var products = data.productos;
                printProducts(products);
            })
            .catch(error => {
                console.error('Error al obtener productos:', error);
            });
    }
    else {
        fetch(`/api/productos/nombre/${productName}`)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    document.body.innerHTML = `<p>${data.error}</p>`;
                } else {
                    var products = data.productos
                    printProducts(products);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
});