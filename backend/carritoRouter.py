from flask import Blueprint, request, jsonify
from models import Carrito, ProdCarrito, Producto, db

carritos = Blueprint('carritos', __name__, url_prefix='/carritos')

@carritos.route('/<int:id>', methods=['GET'])
def get_cart(id):
    carrito = Carrito.buscar_por_id(id)
    if not carrito:
        return jsonify({'error': 'Carrito no existente'}), 404    
    return jsonify({'carrito': carrito.serialize()}), 200

@carritos.route('/usuario/<int:id>', methods=['GET'])
def get_cartsByUser(id):
    lista_carritos = Carrito.buscar_por_usuario(id, True)
    if not lista_carritos:
        return jsonify({'error': 'Carritos no existentes'}), 404    
    return jsonify({'compras': [carrito.serialize() for carrito in lista_carritos]}), 200

@carritos.route('/', methods=['POST'])
def create_cart():
    data = request.get_json()
    carrito = Carrito.buscar_por_usuario(data['id_usuario'], False)
    try:
        if not carrito:
            carrito = Carrito(usuario_id=data['id_usuario'])
            db.session.add(carrito)
            db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500    
    return jsonify({'carrito': carrito.serialize()}), 201

@carritos.route('/<int:id>', methods=['DELETE'])
def delete_cart(id):
    carrito = Carrito.buscar_por_id(id)
    if not carrito:
        return jsonify({'error': 'Carrito no existente'}), 404
    db.session.delete(carrito)
    db.session.commit()
    return jsonify({'exito': True}), 200

@carritos.route('/<int:id>/checkout', methods=['POST'])
def checkout_cart(id):
    data = request.get_json()
    carrito = Carrito.buscar_por_usuario(data['id_usuario'], False)
    lista_items = ProdCarrito.buscar_por_carrito(id)
    try:
        for item in lista_items:
            producto = Producto.buscar_por_id(item.producto_id)
            producto.stock -= item.cantidad
        carrito.fin_compra = True
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    return jsonify({'message': 'Muchas gracias por su compra!'}), 200

@carritos.route('/<int:id>/producto/<int:id_producto>', methods=['POST'])
def add_item(id, id_producto):
    data = request.get_json()
    carrito = Carrito.buscar_por_id(id)
    producto = Producto.buscar_por_id(id_producto)
    item_carrito = ProdCarrito.buscar_por_id(id, id_producto)
    item_cant = int(data['cantidad'])
    try:
        if not item_carrito:
            item_carrito = ProdCarrito(
                carrito_id=id,
                producto_id=id_producto,
                cantidad=item_cant
            )
            db.session.add(item_carrito)
        else:
            item_carrito.cantidad += item_cant
        carrito.precio_total += (producto.precio * item_cant)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    return jsonify({'item': item_carrito.serialize(), 'precio_total': carrito.precio_total}), 201

@carritos.route('/<int:id>/producto/<int:id_producto>', methods=['PATCH'])
def update_item(id, id_producto):
    data = request.get_json()
    carrito = Carrito.buscar_por_id(id)
    producto = Producto.buscar_por_id(id_producto)
    item_carrito = ProdCarrito.buscar_por_id(id, id_producto)
    try:
        if not item_carrito:
            return jsonify({'error': 'Item no encontrado'}), 404
        nueva_cantidad = data['cantidad']
        if (nueva_cantidad > 0) and (nueva_cantidad <= producto.stock):
            if nueva_cantidad > item_carrito.cantidad:
                carrito.precio_total += (producto.precio * (nueva_cantidad - item_carrito.cantidad))
            else:
                carrito.precio_total -= (producto.precio * (item_carrito.cantidad - nueva_cantidad))

            item_carrito.cantidad = nueva_cantidad
            db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500    
    return jsonify({'item': item_carrito.serialize(), 'precio_total': carrito.precio_total}), 201

@carritos.route('/<int:id>/producto/<int:id_producto>', methods=['DELETE'])
def remove_item(id, id_producto):
    carrito = Carrito.buscar_por_id(id)
    producto = Producto.buscar_por_id(id_producto)
    item_carrito = ProdCarrito.buscar_por_id(id, id_producto)
    if not item_carrito:
        return jsonify({'error': 'Item no encontrado'}), 404
    carrito.precio_total -= (producto.precio * item_carrito.cantidad)
    db.session.delete(item_carrito)
    db.session.commit()
    return jsonify({'item': item_carrito.serialize(), 'precio_total': carrito.precio_total}), 200