const toggleFormButton = document.getElementById('toggleFormButton');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const noAccountText = document.getElementById('noAccountText');
const loginError = document.getElementById('loginError');

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

function registerUser() {
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const contraseña = document.getElementById('contraseña').value;

    fetch('/usuarios/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nombre: nombre,
            apellido: apellido,
            contraseña: contraseña
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            window.location.href = '/';
        }
    })
    .catch(error => console.error('Error:', error));
}

function loginUser() {
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
            window.location.href = '/';
        } else {
            document.getElementById('loginError').style.display = 'block';
        }
    })
    .catch(error => console.error('Error:', error));
}