import path from "node:path";
import { pathToFileURL } from "node:url";

// Ensure process working directory is always the project root
const rootDir = path.resolve(import.meta.dirname, "..");
process.chdir(rootDir);

// Enforce Backend Port 5000
process.env.PORT = process.env.PORT || "5000";

console.log("[Backend] Starting Klick-pro backend services on port " + process.env.PORT + "...");

const rootServer = pathToFileURL(path.resolve(rootDir, "server.mjs")).href;
await import(rootServer);
