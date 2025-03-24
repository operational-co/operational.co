import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    minify: false,
    outDir: "build",
    lib: {
      name: "Operational",
      entry: resolve(__dirname, "src/index.js"),
      fileName: (format) => `index.${format}.js`
    }
    // rollupOptions: {
    //   external: ["axios"], // Externalize Axios
    //   output: {
    //     globals: {
    //       axios: "axios" // Make sure `axios` is available as a global variable
    //     }
    //   }
    // }
  }
});
