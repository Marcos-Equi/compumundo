from flask import Flask
from flask_cors import CORS
from models import db
from config import Config
from productRouter import productos
from carritoRouter import carritos

app = Flask(__name__)
app.config.from_object(Config)
port = 5000
CORS(app)
db.init_app(app)

app.register_blueprint(productos)
app.register_blueprint(carritos)

if __name__ == '__main__':
    print('Starting server...')
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', debug=True, port=port)
    print('Started...')