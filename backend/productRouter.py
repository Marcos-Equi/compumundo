from flask import Blueprint, request, jsonify
from models import Producto, db

productos = Blueprint('productos', __name__, url_prefix='/productos')


@productos.route('/', methods=['GET'])
def get_products():
    productos = Producto.query.all()
    return jsonify({'productos': [producto.serialize() for producto in productos]}), 200

@productos.route('/', methods=['POST'])
def post_products():
    data = request.get_json()

    required_fields = ['nombre', 'tipo', 'precio', 'stock', 'descripcion']
    for required_field in required_fields:
        if required_field not in data:
            return jsonify({'error': 'Faltan datos'}), 400

    if not isinstance(data['nombre'], str) or \
        not isinstance(data['tipo'], str) or \
        not isinstance(data['precio'], (int, float)) or \
        not isinstance(data['stock'], int) or \
        not isinstance(data['descripcion'], str):
        return jsonify({'error': 'Datos incorrectos'}), 400

    producto = Producto(
        nombre=data['nombre'],
        tipo=data['tipo'],
        precio=data['precio'],
        stock=data['stock'],
        descripcion=data['descripcion']
    )

    try:
        db.session.add(producto)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

    return jsonify({'producto': producto.serialize()}), 201