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
    

@user_router.route('/login', methods=['POST'])
def login():
    data = request.json
    nombre = data.get('nombre')
    contraseña = data.get('contraseña')

    if nombre and contraseña:
        usuario = IniciarSesion.query.filter_by(nombre=nombre, contraseña=contraseña).first()
        if usuario:
            return jsonify({'usuario': usuario.serialize(), 'message': 'Inicio de sesión exitoso'}), 200
        else:
            return jsonify({'error': 'Nombre o contraseña incorrectos'}), 401
    else:
        return jsonify({'error': 'Faltan datos obligatorios'}), 400