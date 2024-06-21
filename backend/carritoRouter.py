from flask import Blueprint, request, jsonify
from models import Carrito, ProdCarrito, Producto, db

carritos = Blueprint('carritos', __name__, url_prefix='/carritos')

@carritos.route('/<int:id>', methods=['GET'])
def get_cart(id):
    carrito = Carrito.buscar_por_id(id)
    if not carrito:
        return jsonify({'error': 'Carrito no existente'}), 404
    items_carrito = ProdCarrito.buscar_por_carrito(id)
    lista_items = []
    for item in items_carrito:
        producto = Producto.buscar_por_id(item.producto_id)
        info_producto = {
            'nombre': producto.nombre,
            'tipo': producto.tipo,
            'precio': producto.precio,
            'descripcion': producto.descripcion
        }
        lista_items.append(item.serialize(info_producto))
    return jsonify({'carrito': carrito.serialize(lista_items)}), 200

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