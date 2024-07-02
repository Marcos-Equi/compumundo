document.addEventListener('DOMContentLoaded', () => {
    const usuario = localStorage.getItem('usuario');
    const loginButton = document.getElementById('login-button');

    if (usuario) {
        loginButton.textContent = 'Cerrar Sesión';
        loginButton.href = '#';
        loginButton.addEventListener('click', () => {
            localStorage.removeItem('usuario');
            window.location.href = '/';
        });
    }
});
