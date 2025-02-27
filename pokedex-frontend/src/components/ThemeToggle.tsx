// src/components/ThemeToggle.tsx
import { useContext } from "react";
import { ThemeContext } from "../theme/ThemeContext";
import { styled, Switch } from "@mui/material";
import { LightMode, DarkMode } from "@mui/icons-material";

const ThemeSwitch = styled(Switch)(({ theme }) => ({
  width: 50,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 2,
    "&.Mui-checked": {
      transform: "translateX(24px)",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.mode === "dark" ? "#ffd700" : "#333", // Gold for dark, dark gray for light
      },
    },
  },
  "& .MuiSwitch-thumb": {
    width: 22,
    height: 22,
    backgroundColor: theme.palette.mode === "dark" ? "#f57c00" : "#90caf9", // Orange for dark, blue for light
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "dark" ? "#555" : "#ddd",
  },
}));

const ThemeToggle = () => {
  const themeContext = useContext(ThemeContext);
  if (!themeContext) return null;

  const { toggleTheme, darkMode } = themeContext;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <LightMode color="primary" />
      <ThemeSwitch checked={darkMode} onChange={toggleTheme} />
      <DarkMode color="warning" />
    </div>
  );
};

export default ThemeToggle;
