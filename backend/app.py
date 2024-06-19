from flask import Flask
from flask_cors import CORS
from productRouter import productos
from carritoRouter import carritos
from models import db

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:1234@localhost/compumundo'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)


app.register_blueprint(productos)
app.register_blueprint(carritos)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)