import axios from "axios";

const API_URL = "http://localhost:8080/api/pokemon";

// Fetch Pokemons with sorting, filtering, and pagination
export const fetchPokemons = async (
  page: number,
  limit: number,
  sort: "asc" | "desc",
  type: string
) => {
  try {
    const response = await axios.get(API_URL, {
      params: { page, limit, sort, type },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching Pokemons:", error);
    throw error;
  }
};

// Capture a Pokémon
export const capturePokemonRequest = async (
  pokemonId: number,
  pokemonName: string
) => {
  try {
    const response = await axios.post(
      `${API_URL}/capture`,
      { id: pokemonId, name: pokemonName },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error capturing Pokémon with ID ${pokemonId}:`, error);
    throw error;
  }
};

// Get all captured Pokemons
export const getCapturedPokemons = async (
  page: number,
  limit: number,
  sort: "asc" | "desc",
  type: string
) => {
  try {
    const response = await axios.get(`${API_URL}/captured`, {
      params: { page, limit, sort, type },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching captured Pokemons:", error);
    throw error;
  }
};
