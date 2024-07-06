function imprimirDatos(data) {
    let imagenCont = document.getElementById('imagen_cont')
    let imagen = document.createElement('img')
    imagen.classList.add('rounded-4')
    imagen.classList.add('fit')
    imagen.src = data.imagen
    imagenCont.appendChild(imagen)

    let nombre = document.getElementById('nombre_prod')
    nombre.innerHTML = data.nombre

    let precio = document.getElementById('precio_prod')
    precio.innerHTML = `$${parseFloat(data.precio).toLocaleString("es-ES", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`

    let descripcion = document.getElementsByClassName('descripcion_prod')
    descripcion[0].innerHTML = data.descripcion
    descripcion[1].innerHTML = data.descripcion

    let tipo = document.getElementById('tipo_prod')
    tipo.innerHTML = data.tipo

    let stock = document.getElementById('aviso_stock')
    let botonesStock = document.getElementsByClassName('boton_stock')
    let stockCont = document.getElementById('stock_cont')
    stockCont.maximo = data.stock
    if (data.stock > 0) {
        stock.innerHTML = 'En stock'
        stock.className += ' text-success'
    } else {
        botonesStock[0].disabled = true
        botonesStock[1].disabled = true
        stockCont.placeholder = 0
        stockCont.disabled = true
        stock.innerHTML = 'Sin stock'
        stock.className += ' text-danger'
    }

    let itemId = document.getElementById('item_id');
    itemId.value = `${data.id}`;
}

async function imprimirSimilares(tipo) {
    let similares
    const contenedor = document.getElementById('similares_cont')
    await fetch(`/api/productos/tipo/${tipo}`)
        .then(response => response.json())
        .then(datos => similares = datos.productos)

    let i = 0
    while (i < 5 && i < similares.length) {
        if (similares[i].id == new URLSearchParams(window.location.search).get('id')) {
            i++
            continue
        }
        console.log(similares[i].id);
        contenedor.innerHTML += `
            <div class="d-flex mb-3">
                <a href="/producto?id=${similares[i].id}" class="me-3">
                    <img src=${similares[i].imagen}
                        style="min-width: 96px; height: 96px;" class="img-md img-thumbnail" />
                </a>
                <div class="info">
                    <a href="/producto?id=${similares[i].id}" class="nav-link mb-1">${similares[i].nombre}</a>
                    <strong class="text-dark"> 
                        $${parseFloat(similares[i].precio).toLocaleString("es-ES", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}
                    </strong>
                </div>
            </div>
        `
        i++
    }
}

function cargarProd() {
    const id = new URLSearchParams(window.location.search).get('id')
    fetch(`/api/productos/${id}`)
        .then(response => response.json())
        .then(async (data) => {
            if (data.error)
                document.body.innerHTML = `<p>${data.error}</p>`
            else {
                imprimirDatos(data.producto)
                await imprimirSimilares(data.producto.tipo)
            }
        })
}

function sumRestCant(op) {
    let stockCont = document.getElementById('stock_cont')
    let stock = parseInt(stockCont.maximo)
    let cant = parseInt(stockCont.placeholder)
    let botonesStock = document.getElementsByClassName('boton_stock')
    if (cant > stock)
        cant = stock
    else if (cant < 1)
        cant = 1

    if (cant + op == stock && botonesStock[1].disabled == false)
        botonesStock[1].disabled = true
    else if (cant + op == 1 && botonesStock[0].disabled == false)
        botonesStock[0].disabled = true
    else if (cant + op < stock) {
        botonesStock[0].disabled = false
        botonesStock[1].disabled = false
    }
    stockCont.placeholder = cant + op

    let quantity = document.getElementById('quantity');
    quantity.value = `${stockCont.placeholder}`;
}
cargarProd()