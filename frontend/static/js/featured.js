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
                productDiv.classList.add('featured-product');
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

                featuredProductsContainer.appendChild(productDiv);
            });
        })
        .catch(error => {
            console.error('Error al obtener productos destacados:', error);
        });
});