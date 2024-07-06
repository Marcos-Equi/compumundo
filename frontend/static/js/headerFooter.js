document.addEventListener('DOMContentLoaded', () => {
    const usuario = localStorage.getItem('usuario');
    const loginButton = document.getElementById('login-button');

    if (usuario) {
        loginButton.textContent = 'Cerrar Sesión';
        loginButton.href = '#';
        loginButton.addEventListener('click', () => {
            localStorage.removeItem('usuario');
            localStorage.removeItem('usuario_id');
            localStorage.removeItem('carrito_id');
            window.location.href = '/';
        });
    }

    const swiper = new Swiper('.marcas .swiper', {
        slidesPerView: 7,
        spaceBetween: 5,
        loop: true,
        speed: 3000,
        centerSlide: 'true',
        autoplay: {
            delay: 300
        },
        allowTouchMove: false,
    });
});