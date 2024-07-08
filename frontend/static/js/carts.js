function printEmptyCart() {
    let container = document.getElementById('cart-items-container');
    const defaultTableRow = `
    <div class="card rounded-3 mb-4 text-bg-light"">
        <div class="card-body p-4">
            <div class="row d-flex justify-content-between align-items-center">
                <div class="col-md-6 col-lg-6 col-xl-6">
                    <h5 class="mb-0"> El carrito no tiene items. </h5>
                </div>
                <div class="col-md-6 col-lg-6 col-xl-6">
                    <a href="/producto" class="btn btn-primary btn-block btn-lg me-3">
                        Agregar productos
                    </a>
                </div>
            </div>
        </div>
    </div>
    `
    container.innerHTML += defaultTableRow;
};

function printCartItem(container, item) {
    let itemPrice = (parseFloat(item.info_producto.precio) * item.cantidad);
    itemPrice = itemPrice.toLocaleString("es-ES", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    const itemTableRow = `
    <div class="card rounded-3 mb-4 text-bg-light" id="item-${item.producto_id}">
        <div class="card-body p-4">
            <div class="row d-flex justify-content-between align-items-center" id="cart-item-card">
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
                        id="btn-qty-down-${item.producto_id}"
                        name="${item.producto_id}"
                        onclick="this.parentNode.querySelector('input[type=number]').stepDown();
                            updateItem(this.id);">
                        <i class="fas fa-minus"></i>
                    </button>

                    <input id="form-qty-${item.producto_id}"
                        min="1" max="${item.info_producto.stock}"
                        name="quantity" type="number"
                        value="${item.cantidad}"
                        class="form-control form-control-sm"/>

                    <button data-mdb-button-init data-mdb-ripple-init
                        class="btn btn-link btn-qty-up px-2"
                        id="btn-qty-up-${item.producto_id}"
                        name="${item.producto_id}"
                        onclick="this.parentNode.querySelector('input[type=number]').stepUp();
                            updateItem(this.id);">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>

                <div class="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
                    <h5 class="mb-0">$ 
                        <span id="price-${item.producto_id}">${itemPrice}</span>
                    </h5>
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
};

function printAllCartItems(cart) {
    let items = cart.items
    let container = document.getElementById('cart-items-container');
    for (const item of items) {
        printCartItem(container, item);
    }
};

function printCartPrice(totalPrice) {
    let container = document.getElementById('cart-price-container');
    const totalPriceRow = `
    <div class="card mb-4">
        <div class="card-body p-4 d-flex flex-row">
            <div class="col-md-3 col-lg-3 col-xl-3">
                <h5 class="mb-0">Total</h5>
            </div>
            <div class="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
                <h5 class="mb-0">$ 
                    <span id="total-price">${parseFloat(totalPrice).toLocaleString("es-ES", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}</span>
                </h5>
            </div>
        </div>
    </div>
    `
    container.innerHTML += totalPriceRow;
};

function printCartCheckout() {
    let container = document.getElementById('cart-checkout-container');
    const checkoutRow = `
    <div class="card">
        <div class="card-body">
        <a href="#" class="btn btn-warning btn-block btn-lg text-reset me-3"
            id="checkout-button" onclick="checkOut()">
            Finalizar Compra
        </a>
    </div>
    `
    container.innerHTML += checkoutRow;
}

function updateTotalPrice(price) {
    let totalPriceContainer = document.getElementById('total-price');
    totalPriceContainer.innerText = parseFloat(price).toLocaleString("es-ES", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })
};

function updateItem(elementID) {
    let cartID = localStorage.getItem('carrito_id');

    let boton = document.getElementById(elementID);
    let productoID = boton.getAttribute('name');
    let inputQuantity = document.getElementById(`form-qty-${productoID}`).valueAsNumber;
    let itemPriceContainer = document.getElementById(`price-${productoID}`);

    fetch(`/api/carritos/${cartID}/producto/${productoID}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'cantidad': inputQuantity
        }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('Error al obtener item:', data.error);
                return;
            }
            let itemPrice = (parseFloat(data.item.info_producto.precio) * data.item.cantidad).toLocaleString("es-ES", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
            itemPriceContainer.innerText = itemPrice;
            updateTotalPrice(data.precio_total);

        })
        .catch(error => {
            console.error('Error al obtener item:', error);
        });
};

function deleteCartItem(elementID) {
    let cartID = localStorage.getItem('carrito_id');

    let boton = document.getElementById(elementID);
    let productoID = boton.getAttribute('name');
    let itemContainer = document.getElementById(`item-${productoID}`);
    itemContainer.remove();

    fetch(`/api/carritos/${cartID}/producto/${productoID}`, {
        method: "DELETE"
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('Error al borrar item:', data.error);
                return;
            }
            if (data.precio_total === '0.00') {
                printEmptyCart();
                document.getElementById('cart-price-container').remove();
                document.getElementById('cart-checkout-container').remove();
            } else {
                updateTotalPrice(data.precio_total);
            }
        })
        .catch(error => {
            console.error('Error al borrar item:', error);
        });
};

document.addEventListener('DOMContentLoaded', function () {
    let cartID = localStorage.getItem('carrito_id');

    if (cartID) {
        fetch(`/api/carritos/${cartID}`, {
            method: "GET"
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error('Error al obtener carrito:', data.error);
                    return;
                }
                let cart = data.carrito;
                if (cart.items.length === 0) {
                    printEmptyCart();
                } else {
                    printAllCartItems(cart);
                    printCartPrice(cart.precio_total);
                    printCartCheckout();
                }
            })
            .catch(error => {
                console.error('Error al obtener carrito:', error);
            });
    }
});
