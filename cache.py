import time
import db

pokemon_cache = None
last_updated = None  # not in use - but could be used to refresh the cache after a certain amount of time


def load_pokemon_data():
    global pokemon_cache, last_updated
    if pokemon_cache is None:
        pokemon_cache = db.get()
    last_updated = time.time()


def get_pokemon_data():
    if pokemon_cache is None:
        load_pokemon_data()
    return pokemon_cache
