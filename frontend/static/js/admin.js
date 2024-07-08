const misComprasBtn = document.getElementById('mis-compras');
const misComprasContent = document.getElementById('mis-compras-content');
const miCuentaBtn = document.getElementById('mi-cuenta');
const miCuentaContent = document.getElementById('mi-cuenta-content');

document.addEventListener('DOMContentLoaded', function () {
    const salirBtn = document.getElementById('salir');

    const changePasswordForm = document.getElementById('change-password-form');
    const passwordChangeMessage = document.getElementById('password-change-message');

    function llenarDatosUsuario() {
        let nombreGuardado = localStorage.getItem('usuario');
        let inputNombre = document.getElementById('nombre');
        let inputApellido = document.getElementById('apellido');

        if (nombreGuardado) {
            inputNombre.value = nombreGuardado;

            fetch(`/usuarios/usuario/${nombreGuardado}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok ' + response.statusText);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.apellido) {
                        inputApellido.value = data.apellido;
                    } else {
                        console.error('Error: Usuario no encontrado');
                    }
                })
                .catch(error => console.error('Error al obtener los datos del usuario:', error));
        }
    }

    llenarDatosUsuario();

    miCuentaBtn.addEventListener('click', function () {
        miCuentaContent.style.display = 'block';
        misComprasContent.style.display = 'none';
        let pedidos_container = document.querySelector('.pedidos_container');
        if (pedidos_container) {
            pedidos_container.remove();
        }
        llenarDatosUsuario();
    });


    salirBtn.addEventListener('click', function () {
        window.location.href = '/';
    });

    changePasswordForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const nombreGuardado = localStorage.getItem('usuario');
        const oldPassword = document.getElementById('old-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (newPassword !== confirmPassword) {
            passwordChangeMessage.textContent = "Las nuevas contraseñas no coinciden.";
            passwordChangeMessage.className = "error";
            return;
        }

        fetch(`/usuarios/${nombreGuardado}/change-password`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                oldPassword: oldPassword,
                newPassword: newPassword
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    passwordChangeMessage.textContent = data.error;
                    passwordChangeMessage.className = "error";
                } else {
                    passwordChangeMessage.textContent = data.message;
                    passwordChangeMessage.className = "success";
                }
            })
            .catch(error => {
                passwordChangeMessage.textContent = 'Error al cambiar la contraseña';
                passwordChangeMessage.className = "error";
                console.error('Error al cambiar la contraseña:', error);
            });
    });
});


misComprasBtn.addEventListener('click', async function () {
    misComprasContent.style.display = 'block';
    miCuentaContent.style.display = 'none';

    let idUsuario = localStorage.getItem('usuario_id');
    await fetch(`/api/carritos/usuario/${idUsuario}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('Error al obtener carritos:', data.error);
                return;
            }
            let carritos = data.compras;
            console.log(data);

            let pedidos = document.createElement('div');
            pedidos.classList.add('col-md-9', 'mx-auto', 'pedidos_container')
            let tituloPedidos = document.createElement('h3');
            tituloPedidos.textContent = 'Mis compras';
            tituloPedidos.classList.add('titulo_container');
            pedidos.appendChild(tituloPedidos);

            carritos.forEach(carrito => {
                let fecha = new Date(carrito.fecha_creacion);
                let fechaFormateada = `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`;


                pedidos.innerHTML += `
                <div class="row gx-2 card"  data-product-id="${carrito.id}">
                    <div class="col-12 mb-3">
                        <div class="d-flex justify-content-between">
                            <div>
                                <span class="title_card">N° de pedido: </span>
                                <span class="numPedido">${carrito.id}</span>
                            </div>
                            <div>
                                <span class="title_card">Fecha: </span>
                                <span class="fecha">${fechaFormateada}</span>
                            </div>
                        </div>
                    </div>
                    <div class="col-4 mb-3">
                        <div class="d-flex flex-row">
                            <span class="title_card me-1">Cantidad de productos:</span><span class="cantProductos">  ${carrito.items.length}</span>
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="d-flex justify-content-between">
                            <div>
                            <span class="title_card">Monto: </span>
                            <span>$${parseFloat(carrito.precio_total).toLocaleString("es-ES")}</span>
                            </div>
                            <div>
                                <button class="modalDetalles" onclick="mostrarDetallesPedido(${carrito.id})">Ver detalle</button>
                            </div>
                        </div>
                    </div>
                </div>`
                misComprasContent.appendChild(pedidos);
            })
        })
});

