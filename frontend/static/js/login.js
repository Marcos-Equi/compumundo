const toggleFormButton = document.getElementById('toggleFormButton');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const passwordRecoveryForm = document.getElementById('passwordRecoveryForm');
const noAccountText = document.getElementById('noAccountText');
const loginErrorButton = document.getElementById('loginErrorButton');

toggleFormButton.addEventListener('click', () => {
    if (loginForm.style.display === 'none') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        noAccountText.style.display = 'block';
        toggleFormButton.textContent = 'Registrarse';
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        noAccountText.style.display = 'none';
        toggleFormButton.textContent = 'Iniciar Sesión';
    }
});

loginErrorButton.addEventListener('click', () => {
    loginForm.style.display = 'none';
    registerForm.style.display = 'none';
    passwordRecoveryForm.style.display = 'block';
    loginErrorButton.style.display = 'none';
});

function registerUser() {
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const contraseña = document.getElementById('contraseña').value;
    const respuesta = document.getElementById('respuestaSeguridad').value;

    fetch('/usuarios/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nombre: nombre,
            apellido: apellido,
            contraseña: contraseña,
            respuesta: respuesta
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            window.location.href = '/';
        } else {
            alert('Error al registrar usuario: ' + data.error);
        }
    })
    .catch(error => console.error('Error:', error));
}

function loginUser() {
    document.getElementById('loginErrorButton').style.display = 'none';

    const nombre = document.getElementById('username').value;
    const contraseña = document.getElementById('password').value;

    fetch('/usuarios/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nombre: nombre,
            contraseña: contraseña
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Inicio de sesión exitoso') {
            localStorage.setItem('usuario', nombre);
            window.location.href = '/';
        } else {
            document.getElementById('loginErrorButton').style.display = 'block';
        }
    })
    .catch(error => console.error('Error:', error));
}

function recoverPassword() {
    const usernameRecovery = document.getElementById('usernameRecovery').value;
    const preguntaSeguridadRecovery = document.getElementById('preguntaSeguridadRecovery').value;
    const respuestaSeguridadRecovery = document.getElementById('respuestaSeguridadRecovery').value;
    const newPassword = document.getElementById('newPassword').value;

    fetch(`/usuarios/${usernameRecovery}/recover-password`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            preguntaSeguridad: preguntaSeguridadRecovery,
            respuestaSeguridad: respuestaSeguridadRecovery,
            nuevaContraseña: newPassword
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Contraseña actualizada correctamente') {
            window.location.href = '/';
        } else {
            alert('Error al recuperar la contraseña: ' + data.error);
        }
    })
    .catch(error => console.error('Error:', error));
}
