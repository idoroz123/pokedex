import React from "react";
import {
  AppBar,
  Container,
  Toolbar,
  Typography,
  IconButton,
} from "@mui/material";
import PokemonList from "./components/PokemonList";
import "./assets/fonts.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ThemeToggle from "./components/ThemeToggle";

const App: React.FC = () => {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h3" align="center" style={{ flexGrow: 1 }}>
            Welcome to the Pokédex!
          </Typography>
          <IconButton edge="end" color="inherit" aria-label="theme toggle">
            <ThemeToggle />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<PokemonList />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
