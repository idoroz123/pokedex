from flask import Response
import json

from dataclasses import dataclass
from typing import List, Optional


@dataclass
class Pagination:
    total_count: int
    total_pages: int
    page: int
    limit: int


@dataclass
class PokemonResponse:
    pokemon: List[dict]
    pagination: Pagination

    def to_dict(self):
        return {
            "pokemon": self.pokemon,
            "pagination": {
                "total_count": self.pagination.total_count,
                "total_pages": self.pagination.total_pages,
                "page": self.pagination.page,
                "limit": self.pagination.limit,
            },
        }


import hashlib
import json
from flask import Response


def generate_etag(data):
    """Generate an ETag based on the data."""
    return hashlib.md5(str(data).encode("utf-8")).hexdigest()


def create_response(data: PokemonResponse | None, status_code: int = 200) -> Response:

    # Generate ETag based on the data
    etag = generate_etag(data.to_dict())

    response_body = json.dumps(data.to_dict())
    response = Response(response_body, status=status_code, mimetype="application/json")

    # Set the ETag and Cache-Control headers
    response.headers["ETag"] = etag
    response.headers["Cache-Control"] = "public, max-age=3600"

    return response
