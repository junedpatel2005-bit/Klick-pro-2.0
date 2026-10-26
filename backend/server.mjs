import "dotenv/config";

// Enforce Backend Port 5000
process.env.PORT = process.env.PORT || "5000";

console.log("[Backend] Starting Klick-pro backend services on port " + process.env.PORT + "...");

await import("../server.mjs");
