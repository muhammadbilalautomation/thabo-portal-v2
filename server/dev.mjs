import { spawn } from "node:child_process";
const api = spawn(process.execPath, ["server/index.mjs"], { stdio: "inherit" });
const vite = spawn(process.platform === "win32" ? "pnpm.cmd" : "pnpm", ["run", "dev:web"], { stdio: "inherit", shell: process.platform === "win32" });
const stop = () => { api.kill(); vite.kill(); };
process.on("SIGINT", stop);
process.on("SIGTERM", stop);

