import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({ plugins: [react()], server: { proxy: { "/api/knowledge": "http://127.0.0.1:8787", "/api/voice": "http://127.0.0.1:8787" } } });

