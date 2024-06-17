from flask import Blueprint, request, jsonify

productos = Blueprint('productos', __name__, url_prefix='/productos')


@productos.route('/', methods=['GET'])
def get_products():
    return jsonify({'productos': 'Lista de productos'})