async function mostrarDetallesPedido(id) {
    let carrito = await fetch(`/api/carritos/${id}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('Error al obtener carrito:', data.error);
                return;
            }
            return data.carrito;
        });
    Swal.fire({
        background: "transparent",
        width: "100%",
        title: `<span style="color: #fff;">Pedido: ${carrito.id}</span>`,
        html: `<div class="container-fluid">

        <div class="container infoPedido">
        
          <!-- Main content -->
          <div class="row">
            <div class="col-lg-8">
              <!-- Details -->
              <div class="card mb-4">
                <div class="card-body">
                  <div class="mb-3 d-flex justify-content-between">
                    <div>
                      <span class="me-3">22-11-2021</span>
                      <span class="me-3">#${carrito.id}</span>
                      <span class="me-3">Visa -1234</span>
                      <span class="badge rounded-pill bg-info">Correo Argentino</span>
                    </div>
                    <div class="d-flex">
                      <button class="btn btn-link p-0 me-3 d-none d-lg-block btn-icon-text"><i class="bi bi-download"></i> <span class="text">Factura</span></button>
                      <div class="dropdown">
                        <button class="btn btn-link p-0 text-muted" type="button" data-bs-toggle="dropdown">
                          <i class="bi bi-three-dots-vertical"></i>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end">
                          <li><a class="dropdown-item" href="#"><i class="bi bi-pencil"></i> Edit</a></li>
                          <li><a class="dropdown-item" href="#"><i class="bi bi-printer"></i> Print</a></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <table class="table table-borderless">
                    <tbody class="prodPedido productos">

                    </tbody>
                    <tfoot>
                      <tr>
                        <td colspan="2">Subtotal</td>
                        <td class="text-end">$${parseFloat(carrito.precio_total).toLocaleString("ES-es")}</td>
                      </tr>
                      <tr>
                        <td colspan="2">Costo de envío</td>
                        <td class="text-end">$5000</td>
                      </tr>
                      <tr class="fw-bold">
                        <td colspan="2">TOTAL</td>
                        <td class="text-end">$${parseFloat(carrito.precio_total + 5000).toLocaleString("ES-es", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
              <!-- Payment -->
              <div class="card mb-4">
                <div class="card-body">
                  <div class="row">
                    <div class="col-lg-6">
                      <h3 class="h6">Método de pago:</h3>
                      <p>Visa -1234 <br>
                      <span>Total: $${parseFloat((carrito.precio_total + 5000) * 1.1).toLocaleString("ES-es", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}</span> <span class="badge bg-success rounded-pill">Pago Exitoso</span></p>
                    </div>
                    <div class="col-lg-6">
                      <h3 class="h6">Información de envío</h3>
                      <address>
                        <strong>Code Predators</strong><br>
                        Av. Paseo Colón 850<br>
                        Buenos Aires, Piso 2<br>
                        <abbr title="Teléfono">P:</abbr> (+54) 9 11 1234-4563
                      </address>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-4">
              <!-- Customer Notes -->
              <div class="card mb-4">
                <div class="card-body">
                  <h3 class="h6">Notas sobre el envío</h3>
                  <p>Sed enim, faucibus litora velit vestibulum habitasse. Cras lobortis cum sem aliquet mauris rutrum. Sollicitudin. Morbi, sem tellus vestibulum porttitor.</p>
                </div>
              </div>
              <div class="card mb-4">
                <!-- Shipping information -->
                <div class="card-body">
                  <h3 class="h6">Información de envío</h3>
                  <strong>Correo Argentino</strong>
                  <span><a href="#" class="text-decoration-underline" target="_blank">FF1234567890</a> <i class="bi bi-box-arrow-up-right"></i> </span>
                  <hr>
                  <h3 class="h6">Dirección</h3>
                      <address>
                        <strong>Code Predators</strong><br>
                        Av. Paseo Colón 850<br>
                        Buenos Aires, Piso 2<br>
                        <abbr title="Teléfono">P:</abbr> (+54) 9 11 1234-4563
                      </address>
                </div>
              </div>
            </div>
          </div>
        </div>
          </div>`
    })
    let productosPedido = document.querySelector('.productos');
    carrito.items.forEach(item => {
        productosPedido.innerHTML += `
                    <tr>
                        <td>
                            <div class="d-flex mb-2">
                                <div class="flex-shrink-0" data-product-id="${item.id}">
                                    <img src=${item.info_producto.imagen} alt="" width="50" class="img-fluid infoProd">
                                </div>
                                <div class="flex-lg-grow-1 ms-3">
                                    <h6 class="small mb-0" data-product-id="${item.producto_id}"><a href="/producto?id=${item.producto_id}" class="text-reset infoProd">${item.info_producto.nombre}</a></h6>
                                </div>
                            </div>
                        </td>
                        <div class="prodPedInfo">
                            <td>${item.cantidad}</td>
                            <td class="text-end">$${parseFloat(item.info_producto.precio * item.cantidad).toLocaleString("ES-es")}</td>
                        </div>
                    </tr>
                `
    })

}