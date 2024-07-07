document.addEventListener('DOMContentLoaded', () => {
    const usuario = localStorage.getItem('usuario');
    const loginButton = document.getElementById('login-button');
    const avatarButton = document.getElementById('avatar-button');

    if (usuario) {
        loginButton.innerHTML = `<i class="fas fa-sign-out-alt"></i> Cerrar sesión`
        loginButton.href = '#';
        loginButton.addEventListener('click', () => {
            localStorage.removeItem('usuario');
            localStorage.removeItem('usuario_id');
            localStorage.removeItem('carrito_id');
            window.location.href = '/';
        });

        avatarButton.innerHTML = `<i class="fa-solid fa-user"></i>  ${usuario}`;
        avatarButton.href = '/account_management';
    }

    const swiper = new Swiper('.marcas .swiper', {
        slidesPerView: 7,
        spaceBetween: 5,
        loop: true,
        speed: 3000,
        centerSlide: true,
        autoplay: {
            delay: 300
        },
        allowTouchMove: false,
    });

    document.getElementById('search-button').addEventListener('click', function (e) {
        e.preventDefault();
        let query = document.getElementById('search-input').value;
        if (!query)
            return;
        window.location.href = `/producto?nombre=${query}`;
    });
});