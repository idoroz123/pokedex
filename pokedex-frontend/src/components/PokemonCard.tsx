import { useState } from "react";
import { Card, CardContent, Typography, Box, Button } from "@mui/material";
import { capturePokemon } from "../api/pokemonAPI";
import fireBackgroundImage from "../assets/fire_bg.jpg";
import waterBackgroundImage from "../assets/water_bg.jpg";
import { grey, lightGreen } from "@mui/material/colors";

// Pokémon Props
type PokemonProps = {
  id: number;
  name: string;
  type_one: string;
  type_two: string;
  image_name: string;
  attack: number;
  defense: number;
  special_attack: number;
  special_defense: number;
  speed: number;
  hit_points: number;
  total: number;
  legendary: boolean;
  generation: number;
  number: number;
};

type PokemonCardProps = {
  pokemon?: PokemonProps;
  refetch: () => void;
  view: string;
};

const typeColors: { [key: string]: string } = {
  fire: "#FF9C54",
  water: "#4592C4",
  grass: "#78C850",
  normal: "#A8A878",
  electric: "#FFD700",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
  fairy: "#EE99AC",
  default: "#A8A8A8",
};

const PokemonCard = ({ pokemon, refetch, view }: PokemonCardProps) => {
  const [captured, setCaptured] = useState(false);
  const isMyPokemon = view === "my_pokemon";
  const capturedText = view === "my_pokemon" ? "" : "Captured";

  const handleCapture = async () => {
    if (!pokemon) return;
    try {
      await capturePokemon(pokemon.number);
      setCaptured(true);
      refetch();
    } catch (error) {
      console.error("Capture failed:", error);
    }
  };

  const getTypeGradient = (type: string) => {
    const color = typeColors[type.toLowerCase() || "default"];
    const darkerColor = `${color}80`;
    return `linear-gradient(to bottom, ${color}, ${darkerColor})`;
  };

  return (
    <Card
      sx={{
        width: 320,
        height: 420,
        borderRadius: "12px",
        border: "6px solid black",
        background: pokemon
          ? getTypeGradient(pokemon.type_one)
          : typeColors.default,
        boxShadow: "10px 10px 0px rgba(0,0,0,0.3)",
        textAlign: "center",
        padding: "10px",
        position: "relative",
      }}
    >
      {/* Name and Number */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "rgba(0, 0, 0, 0.7)",
          borderRadius: "8px",
          padding: "6px",
          color: "white",
        }}
      >
        <Typography
          sx={{
            fontFamily: "'Press Start 2P', cursive",
            fontSize: "10px",
            fontWeight: "bold",
          }}
        >
          {pokemon?.name}
        </Typography>
        <Typography
          sx={{ fontFamily: "'Press Start 2P', cursive", fontSize: "10px" }}
        >
          #{pokemon?.number}
        </Typography>
      </Box>

      {/* Pokémon Image */}
      <Box
        sx={{
          width: "100%",
          height: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // backgroundImage: `url(${backgroundImages[pokemon?.type_one.toLowerCase() || "default"]})`, // Using the imported image
          // backgroundSize: "cover", // Ensures the image covers the whole box
          // backgroundPosition: "center", // Centers the image
          backgroundColor: "lightgrey",
          borderRadius: "8px",
          marginTop: "10px",
        }}
      >
        <img
          src={`https://img.pokemondb.net/sprites/home/normal/${pokemon?.image_name}.png`}
          alt={pokemon?.name}
          style={{ width: "150px", height: "150px", objectFit: "contain" }}
        />
      </Box>

      {/* Pokémon Type */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: "5px",
          marginTop: "10px",
        }}
      >
        <Typography
          sx={{
            background:
              typeColors[pokemon?.type_one.toLowerCase() || "default"],
            color: "white",
            borderRadius: "8px",
            padding: "4px 8px",
          }}
        >
          {pokemon?.type_one}
        </Typography>
        {pokemon?.type_two && (
          <Typography
            sx={{
              background:
                typeColors[pokemon?.type_two.toLowerCase() || "default"],
              color: "white",
              borderRadius: "8px",
              padding: "4px 8px",
            }}
          >
            {pokemon?.type_two}
          </Typography>
        )}
      </Box>

      {/* Pokémon Stats */}
      <CardContent
        sx={{
          padding: "8px",
          fontSize: "12px",
        }}
      >
        <Box display="flex" justifyContent="space-between" textAlign="left">
          {/* Left Column */}
          <Box>
            <Typography>HP: {pokemon?.hit_points}</Typography>
            <Typography>Attack: {pokemon?.attack}</Typography>
            <Typography>Defense: {pokemon?.defense}</Typography>
          </Box>
          {/* Right Column */}
          <Box>
            <Typography>Sp. Attack: {pokemon?.special_attack}</Typography>
            <Typography>Sp. Defense: {pokemon?.special_defense}</Typography>
            <Typography>Speed: {pokemon?.speed}</Typography>
          </Box>
        </Box>
      </CardContent>

      {/* Total & Generation */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          background: "rgba(0, 0, 0, 0.7)",
          color: "white",
          padding: "5px",
          borderRadius: "8px",
          fontSize: "12px",
        }}
      >
        <Typography>Total: {pokemon?.total}</Typography>
        <Typography>Gen: {pokemon?.generation}</Typography>
      </Box>

      {/* Capture Button */}
      {!captured ? (
        <Button
          variant="contained"
          size="small"
          onClick={handleCapture}
          sx={{
            fontFamily: "'Press Start 2P', cursive",
            fontSize: "10px",
            marginTop: "10px",
            background: "#ffcc00",
            color: "black",
            "&:hover": { background: "#ffdb4d" },
          }}
        >
          Capture!
        </Button>
      ) : (
        <Typography
          sx={{ fontSize: "12px", color: "white", marginTop: "10px" }}
        >
          {capturedText}
        </Typography>
      )}
    </Card>
  );
};

export default PokemonCard;
