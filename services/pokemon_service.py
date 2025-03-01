import math
from rapidfuzz import process
from cache import get_pokemon_data
from services.format_name_service import format_pokemon_name

captured_pokemon = set()  # In-memory storage for captured Pokémon


def filter_by_type(data, type_filter):
    return [
        p for p in data if type_filter in [p["type_one"].lower(), p["type_two"].lower()]
    ]


def sort_data(data, sort_order):
    reverse = sort_order == "desc"
    return sorted(data, key=lambda p: p["number"], reverse=reverse)


def format_pokemon_names(data):
    for p in data:
        formatted_name, image_name = format_pokemon_name(p["name"])
        p["name"] = formatted_name
        p["image_name"] = image_name
        p["number_str"] = str(p["number"])


def paginate_data(data, limit, page):
    total_count = len(data)
    total_pages = math.ceil(total_count / limit)

    start = (page - 1) * limit
    end = start + limit
    return data[start:end], total_count, total_pages


def get_filtered_pokemon(params, data=None):
    if data is None:
        data = get_pokemon_data()

    # Filtering by type
    type_filter = params.get("type")
    if type_filter:
        data = filter_by_type(data, type_filter)

    # Sorting
    sort_order = params.get("sort", "asc").lower()
    data = sort_data(data, sort_order)

    # Format Names
    format_pokemon_names(data)

    # Search
    query = str(params.get("query", "")).strip()
    if query:
        query = str(query).lower()

        # Create a mapping where keys are lowercase Pokémon names and Pokémon types
        pokemon_search_map = {
            str(p["name"]).lower()
            + " "
            + str(p["type_one"]).lower()
            + " "
            + str(p["type_two"]).lower()
            + " ": p
            for p in data
        }

        results = process.extract(
            query, pokemon_search_map.keys(), limit=10, score_cutoff=60
        )

        data = [pokemon_search_map[result[0]] for result in results]

    # Pagination
    try:
        limit = int(params.get("limit", 10))
        page = int(params.get("page", 1))
    except ValueError:
        limit, page = 10, 1

    return paginate_data(data, limit, page)


def capture_pokemon(data):
    try:
        pokemon_unique_id = f'{str(data["name"]).lower()}-{data["id"]}'
        captured_pokemon.add(pokemon_unique_id)
        return True, f'Pokémon {data["name"]} captured!'
    except (KeyError, ValueError):
        return False, "Invalid Pokémon ID"


def get_captured_pokemon():
    data = get_pokemon_data()
    captured = []

    for p in data:
        pokemon_unique_id = f'{str(p["name"]).lower()}-{p["number"]}'

        if pokemon_unique_id in captured_pokemon:
            captured.append(p)

    return captured
