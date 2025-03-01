import React, { useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PokemonCard from "./PokemonCard";
import debounce from "lodash/debounce";
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
  Button,
  Box,
  TextField,
} from "@mui/material";
import usePokemons from "../hooks/usePokemons";

const typeOptions = [
  { label: "All Types", value: "" },
  { label: "Fire", value: "fire" },
  { label: "Water", value: "water" },
  { label: "Grass", value: "grass" },
  { label: "Normal", value: "normal" },
  { label: "Electric", value: "electric" },
  { label: "Ice", value: "ice" },
  { label: "Fighting", value: "fighting" },
  { label: "Poison", value: "poison" },
  { label: "Ground", value: "ground" },
  { label: "Flying", value: "flying" },
  { label: "Psychic", value: "psychic" },
  { label: "Bug", value: "bug" },
  { label: "Rock", value: "rock" },
  { label: "Ghost", value: "ghost" },
  { label: "Dragon", value: "dragon" },
  { label: "Dark", value: "dark" },
  { label: "Steel", value: "steel" },
  { label: "Fairy", value: "fairy" },
];

const sortOptions = [
  { label: "Ascending", value: "asc" },
  { label: "Descending", value: "desc" },
];

const limitOptions = [
  { label: "5", value: 5 },
  { label: "10", value: 10 },
  { label: "20", value: 20 },
];

const PokemonList = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const sortOrder = searchParams.get("sortOrder") || "asc";
  const filterType = searchParams.get("filterType") || "";
  const limit = Number(searchParams.get("limit")) || 10;
  const view = searchParams.get("view") || "all";
  const searchQuery = searchParams.get("query") || "";

  const [searchValue, setSearchValue] = useState(searchQuery);

  const updateQueryParams = (newParams: Record<string, string | number>) => {
    const updatedParams = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      updatedParams.set(key, String(value));
    });
    setSearchParams(updatedParams);
  };

  const clearSearchParams = () => {
    // we clear all except for the view
    setSearchParams({ view });
    setSearchValue("");
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    if (newValue === "my_pokemon") {
      updateQueryParams({
        view: newValue,
        page: 1,
        filterType: "",
        sortOrder: "asc",
        limit: 10,
        query: "",
      });
    } else {
      updateQueryParams({
        view: newValue,
        page: 1,
      });
    }
  };

  const debounceQuery = useCallback(
    debounce((inputValue: string) => {
      updateQueryParams({
        view,
        page: 1,
        filterType,
        sortOrder,
        limit,
        query: inputValue,
      });
    }, 500),
    [view, filterType, sortOrder, limit]
  );

  const handleSearchQuery = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const newInputValue = event.target.value;
      setSearchValue(newInputValue);

      if (newInputValue.length >= 2 || newInputValue === "") {
        debounceQuery(newInputValue);
      }
    },
    [debounceQuery]
  );

  const { pokemonData, paginationData, loading } = usePokemons(
    page,
    limit,
    sortOrder as "asc" | "desc",
    filterType,
    view,
    searchQuery
  );

  return (
    <div>
      <Typography variant="h4" mb={4} gutterBottom>
        <Tabs value={view} onChange={handleTabChange} centered>
          <Tab label="All" value="all" />
          <Tab label="My Pokemon" value="my_pokemon" />
        </Tabs>
      </Typography>

      {/* Search */}
      <Box display="flex" alignItems="center" gap={2} flexWrap="wrap" mb={2}>
        <FormControl variant="outlined" style={{ width: "400px" }}>
          <TextField
            id="search"
            label="Search"
            variant="outlined"
            value={searchValue}
            onChange={handleSearchQuery}
          />
        </FormControl>

        {/* Filter by Type */}
        <FormControl variant="outlined" style={{ width: "200px" }}>
          <InputLabel>Filter by Type</InputLabel>
          <Select
            value={filterType}
            onChange={(e) =>
              updateQueryParams({ filterType: e.target.value, page: 1 })
            }
            label="Filter by Type"
          >
            {typeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl variant="outlined" style={{ width: "200px" }}>
          <InputLabel>Sort by Number</InputLabel>
          <Select
            value={sortOrder}
            id="sortOrder"
            onChange={(e) =>
              updateQueryParams({ sortOrder: e.target.value, page: 1 })
            }
            label="Sort by Number"
          >
            {sortOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl variant="outlined" style={{ width: "200px" }}>
          <InputLabel>Items per page</InputLabel>
          <Select
            value={limit}
            onChange={(e) => updateQueryParams({ limit: e.target.value })}
            label="Items per page"
          >
            {limitOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          size="small"
          onClick={clearSearchParams}
          sx={{
            fontFamily: "'Press Start 2P', cursive",
            fontSize: "10px",
            minWidth: "35px",
          }}
        >
          x
        </Button>
      </Box>
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
          {pokemonData?.length > 0 ? (
            pokemonData.map((pokemon: any) => (
              <Grid item key={pokemon.name} xs={12} sm={6} md={4}>
                <PokemonCard pokemon={pokemon} view={view} />
              </Grid>
            ))
          ) : (
            <Grid
              item
              xs={12}
              style={{
                textAlign: "center",
                padding: "20px",
                marginBottom: "20px",
              }}
            >
              <Typography variant="h6" mt={8}>
                No Pokémon found...
              </Typography>
            </Grid>
          )}
        </Grid>
      )}

      {!loading && pokemonData?.length > 0 ? (
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
      ) : null}
    </div>
  );
};

export default PokemonList;
