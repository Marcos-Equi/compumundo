from flask import Flask, render_template
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

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/producto/<nombre>')
def producto(nombre):
    return render_template('producto.html')



app.register_blueprint(productos)
app.register_blueprint(carritos)

if __name__ == '__main__':
    print('Starting server...')
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', debug=True, port=port)
    print('Started...')