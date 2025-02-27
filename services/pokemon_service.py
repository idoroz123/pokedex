import math
import re
from cache import get_pokemon_data

captured_pokemon = set()  # In-memory storage for captured Pokémon


def get_filtered_pokemon(params, data=None):
    """Filters, sorts, and paginates Pokémon based on request parameters."""
    if data is None:
        data = get_pokemon_data()

    # Filtering by type
    type_filter = params.get("type")
    if type_filter:
        data = [
            p
            for p in data
            if type_filter in [p["type_one"].lower(), p["type_two"].lower()]
        ]

    # Sorting
    sort_order = params.get("sort", "asc").lower()
    reverse = sort_order == "desc"
    data.sort(key=lambda p: p["number"], reverse=reverse)

    # Format Pokémon names
    for p in data:
        formatted_name, image_name = format_pokemon_name(p["name"])
        p["name"] = formatted_name
        p["image_name"] = image_name

    # Pagination
    try:
        limit = int(params.get("limit", 10))
        page = int(params.get("page", 1))
    except ValueError:
        limit, page = 10, 1

    total_count = len(data)
    total_pages = math.ceil(total_count / limit)

    start = (page - 1) * limit
    end = start + limit
    paginated_data = data[start:end]

    return paginated_data, total_count, total_pages


def capture_pokemon(data):
    """Marks a Pokémon as captured."""
    try:
        pokemon_id = int(data["id"])
        captured_pokemon.add(pokemon_id)
        return True, f"Pokémon {pokemon_id} captured!"
    except (KeyError, ValueError):
        return False, "Invalid Pokémon ID"


def get_captured_pokemon():
    """Returns all captured Pokémon."""
    data = get_pokemon_data()
    return [p for p in data if p["number"] in captured_pokemon]


import re


def format_pokemon_name(name: str) -> str:
    """Format the Pokémon name with 'Mega' at the front, keep size labels in brackets, and generate an image-friendly version."""

    # Ensure size labels are in brackets (before we modify image_name)
    name = re.sub(
        r"([A-Za-z]+)(Small Size|Large Size|Super Size|Average Size)", r"\1 (\2)", name
    )

    # Store the name for the image-friendly version, removing size labels in brackets
    image_name_raw = re.sub(
        r"\s?\(.*?\)", "", name
    )  # Remove size labels in parentheses

    # Move "Mega" to the front and ensure it remains capitalized
    name = re.sub(r"(?i)(\w+)(Mega)", r"Mega \1", name)

    # Remove any duplicate Pokémon name occurrences (e.g., 'VenusaurMega Venusaur')
    name = re.sub(r"(?i)\b(\w+)\s+\1\b", r"\1", name)

    # Generate image-friendly version by replacing spaces with hyphens and converting to lowercase
    image_name = image_name_raw.replace(" ", "-").lower()

    # Reverse the order of parts in the image name
    image_name = "-".join(image_name.split("-")[::-1])

    # Special handling for "x-" and "y-" in image name
    if "x-" in image_name:
        image_name = image_name.replace("x-", "") + "-x"
    elif "y-" in image_name:
        image_name = image_name.replace("y-", "") + "-y"

    return name, image_name
