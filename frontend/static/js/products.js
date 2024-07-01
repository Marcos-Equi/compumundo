
function printProducts(products) {
    let container = document.querySelector('.product-container');
    for (const prod of products) {
        const productCard = `
            <div class="col-12 product-card">
                <div class="card">
                    <div class="row g-0">
                        <div class="col-md-4">
                            <img src=${prod.imagen} class="img-fluid rounded-start card-img"
                                alt=${prod.imagen}>
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <h5 class="card-title">${prod.nombre}</h5>
                                <p class="card-text">${prod.descripcion}</p>
                                <a href="#" class="btn btn-primary">Agregar al carrito</a>
                            </div>
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