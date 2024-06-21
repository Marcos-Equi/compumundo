import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func

db = SQLAlchemy()

class Producto(db.Model):
    __tablename__ = 'productos'
    
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(255), nullable=False)
    tipo = db.Column(db.String(50), nullable=False)
    precio = db.Column(db.Numeric(10, 2), nullable=False)
    stock = db.Column(db.Integer, nullable=False)
    descripcion = db.Column(db.Text)
    
    def serialize(self):
        return {
            'id': self.id,
            'nombre': self.nombre,
            'tipo': self.tipo,
            'precio': str(self.precio),
            'stock': self.stock,
            'descripcion': self.descripcion
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

class Carrito(db.Model):
    __tablename__ = 'carritos'
    id = db.Column(db.Integer, primary_key=True)
    nombre_usuario = db.Column(db.String(20), nullable=False)
    fecha_creacion = db.Column(db.DateTime, default=datetime.datetime.now())

    def serialize(self, lista_items):
        return {
            'id': self.id,
            'items': lista_items,
            'nombre_usuario': self.nombre_usuario,
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

    def serialize(self, dict_info):
        return {
            'carrito_id': self.carrito_id,
            'producto_id': self.producto_id,
            'info_producto': dict_info,
            'cantidad': self.cantidad
        }
    
    @staticmethod
    def buscar_por_carrito(id):
        return ProdCarrito.query.filter(ProdCarrito.carrito_id == id).all()