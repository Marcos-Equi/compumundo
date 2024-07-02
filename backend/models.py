from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func
import datetime

db = SQLAlchemy()

class Producto(db.Model):
    __tablename__ = 'productos'
    
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(255), nullable=False)
    tipo = db.Column(db.String(50), nullable=False)
    precio = db.Column(db.Numeric(10, 2), nullable=False)
    stock = db.Column(db.Integer, nullable=False)
    descripcion = db.Column(db.Text)
    imagen = db.Column(db.String(255))  

    def serialize(self):
        return {
            'id': self.id,
            'nombre': self.nombre,
            'tipo': self.tipo,
            'precio': str(self.precio),
            'stock': self.stock,
            'descripcion': self.descripcion,
            'imagen': self.imagen
        }
    
    @staticmethod
    def buscar_por_nombre(nombre):
        nombre = nombre.lower().replace(' ', '')
        resultados = Producto.query.filter(
            func.replace(func.lower(Producto.nombre), ' ', '').like(f'%{nombre}%')
        ).all()
        return resultados
    
    @staticmethod
    def buscar_por_tipo(tipo):
        tipo = tipo.lower()
        resultados = Producto.query.filter(func.lower(Producto.tipo) == tipo).all()
        return resultados
    
    @staticmethod
    def buscar_por_id(id):
        return Producto.query.get(id)
    
    @staticmethod
    def producto_mas_barato_por_tipo(tipo):
        producto_mas_barato = Producto.query.filter_by(tipo=tipo).order_by(Producto.precio).first()
        return producto_mas_barato

class Carrito(db.Model):
    __tablename__ = 'carritos'
    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('iniciar_sesion.id'))
    fecha_creacion = db.Column(db.DateTime, default=datetime.datetime.now())

    def serialize(self):
        items_carrito = ProdCarrito.buscar_por_carrito(self.id)
        lista_items = [item.serialize() for item in items_carrito]
        return {
            'id': self.id,
            'items': lista_items,
            'id_usuario': self.usuario_id,
            'fecha_creacion': self.fecha_creacion
        }
    
    @staticmethod
    def buscar_por_id(id):
        return Carrito.query.get(id)

class ProdCarrito(db.Model):
    __tablename__ = 'carrito_prod'
    carrito_id = db.Column(db.Integer, db.ForeignKey('carritos.id'), primary_key=True)
    producto_id = db.Column(db.Integer, db.ForeignKey('productos.id'), primary_key=True)
    cantidad = db.Column(db.Integer, nullable=False)

    def serialize(self):
        producto = Producto.buscar_por_id(self.producto_id)
        info_producto = {
            'nombre': producto.nombre,
            'tipo': producto.tipo,
            'precio': producto.precio,
            'descripcion': producto.descripcion,
            'imagen': producto.imagen
        }
        return {
            'carrito_id': self.carrito_id,
            'producto_id': self.producto_id,
            'info_producto': info_producto,
            'cantidad': self.cantidad
        }
    
    @staticmethod
    def buscar_por_id(id_carrito, id_producto):
        return ProdCarrito.query.get((id_carrito, id_producto))
    
    @staticmethod
    def buscar_por_carrito(id):
        return ProdCarrito.query.filter(ProdCarrito.carrito_id == id).all()

class IniciarSesion(db.Model):
    __tablename__ = 'iniciar_sesion'
    
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    apellido = db.Column(db.String(100), nullable=False)
    contraseña = db.Column(db.String(255), nullable=False)
    lista_compra = db.Column(db.Text, nullable=True)
    
    def __repr__(self):
        return f'<IniciarSesion {self.nombre} {self.apellido}>'
    
    def serialize(self):
        return {
            'id': self.id,
            'nombre': self.nombre,
            'apellido': self.apellido,
            'contraseña': self.contraseña,
            'lista_compra': self.lista_compra
        }
