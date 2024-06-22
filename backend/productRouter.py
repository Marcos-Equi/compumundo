from flask import Blueprint, request, jsonify
from models import Producto, db
from sqlalchemy import func

productos = Blueprint('productos', __name__, url_prefix='/productos')


@productos.route('/', methods=['GET'])
def get_products():
    productos = Producto.query.all()
    return jsonify({'productos': [producto.serialize() for producto in productos]}), 200

@productos.route('/<int:id>', methods=['GET'])
def get_productById(id):
    producto = Producto.buscar_por_id(id)
    if not producto:
        return jsonify({'error': 'Producto no encontrado'}), 404

    return jsonify({'producto': producto.serialize()}), 200

@productos.route('/tipo/<string:tipo>', methods=['GET'])
def get_productByTipo(tipo):
    tipo = tipo.lower()
    productos = Producto.buscar_por_tipo(tipo)
    if not productos:
        return jsonify({'error': 'Producto no encontrado'}), 404

    resultados = [producto.serialize() for producto in productos]

    return jsonify({'productos': resultados}), 200

@productos.route('/nombre/<string:nombre>', methods=['GET'])
def get_productsByQuery(nombre):
    productos = Producto.buscar_por_nombre(nombre)
    if not productos:
        return jsonify({'error': 'Producto no encontrado'}), 404
    
    resultados = [producto.serialize() for producto in productos]

    return jsonify({'productos': resultados}), 200

@productos.route('/', methods=['POST'])
def post_products():
    data = request.get_json()

    required_fields = ['nombre', 'tipo', 'precio', 'stock', 'descripcion']
    for required_field in required_fields:
        if required_field not in data:
            return jsonify({'error': 'Faltan datos'}), 400

    if not isinstance(data['nombre'], str) or \
        not isinstance(data['tipo'], str) or \
        not isinstance(data['precio'], (int, float)) or data['precio'] <= 0 or \
        not isinstance(data['stock'], int) or \
        not isinstance(data['descripcion'], str):
        return jsonify({'error': 'Datos incorrectos'}), 400
    

    if (Producto.query.filter_by(nombre=data['nombre']).first()):
        return jsonify({'error': 'Ya existe un producto con ese nombre'}), 400

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

@productos.route('/<int:id>', methods=['PATCH'])
def patch_product(id):
    producto = Producto.query.get(id)
    if not producto:
        return jsonify({'error': 'Producto no encontrado'}), 404

    data = request.get_json()

    if 'nombre' in data:
        producto.nombre = data['nombre']
    if 'tipo' in data:
        producto.tipo = data['tipo']
    if 'precio' in data:
        producto.precio = data['precio']
    if 'stock' in data:
        producto.stock = data['stock']
    if 'descripcion' in data:
        producto.descripcion = data['descripcion']

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

    return jsonify({'Producto actualizado': producto.serialize()}), 200

@productos.route('/<int:id>', methods=['DELETE'])
def delete_product(id):
    producto = Producto.query.get(id)
    if not producto:
        return jsonify({'error': 'Producto no encontrado'}), 404

    db.session.delete(producto)
    db.session.commit()

    return jsonify({'Producto eliminado': producto.serialize()}), 200


@productos.route('/destacados', methods=['GET'])
def obtener_productos_destacados():
    tipos_de_productos = ['tarjeta grafica', 'monitor', 'teclado', 'procesador', 'mouse']
    productos_destacados = []

    for tipo in tipos_de_productos:
        producto_mas_barato = Producto.producto_mas_barato_por_tipo(tipo)
        if producto_mas_barato:
            productos_destacados.append(producto_mas_barato.serialize())

    return jsonify({'productos': productos_destacados}), 200