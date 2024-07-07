document.addEventListener('DOMContentLoaded', function() {
    const miCuentaBtn = document.getElementById('mi-cuenta');
    const misComprasBtn = document.getElementById('mis-compras');
    const salirBtn = document.getElementById('salir');
    
    const miCuentaContent = document.getElementById('mi-cuenta-content');
    const misComprasContent = document.getElementById('mis-compras-content');
    const changePasswordForm = document.getElementById('change-password-form');
    const passwordChangeMessage = document.getElementById('password-change-message');

    function llenarDatosUsuario() {
        var nombreGuardado = localStorage.getItem('usuario');
        var inputNombre = document.getElementById('nombre');
        var inputApellido = document.getElementById('apellido');

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

    miCuentaBtn.addEventListener('click', function() {
        miCuentaContent.style.display = 'block';
        misComprasContent.style.display = 'none';
        llenarDatosUsuario();
    });

    misComprasBtn.addEventListener('click', function() {
        misComprasContent.style.display = 'block';
        miCuentaContent.style.display = 'none';
    });

    salirBtn.addEventListener('click', function() {
        window.location.href = '/';
    });

    changePasswordForm.addEventListener('submit', function(event) {
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