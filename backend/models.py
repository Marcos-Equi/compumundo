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