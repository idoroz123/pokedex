from flask import Flask, jsonify
from api.pokemon_api import pokemon_api
from flask_cors import CORS
import db

app = Flask(__name__)
CORS(app, origins="http://localhost:5173")
app.register_blueprint(pokemon_api, url_prefix="/api")


@app.route("/icon/<name>")
def get_icon_url(name: str):
    return f"https://img.pokemondb.net/sprites/silver/normal/{name}.png"


@app.route("/")
def hello():
    data = db.get()
    return jsonify(data)


if __name__ == "__main__":
    app.run(port=8080)
