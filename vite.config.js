import { defineConfig } from "vite";

export default defineConfig({
  root: ".",
  build: {
    outDir: "./dist",
    emptyOutDir: true,
    sourcemap: true,
  },
  server: {
    watch: {
      usePolling: true, // Change it's to true
    },
  },
});
