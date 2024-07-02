
function printProducts(products) {
    let container = document.querySelector('.product-container');
    container.innerHTML = '';
    for (const prod of products) {
        let precio = parseFloat(prod.precio).toLocaleString("es-ES", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        const productCard = `
            <div class="col-12 product-card">
                <div class="card">
                    <div class="row g-0">
                        <div class="col-md-4">
                            <img src=${prod.imagen} class="img-fluid rounded-start card-img"
                                alt=${prod.imagen}>
                        </div>
                        <div class="col-md-8 card-body d-flex flex-column">
                            <div class="card-title">
                                <a href='/producto?id=${prod.id}' class="titulo_prod">${prod.nombre}</a>
                            </div>
                            <p class="card-text">${prod.descripcion}</p>
                            <span class="precio_prod">$ ${precio}</span>
                            <a href="#" class="btn btn-primary mt-auto" id="agregar_car">Agregar al carrito</a>
                        </div>
                    </div>
                </div>
            </div>
        `
        container.innerHTML += productCard;
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

function filtrarProductos(tipo) {
    fetch(`/api/productos/tipo/${tipo}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                let container = document.querySelector('.product-container');
                container.innerHTML = `<h3>No hay mas productos de ese tipo :(</h3>`;
            } else {
                var products = data.productos
                printProducts(products);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}