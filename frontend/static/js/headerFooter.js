async function printCantidadCarrito() {
    const carrito_id = localStorage.getItem('carrito_id');
    if (!carrito_id)
        return;

    await fetch(`/api/carritos/${carrito_id}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('Error al obtener carrito:', data.error);
                return;
            }

            let cantidad = 0

            for (const item of data.carrito.items) {
                cantidad += item.cantidad;
            }

            document.getElementById('cantidad_carrito').textContent = cantidad;
        })
        .catch(error => {
            console.error('Error al obtener carrito:', error);
        });
}

document.addEventListener('DOMContentLoaded', async () => {
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

    await printCantidadCarrito();
});