from flask import Blueprint, request, jsonify
from models import db, IniciarSesion

user_router = Blueprint('usuarios', __name__)

@user_router.route('/register', methods=['POST'])
def register():
    data = request.json
    nombre = data.get('nombre')
    apellido = data.get('apellido')
    contraseña = data.get('contraseña')  

    if nombre and apellido and contraseña:
        nuevo_usuario = IniciarSesion(nombre=nombre, apellido=apellido, contraseña=contraseña)
        
        db.session.add(nuevo_usuario)
        db.session.commit()
        
        return jsonify({'message': 'Usuario registrado correctamente'}), 201
    else:
        return jsonify({'error': 'Faltan datos obligatorios'}), 400