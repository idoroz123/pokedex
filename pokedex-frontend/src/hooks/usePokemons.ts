import { useState, useEffect } from "react";
import { fetchPokemons, getCapturedPokemons } from "../api/pokemonAPI";

const usePokemons = (
  page: number,
  limit: number,
  sortOrder: "asc" | "desc",
  filterType: string,
  view: string
) => {
  const [paginationData, setPagination] = useState<any>({});
  const [pokemons, setPokemons] = useState<any[]>([]);
  const [myPokemons, setMyPokemons] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    setLoading(true);
    try {
      const data = await getCapturedPokemons(
        page,
        limit,
        sortOrder,
        filterType
      );
      setMyPokemons(data.pokemon);
      if (view === "my_pokemon") {
        setPagination(data.pagination);
      }
    } catch (err) {
      setError("Failed to load captured Pokémon.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadPokemons = async () => {
      if (view === "my_pokemon") {
        refetch();
      } else {
        // Fetch all Pokémon when view is "all"
        setLoading(true);
        setError(null);
        try {
          const data = await fetchPokemons(page, limit, sortOrder, filterType);
          setPokemons(data.pokemon);
          setPagination(data.pagination);
        } catch (err) {
          setError("Failed to load Pokémon.");
        } finally {
          setLoading(false);
        }
      }
    };

    loadPokemons();
  }, [page, limit, sortOrder, filterType, view]); // Refetch when any of these values change

  return {
    pokemons: view === "my_pokemon" ? myPokemons : pokemons,
    paginationData,
    loading,
    error,
    refetch,
  };
};

export default usePokemons;
