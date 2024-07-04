const swiper = new Swiper('.swiper', {
    // Optional parameters
    slidesPerView: 4,
    spaceBetween: 10,
    loop: true,
    centerSlide: 'true',
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
        dynamicBullets: true,
    },
    // Navigation arrows
    navigation: {
        nextEl: ".fa-arrow-right",
        prevEl: ".fa-arrow-left",
    }
});

document.addEventListener('DOMContentLoaded', function () {
    var featuredProductsContainer = document.getElementById('featured-products-container');

    fetch('/api/productos/destacados')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('Error al obtener productos destacados:', data.error);
                return;
            }

            data.productos.forEach(producto => {
                var productDiv = document.createElement('div');
                productDiv.classList.add('featured-product', 'swiper-slide');
                productDiv.setAttribute('data-swiper-autoplay', '5000')
                productDiv.addEventListener('click', function () {
                    window.location.href = `/producto?id=${producto.id}`;
                });

                var productImage = document.createElement('img');
                productImage.src = producto.imagen;
                productImage.alt = producto.nombre;
                productDiv.appendChild(productImage);

                var productName = document.createElement('h4');
                productName.textContent = producto.nombre;
                productDiv.appendChild(productName);

                var productPrice = document.createElement('p');
                let precio = parseFloat(producto.precio).toLocaleString("es-ES", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })
                productPrice.textContent = `$ ${precio}`;
                productPrice.classList.add('precio_prod');
                productDiv.appendChild(productPrice);

                let addToCartButton = document.createElement('a');
                addToCartButton.href = '#';
                addToCartButton.textContent = 'Agregar al carrito';
                addToCartButton.classList.add('btn', 'btn-primary', 'mt-auto', 'agregar_car');
                productDiv.appendChild(addToCartButton);

                featuredProductsContainer.appendChild(productDiv);
            });
            swiper.update();
        })
        .catch(error => {
            console.error('Error al obtener productos destacados:', error);
        });
})
