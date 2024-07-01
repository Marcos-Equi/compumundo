from flask import Flask, render_template, Blueprint, request
from flask_cors import CORS
from models import db
from config import Config
from productRouter import productos
from carritoRouter import carritos

app = Flask(__name__, static_folder='../frontend/static', template_folder='../frontend/templates')
app.config.from_object(Config)
port = 5000
CORS(app)
db.init_app(app)

api = Blueprint('api', __name__, url_prefix='/api')
api.register_blueprint(productos)
api.register_blueprint(carritos)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/producto')
def product():
    id = request.args.get('id')
    if id:
        return render_template('detallesProd.html')
    return render_template('products.html')

app.register_blueprint(api)
app.register_blueprint(carritos)

if __name__ == '__main__':
    print('Starting server...')
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', debug=True, port=port)
    print('Started...')