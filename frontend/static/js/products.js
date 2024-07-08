async function printProducts(products) {
    let container = document.querySelector('.product-container');
    container.innerHTML = '';
    let carritoId = localStorage.getItem('carrito_id');
    let carrito = null;
    if (carritoId) {
        carrito = await fetch(`/api/carritos/${carritoId}`)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error('Error al obtener carrito:', data.error);
                    carrito = null;
                    return;
                }

                return data.carrito;
            })
            .catch(error => {
                console.error('Error al obtener carrito:', error);
            })
    }
    for (const prod of products) {
        let precio = parseFloat(prod.precio).toLocaleString("es-ES", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        let btnCarrito = ``;
        if (carrito) {
            let cardBody = document.querySelector('.card-body');
            for (const item of carrito.items) {
                console.log(item.producto_id, prod.nombre, prod.id);
                if (item.producto_id === prod.id) {
                    btnCarrito += `
                    <a href="#" class="text-reset me-3 position-absolute cart-button-products" onclick="goToCart()">
                        <span class="badge bg-primary position-absolute top-0 start-100 translate-middle"
                            id="cantidad_carrito">${item.cantidad}</span>
                        <i class="fas fa-shopping-cart carrito producto"></i>
                    </a>
                `
                    break;
                }
            }
        }
        const productCard = `
            <div class="col-12 product-card">
                <div class="card">
                    <div class="row g-0 data_prod">
                        <div class="col-md-4 img_cont">
                            <a href='/producto?id=${prod.id}'>
                                <img src=${prod.imagen} class="img-fluid rounded-start card-img"
                                    alt=${prod.imagen}>
                            </a>
                        </div>
                        <div class="col-md-8 card-body d-flex flex-column">
                            <div class="card-title">
                                <a href='/producto?id=${prod.id}' class="titulo_prod">${prod.nombre}</a>
                            </div>
                            <span class="precio_prod">$ ${precio}</span>
                            ${prod.stock > 0 ?
                `<button href="#" class="btn btn-primary mt-auto" id="agregar_car" onclick="addItemToCart(${prod.id}, 1)">Agregar al carrito</button>`
                : `<button href="#" class="btn btn-primary mt-auto" id="agregar_car"  disabled>Sin stock</button>`
            }
                            ${btnCarrito}
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
                    let products = data.productos
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
                container.innerHTML = `<h3 > No hay mas productos de ese tipo :(</h3> `;
            } else {
                let products = data.productos
                printProducts(products);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}