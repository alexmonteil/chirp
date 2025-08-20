import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  // server: {
  //   proxy: {
  //     "/api": {
  //       target: "http://server:3000",
  //       changeOrigin: true,
  //     },
  //   },
  //   fs: {
  //     allow: ["../packages"],
  //   },
  // },
  // resolve: {
  //   alias: {
  //     "@": path.resolve(__dirname, "./src"),
  //     "@shared": path.resolve(__dirname, "../packages/"),
  //   },
  // },
});
