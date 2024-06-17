from flask import Flask
from flask_cors import CORS
from productRouter import productos
from carritoRouter import carritos

app = Flask(__name__)
CORS(app)

app.register_blueprint(productos)
app.register_blueprint(carritos)

if __name__ == '__main__':
    app.run(debug=True)