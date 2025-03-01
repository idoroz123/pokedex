from flask import Flask, jsonify
from api.pokemon_api import pokemon_api
from flask_cors import CORS
import db

app = Flask(__name__)
CORS(app)
app.register_blueprint(pokemon_api, url_prefix="/api")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
