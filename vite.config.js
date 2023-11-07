import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  define: {
    "process.env.BABEL_TYPES_8_BREAKING": "false",
    "Buffer.isBuffer": (...args) => true,
    "process.platform": "'linux'",
  },
});
