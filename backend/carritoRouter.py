from flask import Blueprint, request, jsonify

carritos = Blueprint('carritos', __name__, url_prefix='/carritos')


@carritos.route('/', methods=['GET'])
def get_products():
    return jsonify({'carritos': 'Este es mi carrito de compras'})