import type { AstroIntegration } from "astro";
import { loadEnv } from "vite";

/**
 * Registers the RPKM dev tools app in the Astro dev toolbar and serves the
 * dev API key from the frontend `.env` (`DEV_API_KEY`, same value as the
 * backend) over the toolbar server channel, so nothing is persisted in the
 * browser.
 */
export default {
  name: "rpkm-dev-tools",
  hooks: {
    "astro:config:setup": ({ addDevToolbarApp }) => {
      addDevToolbarApp({
        id: "rpkm-dev-tools",
        name: "RPKM Dev Tools",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6"/><path d="M22 11h-6"/></svg>`,
        entrypoint: new URL("./app.ts", import.meta.url),
      });
    },
    "astro:server:setup": ({ toolbar }) => {
      toolbar.on("rpkm-dev:get-key", () => {
        const env = loadEnv(
          process.env.NODE_ENV ?? "development",
          process.cwd(),
          "",
        );
        toolbar.send("rpkm-dev:key", { key: env.DEV_API_KEY ?? "" });
      });
    },
  },
} satisfies AstroIntegration;
