document.addEventListener('DOMContentLoaded', async function () {
    let featuredProductsContainer = document.getElementById('featured-products-container');
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

    await fetch('/api/productos/destacados')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('Error al obtener productos destacados:', data.error);
                return;
            }

            data.productos.forEach(producto => {
                let productDiv = document.createElement('div');
                productDiv.classList.add('featured-product', 'swiper-slide');

                let productImage = document.createElement('img');
                productImage.src = producto.imagen;
                productImage.alt = producto.nombre;
                productImage.addEventListener('click', function () {
                    window.location.href = `/producto?id=${producto.id}`;
                });
                productDiv.appendChild(productImage);

                let productName = document.createElement('h4');
                productName.textContent = producto.nombre;
                productName.addEventListener('click', function () {
                    window.location.href = `/producto?id=${producto.id}`;
                });
                productDiv.appendChild(productName);

                let productPrice = document.createElement('p');
                let precio = parseFloat(producto.precio).toLocaleString("es-ES", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })
                productPrice.textContent = `$ ${precio}`;
                productPrice.classList.add('precio_prod');
                productDiv.appendChild(productPrice);

                let cardFooter = document.createElement('div');
                cardFooter.classList.add('card-footer', 'd-flex', 'flex-row');
                if (producto.stock > 0)
                    cardFooter.innerHTML = `
                            <button href="#" class="btn btn-primary mt-auto agregar_car" onclick="addItemToCart(${producto.id}, 1)">Agregar al carrito</button>
                    `
                else {
                    cardFooter.innerHTML = `
                            <button href="#" class="btn btn-primary mt-auto agregar_car" disabled>Sin stock</button>
                    `
                }
                if (carrito) {
                    for (const item of carrito.items) {
                        if (item.producto_id === producto.id) {
                            cardFooter.innerHTML += `
                            <a href="#" class="text-reset me-3 position-absolute cart-button" onclick="goToCart()">
                                <span class="badge bg-primary position-absolute top-0 start-100 translate-middle"
                                    id="cantidad_carrito">${item.cantidad}</span>
                                <i class="fas fa-shopping-cart carrito producto"></i>
                            </a>
                            `
                            break;
                        }
                    }
                }
                productDiv.appendChild(cardFooter);

                featuredProductsContainer.appendChild(productDiv);
            });
        })
        .catch(error => {
            console.error('Error al obtener productos destacados:', error);
        });

    const swiper = new Swiper('.swiper.destacados', {
        slidesPerView: 4,
        spaceBetween: 10,
        loop: true,
        speed: 1000,
        centerSlide: 'true',
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
            dynamicBullets: true,
        },
        autoplay: {
            delay: 4000,
        },
        navigation: {
            nextEl: ".fa-arrow-right",
            prevEl: ".fa-arrow-left",
        }
    });
})

