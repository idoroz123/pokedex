import hashlib
from flask import Blueprint, request, jsonify
from api.exceptions import PokedexError
from api.utils import Pagination, PokemonResponse, create_response
from services.pokemon_service import (
    get_filtered_pokemon,
    capture_pokemon,
    get_captured_pokemon,
)


def generate_etag(data):
    """Generate an ETag based on the data."""
    return hashlib.md5(str(data).encode("utf-8")).hexdigest()


pokemon_api = Blueprint("pokemon", __name__)


@pokemon_api.route("/pokemon", methods=["GET"])
def list_pokemon():
    try:
        pokemon_list, total_count, total_pages = get_filtered_pokemon(request.args)

        pagination = Pagination(
            total_count=total_count,
            total_pages=total_pages,
            page=int(request.args.get("page", 1)),
            limit=int(request.args.get("limit", 10)),
        )

        response_data = PokemonResponse(pokemon=pokemon_list, pagination=pagination)

        etag = generate_etag(response_data.to_dict())
        if request.headers.get("If-None-Match") == etag:
            # If the ETag matches, return 304 Not Modified (no body)
            return create_response(None, status_code=304)

        return create_response(response_data, status_code=200)

    except Exception as e:
        raise PokedexError(
            f"An error occurred while fetching Pokémon: {str(e)}", status_code=500
        )


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
