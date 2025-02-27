from flask import Blueprint, request, jsonify
from services.pokemon_service import (
    get_filtered_pokemon,
    capture_pokemon,
    get_captured_pokemon,
)

pokemon_api = Blueprint("pokemon", __name__)


@pokemon_api.route("/pokemon", methods=["GET"])
def list_pokemon():
    """Returns a paginated, sorted, and filtered list of Pokémon."""
    pokemon_list, total_count, total_pages = get_filtered_pokemon(request.args)
    response_data = {
        "pokemon": pokemon_list,
        "pagination": {
            "total_count": total_count,
            "total_pages": total_pages,
            "page": request.args.get("page", 1),
            "limit": request.args.get("limit", 10),
        },
    }
    return jsonify(response_data)


@pokemon_api.route("/pokemon/capture", methods=["POST"])
def capture():
    """Marks a Pokémon as captured."""
    data = request.get_json()
    success, message = capture_pokemon(data)
    return jsonify({"success": success, "message": message})


@pokemon_api.route("/pokemon/captured", methods=["GET"])
def captured_pokemon():
    """Returns all captured Pokémon."""
    captured_pokemon = get_captured_pokemon()
    pokemon_list = get_filtered_pokemon(request.args, data=captured_pokemon)
    pokemon_list, total_count, total_pages = get_filtered_pokemon(
        request.args, data=captured_pokemon
    )
    response_data = {
        "pokemon": pokemon_list,
        "pagination": {
            "total_count": total_count,
            "total_pages": total_pages,
            "page": request.args.get("page", 1),
            "limit": request.args.get("limit", 10),
        },
    }
    return jsonify(response_data)
