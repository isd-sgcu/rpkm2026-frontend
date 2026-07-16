import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

import devTools from "./src/dev-toolbar/integration.ts";

export default defineConfig({
  site: "https://rpkm2026.com",
  integrations: [react(), devTools],
  vite: {
    plugins: [tailwindcss()],
  },
});
