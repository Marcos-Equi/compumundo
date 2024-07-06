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

document.getElementById('search-button').addEventListener('click', function (e) {
    e.preventDefault();
    let query = document.getElementById('search-input').value;
    if (!query)
        return;
    window.location.href = `/producto?nombre=${query}`;
});


