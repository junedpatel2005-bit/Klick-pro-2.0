import "dotenv/config";

// Enforce Frontend Port 3000
process.env.PORT = process.env.PORT || "3000";
process.env.IS_FRONTEND = "true";

console.log("[Frontend] Starting Klick-pro UI on port " + process.env.PORT + " (proxying APIs to backend port 5000)...");

await import("../server.mjs");
