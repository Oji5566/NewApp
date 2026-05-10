import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Set `base` to the repository name so that asset URLs resolve correctly
// when the app is served from https://<user>.github.io/NewApp/.
// For local dev (`vite` / `vite preview`) the base is "/" as usual.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === "build" ? "/NewApp/" : "/",
}));
