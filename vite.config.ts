import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

// Recreate __dirname and __filename for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "client", "src"),
            "@shared": path.resolve(__dirname, "shared"),
            "@assets": path.resolve(__dirname, "attached_assets"),
        },
    },
    root: path.resolve(__dirname, "client"), // your main client folder
    build: {
        outDir: path.resolve(__dirname, "dist", "public"), // output folder
        emptyOutDir: true, // clear dist before build
    },
    server: {
        fs: {
            // allow serving files only from project root
            allow: [__dirname],
            deny: ["**/.*"], // deny hidden files
        },
    },
});
