from flask import Blueprint, request, jsonify
from models import Carrito, ProdCarrito, Producto, db

carritos = Blueprint('carritos', __name__, url_prefix='/carritos')

@carritos.route('/<int:id>', methods=['GET'])
def get_cart(id):
    carrito = Carrito.buscar_por_id(id)
    if not carrito:
        return jsonify({'error': 'Carrito no existente'}), 404    
    return jsonify({'carrito': carrito.serialize()}), 200

@carritos.route('/', methods=['POST'])
def create_cart():
    data = request.get_json()
    carrito = Carrito(usuario_id=data['id_usuario'])
    try:
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

@carritos.route('/<int:id>/producto/<int:id_producto>', methods=['POST'])
def add_item(id, id_producto):
    carrito = Carrito.buscar_por_id(id)
    producto = Producto.buscar_por_id(id_producto)
    item_carrito = ProdCarrito.buscar_por_id(id, id_producto)
    try:
        if not item_carrito:
            item_carrito = ProdCarrito(
                carrito_id=id,
                producto_id=id_producto,
                cantidad=1
            )
            db.session.add(item_carrito)
        else:
            item_carrito.cantidad += 1
        carrito.precio_total += producto.precio
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
        actual_precio_item = producto.precio * item_carrito.cantidad
        item_carrito.cantidad = data['cantidad']
        nuevo_precio_item = producto.precio * item_carrito.cantidad
        if nuevo_precio_item > actual_precio_item:
            carrito.precio_total += (nuevo_precio_item - actual_precio_item)
        else:
            carrito.precio_total -= (actual_precio_item - nuevo_precio_item)
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