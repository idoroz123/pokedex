from flask import app
from api.utils import create_response


class PokedexError(Exception):
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)


def handle_pokedex_error(error: PokedexError):
    return create_response({"error": error.message}, status_code=error.status_code)
