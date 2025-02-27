import time
import db

pokemon_cache = None
last_updated = None

def load_pokemon_data():
    """Loads Pokémon data if cache is empty."""
    global pokemon_cache, last_updated
    if pokemon_cache is None:
        pokemon_cache = db.get()
    last_updated = time.time()

def get_pokemon_data():
    """Returns cached Pokémon data."""
    if pokemon_cache is None:
        load_pokemon_data()
    return pokemon_cache
