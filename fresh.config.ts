import { defineConfig } from "$fresh/server.ts";
import tailwind from "$fresh/plugins/tailwind.ts";

export default defineConfig({
  plugins: [tailwind()],
  static: {
    prefix: "/static/",
    generate: true,
    outDir: "dist",
  },
  build: {
    target: ["es2021", "chrome100", "safari13"],
    minify: true,
  },
  server: {
    port: 8000,
    hostname: "0.0.0.0",
  },
  deploy: {
    entrypoint: "./main.ts",
    static: true,
  },
});
