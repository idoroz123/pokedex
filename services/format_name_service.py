import re

EDGE_CASES = {
    "Mr. Mime": {"name": "Mr. Mime", "image_name": "mr-mime"},
    "Farfetch'd": {"name": "Farfetch'd", "image_name": "farfetchd"},
}  # Edge cases for Pokémon names


def handle_edge_cases(name: str, edge_cases: dict) -> str:
    if name in edge_cases:
        return edge_cases[name]["name"], edge_cases[name]["image_name"]
    return name, None


def format_labels(name: str) -> str:
    size_pattern = r"([A-Za-z]+)(Small Size|Large Size|Super Size|Average Size|Incarnate Forme|Therian Forme|Normal Forme|Attack Forme|Defense Forme|Speed Forme|50% Forme|Zen Mode|Aria Forme|Pirouette Forme|Ordinary Forme|Resolute Forme|Black Kyurem|White Kyurem)"
    return re.sub(size_pattern, r"\1 (\2)", name)


def generate_image_name(name: str) -> str:
    image_name_raw = re.sub(r"\s?\(.*?\)", "", name)
    image_name = image_name_raw.replace(" ", "-").lower()
    return "-".join(image_name.split("-")[::-1])


# Move "Mega" to the front and ensure it remains capitalized
def format_mega_name(name: str) -> str:
    return re.sub(r"(?i)(\w+)(Mega)", r"Mega \1", name)


# Remove duplicate occurrences of the Pokémon name (e.g., 'VenusaurMega Venusaur')
def remove_duplicate_name(name: str) -> str:
    return re.sub(r"(?i)\b(\w+)\s+\1\b", r"\1", name)


def handle_xy_image_name(image_name: str) -> str:
    if "x-" in image_name:
        return image_name.replace("x-", "") + "-x"
    elif "y-" in image_name:
        return image_name.replace("y-", "") + "-y"
    return image_name


def format_pokemon_name(name: str) -> str:

    name, image_name = handle_edge_cases(name, EDGE_CASES)
    if image_name is not None:
        return name, image_name

    name = format_labels(name)

    name = format_mega_name(name)

    name = remove_duplicate_name(name)

    image_name = generate_image_name(name)

    image_name = transform_pokemon_name_single_name_with_mega(image_name)

    image_name = handle_xy_image_name(image_name)

    return name, image_name


def transform_pokemon_name_single_name_with_mega(name: str) -> str:
    parts = name.split("-")
    if len(parts) > 1 and "mega" in parts[1].lower():
        return f"{parts[0]}-mega"
    return name
