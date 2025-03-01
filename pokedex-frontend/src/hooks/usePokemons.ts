import { useState, useEffect } from "react";
import { fetchPokemons, getCapturedPokemons } from "../api/pokemonAPI";

const usePokemons = (
  page: number,
  limit: number,
  sortOrder: "asc" | "desc",
  filterType: string,
  view: string,
  searchQuery: string
) => {
  const [paginationData, setPagination] = useState<any>({});
  const [pokemons, setPokemons] = useState<any[]>([]);
  const [myPokemons, setMyPokemons] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getCaptured = async () => {
    setLoading(true);
    try {
      const data = await getCapturedPokemons(
        page,
        limit,
        sortOrder,
        filterType,
        searchQuery
      );
      setMyPokemons(data.pokemon);
      setPagination(data.pagination);
    } catch (err) {
      setError("Failed to load captured Pokémon.");
    } finally {
      setLoading(false);
    }
  };

  const getAllPokemon = async () => {
    setLoading(true);
    try {
      const data = await fetchPokemons(
        page,
        limit,
        sortOrder,
        filterType,
        searchQuery
      );
      setPokemons(data.pokemon);
      setPagination(data.pagination);
    } catch (err) {
      setError("Failed to load All Pokémon.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadPokemons = async () => {
      setLoading(true);
      setError(null);
      try {
        if (view === "my_pokemon") {
          getCaptured();
        } else {
          getAllPokemon();
        }
      } catch (err) {
        setError("Failed to load Pokémon.");
      } finally {
        setLoading(false);
      }
    };

    loadPokemons();
  }, [page, limit, sortOrder, filterType, view, searchQuery]);

  return {
    pokemons: view === "my_pokemon" ? myPokemons : pokemons,
    paginationData,
    loading,
    error,
    getCaptured,
  };
};

export default usePokemons;
