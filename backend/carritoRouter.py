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
    carrito = Carrito(nombre_usuario=data['nombre'])
    try:
        db.session.add(carrito)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    return jsonify({'carrito': carrito.serialize([])}), 201

@carritos.route('/<int:id>/producto/<int:id_producto>', methods=['POST'])
def add_item(id, id_producto):
    try:
        item_carrito = ProdCarrito.buscar_por_id(id, id_producto)
        if not item_carrito:
            item_carrito = ProdCarrito(
                carrito_id=id,
                producto_id=id_producto,
                cantidad=1
            )
            db.session.add(item_carrito)
        else:
            item_carrito.cantidad += 1
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    return jsonify({'item': item_carrito.serialize()}), 201

@carritos.route('/<int:id>/producto/<int:id_producto>', methods=['DELETE'])
def remove_item(id, id_producto):
    item_carrito = ProdCarrito.buscar_por_id(id, id_producto)
    if not item_carrito:
        return jsonify({'error': 'Item no encontrado'}), 404
    db.session.delete(item_carrito)
    db.session.commit()
    return jsonify({'item': item_carrito.serialize()}), 200