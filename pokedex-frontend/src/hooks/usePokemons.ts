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

  const fetchPokemonData = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchFunction =
        view === "my_pokemon" ? getCapturedPokemons : fetchPokemons;
      const setFunction = view === "my_pokemon" ? setMyPokemons : setPokemons;
      const data = await fetchFunction(
        page,
        limit,
        sortOrder,
        filterType,
        searchQuery
      );
      setFunction(data.pokemon);
      setPagination(data.pagination);
    } catch (err) {
      setError(
        `Failed to load ${view === "my_pokemon" ? "captured" : "all"} Pokémon.`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemonData();
  }, [page, limit, sortOrder, filterType, view, searchQuery]);

  const pokemonData = view === "my_pokemon" ? myPokemons : pokemons;

  return { pokemonData, paginationData, loading, error };
};

export default usePokemons;
