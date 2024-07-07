from flask import Blueprint, request, jsonify
from models import db, IniciarSesion


user_router = Blueprint('usuarios', __name__)


@user_router.route('/<nombre_usuario>/change-password', methods=['PUT'])
def change_password(nombre_usuario):
    data = request.json
    old_password = data.get('oldPassword')
    new_password = data.get('newPassword')

    if old_password and new_password:
        usuario = IniciarSesion.query.filter_by(nombre=nombre_usuario).first()
        if usuario:
            if usuario.contraseña == old_password:
                usuario.contraseña = new_password
                db.session.commit()
                return jsonify({'message': 'Contraseña actualizada correctamente'}), 200
            else:
                return jsonify({'error': 'La contraseña actual es incorrecta'}), 401
        else:
            return jsonify({'error': 'Usuario no encontrado'}), 404
    else:
        return jsonify({'error': 'Faltan datos obligatorios'}), 400


@user_router.route('/usuario/<nombre>', methods=['GET'])
def obtener_usuario(nombre):
    usuario = IniciarSesion.query.filter_by(nombre=nombre).first()
    if usuario:
        return jsonify({
            'nombre': usuario.nombre,
            'apellido': usuario.apellido
        }), 200
    else:
        return jsonify({'error': 'Usuario no encontrado'}), 404
    


@user_router.route('/register', methods=['POST'])
def register():
    data = request.json
    nombre = data.get('nombre')
    apellido = data.get('apellido')
    contraseña = data.get('contraseña')
    respuesta = data.get('respuesta')  
    if nombre and apellido and contraseña and respuesta:
        nuevo_usuario = IniciarSesion(nombre=nombre, apellido=apellido, contraseña=contraseña, respuesta=respuesta)
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


@user_router.route('/<nombre_usuario>/recover-password', methods=['PUT'])
def recover_password(nombre_usuario):
    data = request.json
    pregunta_seguridad = data.get('preguntaSeguridad')
    respuesta_seguridad = data.get('respuestaSeguridad')
    nueva_contraseña = data.get('nuevaContraseña')

    
    if pregunta_seguridad and respuesta_seguridad and nueva_contraseña:
        usuario = IniciarSesion.query.filter_by(nombre=nombre_usuario).first()
        if usuario:
            if usuario.respuesta == respuesta_seguridad:
                usuario.contraseña = nueva_contraseña
                db.session.commit()
                return jsonify({'message': 'Contraseña actualizada correctamente'}), 200
            else:
                return jsonify({'error': 'La respuesta de seguridad es incorrecta'}), 401
        else:
            return jsonify({'error': 'Usuario no encontrado'}), 404
    else:
        return jsonify({'error': 'Faltan datos obligatorios'}), 400


