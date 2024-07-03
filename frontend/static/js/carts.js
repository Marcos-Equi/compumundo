function printCartItems(items) {
    let container = document.getElementById('cart-items-container');
    for (const item of items) {
        let itemPrecioTotal = (item.info_producto.precio * item.cantidad.toFixed(2)).toFixed(2);
        const itemTableRow = `
        <div class="card cart-item-card rounded-3 mb-4 text-bg-light" id="item-${item.producto_id}">
            <div class="card-body p-4">
                <div class="row d-flex justify-content-between align-items-center">
                    <div class="col-md-2 col-lg-2 col-xl-2">
                        <img
                            src="${item.info_producto.imagen}"
                            class="img-fluid rounded-3"
                            alt="${item.info_producto.nombre}">
                    </div>

                    <div class="col-md-3 col-lg-3 col-xl-3">
                        <p class="lead fw-normal mb-2">${item.info_producto.nombre}</p>
                        <p><span class="text-muted">Tipo: </span>${item.info_producto.tipo}</p>                        
                    </div>

                    <div class="col-md-3 col-lg-3 col-xl-2 d-flex">
                        <button data-mdb-button-init data-mdb-ripple-init
                            class="btn btn-link btn-qty-down px-2"
                            onclick="this.parentNode.querySelector('input[type=number]').stepDown()">
                            <i class="fas fa-minus"></i>
                        </button>

                        <input id="form1" min="0" name="quantity" type="number"
                            value="${item.cantidad}"
                            class="form-control form-control-sm" />

                        <button data-mdb-button-init data-mdb-ripple-init
                            class="btn btn-link btn-qty-up px-2"
                            onclick="this.parentNode.querySelector('input[type=number]').stepUp()">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>

                    <div class="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
                        <h5 class="mb-0">$ ${itemPrecioTotal}</h5>
                    </div>

                    <div class="col-md-1 col-lg-1 col-xl-1 text-end">
                        <button data-mdb-button-init data-mdb-ripple-init
                            class="btn btn-link btn-delete-item px-2 text-danger"
                            id="btn-delete-${item.producto_id}"
                            name="${item.producto_id}"
                            onclick="deleteCartItem(this.id)">
                            <i class="fas fa-trash fa-lg"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        `
        container.innerHTML += itemTableRow;
    }
}

function deleteCartItem(elementID) {
    const params = new URLSearchParams(window.location.search);
    let cartID = params.get('id');

    let boton = document.getElementById(elementID);
    let productoID = boton.getAttribute('name');
    let item = document.getElementById(`item-${productoID}`);
    item.remove();

    fetch(`/api/carritos/${cartID}/producto/${productoID}`, {
        method: "DELETE"
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('Error al borrar item:', data.error);
                return;
            }
        })
        .catch(error => {
            console.error('Error al borrar item:', error);
        });
};

document.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(window.location.search);
    let cartID = params.get('id');

    if (cartID) {
        fetch(`/api/carritos/${cartID}`)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error('Error al obtener carrito:', data.error);
                    return;
                }
                var cartItems = data.carrito.items;
                printCartItems(cartItems);
            })
            .catch(error => {
                console.error('Error al obtener carrito:', error);
            });
    }
});


