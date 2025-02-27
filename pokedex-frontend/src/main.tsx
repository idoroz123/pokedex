import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProviderWrapper } from "./theme/ThemeContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <ThemeProviderWrapper>
    <App />
  </ThemeProviderWrapper>
);
