import React from "react";
import { useSearchParams } from "react-router-dom";
import PokemonCard from "./PokemonCard";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Grid,
  Tabs,
  Tab,
  Pagination,
  CircularProgress,
} from "@mui/material";
import usePokemons from "../hooks/usePokemons";

const PokemonList = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const sortOrder = searchParams.get("sortOrder") || "asc";
  const filterType = searchParams.get("filterType") || "";
  const limit = Number(searchParams.get("limit")) || 5;
  const view = searchParams.get("view") || "all";

  const updateQueryParams = (newParams: Record<string, string | number>) => {
    const updatedParams = new URLSearchParams({
      ...Object.fromEntries(searchParams),
      ...Object.entries(newParams).reduce(
        (acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        },
        {} as Record<string, string>
      ),
    });
    setSearchParams(updatedParams);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    if (newValue === "my_pokemon") {
      updateQueryParams({
        view: newValue,
        page: 1,
        filterType: "",
        sortOrder: "asc",
      });
    } else {
      updateQueryParams({ view: newValue, page: 1 });
    }
  };

  const { pokemons, paginationData, loading, refetch } = usePokemons(
    page,
    limit,
    sortOrder as "asc" | "desc",
    filterType,
    view
  );

  return (
    <div>
      <Typography variant="h4" mb={4} gutterBottom>
        <Tabs value={view} onChange={handleTabChange} centered>
          <Tab label="All" value="all" />
          <Tab label="My Pokemon" value="my_pokemon" />
        </Tabs>
      </Typography>

      {/* Filter by Type */}
      <FormControl
        variant="outlined"
        style={{ marginBottom: "16px", width: "200px" }}
      >
        <InputLabel>Filter by Type</InputLabel>
        <Select
          value={filterType}
          onChange={(e) =>
            updateQueryParams({ filterType: e.target.value, page: 1 })
          }
          label="Filter by Type"
        >
          <MenuItem value="">All Types</MenuItem>
          <MenuItem value="fire">Fire</MenuItem>
          <MenuItem value="water">Water</MenuItem>
          <MenuItem value="grass">Grass</MenuItem>
          <MenuItem value="normal">Normal</MenuItem>
          <MenuItem value="electric">Electric</MenuItem>
          <MenuItem value="ice">Ice</MenuItem>
          <MenuItem value="fighting">Fighting</MenuItem>
          <MenuItem value="poison">Poison</MenuItem>
          <MenuItem value="ground">Ground</MenuItem>
          <MenuItem value="flying">Flying</MenuItem>
          <MenuItem value="psychic">Psychic</MenuItem>
          <MenuItem value="bug">Bug</MenuItem>
          <MenuItem value="rock">Rock</MenuItem>
          <MenuItem value="ghost">Ghost</MenuItem>
          <MenuItem value="dragon">Dragon</MenuItem>
          <MenuItem value="dark">Dark</MenuItem>
          <MenuItem value="steel">Steel</MenuItem>
          <MenuItem value="fairy">Fairy</MenuItem>
        </Select>
      </FormControl>

      {/* Sort by Number */}
      <FormControl
        variant="outlined"
        style={{ marginBottom: "16px", width: "200px" }}
      >
        <InputLabel>Sort by Number</InputLabel>
        <Select
          value={sortOrder}
          id="sortOrder"
          onChange={(e) =>
            updateQueryParams({ sortOrder: e.target.value, page: 1 })
          }
          label="Sort by Number"
        >
          <MenuItem value="asc">Ascending</MenuItem>
          <MenuItem value="desc">Descending</MenuItem>
        </Select>
      </FormControl>

      {/* Items per page */}
      <FormControl variant="outlined" style={{ width: "200px" }}>
        <InputLabel>Items per page</InputLabel>
        <Select
          value={limit}
          onChange={(e) => updateQueryParams({ limit: e.target.value })}
          label="Items per page"
        >
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={20}>20</MenuItem>
        </Select>
      </FormControl>

      {/* Pokémon Cards */}
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <CircularProgress color="primary" />{" "}
          {/* Show the spinner while loading */}
        </div>
      ) : (
        <Grid container spacing={2}>
          {pokemons.map((pokemon: any) => (
            <Grid item key={pokemon.name} xs={12} sm={6} md={4}>
              <PokemonCard pokemon={pokemon} refetch={refetch} view={view} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Pagination */}
      {!loading && pokemons.length > 0 ? (
        <Pagination
          count={paginationData.total_pages}
          page={page}
          onChange={(_, value) => updateQueryParams({ page: value })}
          color="primary"
          shape="rounded"
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "center",
          }}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default PokemonList;
