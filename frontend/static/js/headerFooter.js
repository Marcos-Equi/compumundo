document.addEventListener('DOMContentLoaded', () => {
    const usuario = localStorage.getItem('usuario');
    const loginButton = document.getElementById('login-button');
    const avatarButton = document.getElementById('avatar-button'); 

    if (usuario) {
        loginButton.textContent = 'Cerrar Sesión';
        loginButton.href = '#';
        loginButton.addEventListener('click', () => {
            localStorage.removeItem('usuario');
            window.location.href = '/';
        });

        avatarButton.innerHTML = usuario; 
        avatarButton.href = '/account_management';
        avatarButton.classList.add('btn', 'btn-outline-light', 'me-3'); 
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
});