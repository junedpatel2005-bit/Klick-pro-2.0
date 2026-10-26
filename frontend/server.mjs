import path from "node:path";
import { pathToFileURL } from "node:url";

// Ensure process working directory is always the project root
const rootDir = path.resolve(import.meta.dirname, "..");
process.chdir(rootDir);

// Enforce Frontend Port 3000
process.env.PORT = process.env.PORT || "3000";
process.env.IS_FRONTEND = "true";

console.log("[Frontend] Starting Klick-pro UI on port " + process.env.PORT + " (proxying APIs to backend port 5000)...");

const rootServer = pathToFileURL(path.resolve(rootDir, "server.mjs")).href;
await import(rootServer);
