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
                                <button class="modalDetalles">Ver detalle</button>
                            </div>
                        </div>
                    </div>
                </div>`
                misComprasContent.appendChild(pedidos);
            })
        })
});