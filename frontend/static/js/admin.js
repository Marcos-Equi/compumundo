document.addEventListener('DOMContentLoaded', function() {
    const miCuentaBtn = document.getElementById('mi-cuenta');
    const misComprasBtn = document.getElementById('mis-compras');
    const salirBtn = document.getElementById('salir');
    
    const miCuentaContent = document.getElementById('mi-cuenta-content');
    const misComprasContent = document.getElementById('mis-compras-content');

  
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
});