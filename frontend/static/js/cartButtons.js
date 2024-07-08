async function addItemToCart(productId, quantity) {
    const userId = localStorage.getItem('usuario_id');
    let cartId = localStorage.getItem('carrito_id');

    if (userId) {
        if (!cartId) {
            await fetch(`/api/carritos/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'id_usuario': userId
                }),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        console.error('Error al obtener carrito:', data.error);
                        return;
                    }
                    localStorage.setItem('carrito_id', data.carrito.id)
                    cartId = data.carrito.id;
                })
                .catch(error => {
                    console.error('Error al obtener item:', error);
                });
        }
        await fetch(`/api/carritos/${cartId}/producto/${productId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'cantidad': quantity
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error('Error al agregar item:', data.error);
                    return;
                }
                console.log('Se agrego el item:', data.item_carrito);
            })
            .catch(error => {
                console.error('Error al agregar item:', error);
            });
        window.location.href = '/carrito';
    } else {
        window.location.href = '/iniciar_sesion';
    }
};

async function goToCart() {
    const userId = localStorage.getItem('usuario_id');
    const cartId = localStorage.getItem('carrito_id');

    if (userId) {
        if (!cartId) {
            await fetch(`/api/carritos/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'id_usuario': userId
                }),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        console.error('Error al obtener carrito:', data.error);
                        return;
                    }
                    localStorage.setItem('carrito_id', data.carrito.id)
                })
                .catch(error => {
                    console.error('Error al obtener item:', error);
                });
        }
        window.location.href = '/carrito';
    } else {
        window.location.href = '/iniciar_sesion';
    }
};

async function checkOut() {
    const userId = localStorage.getItem('usuario_id');
    const cartId = localStorage.getItem('carrito_id');

    await fetch(`/api/carritos/${cartId}/checkout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'id_usuario': userId
        }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('Error al obtener carrito:', data.error);
                return;
            }
            if (data.message === 'Muchas gracias por su compra!') {
                localStorage.removeItem('carrito_id', cartId)
            }
        })
        .catch(error => {
            console.error('Error al obtener item:', error);
        });
    window.location.href = '/';
};

