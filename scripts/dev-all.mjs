import { spawn } from "node:child_process";

console.log("\n=======================================================");
console.log("  Launching Klick-pro 2-Tier Architecture");
console.log("  Backend  -> http://localhost:5000 (API & Realtime)");
console.log("  Frontend -> http://localhost:3000 (UI Views)");
console.log("=======================================================\n");

const backend = spawn("node", ["backend/server.mjs"], {
  stdio: ["inherit", "pipe", "pipe"],
  shell: true,
  env: { ...process.env, PORT: "5000" },
});

backend.stdout.on("data", (data) => {
  process.stdout.write(`\x1b[36m[Backend:5000]\x1b[0m ${data}`);
});
backend.stderr.on("data", (data) => {
  process.stderr.write(`\x1b[31m[Backend:5000 ERROR]\x1b[0m ${data}`);
});

const frontend = spawn("node", ["frontend/server.mjs"], {
  stdio: ["inherit", "pipe", "pipe"],
  shell: true,
  env: { ...process.env, PORT: "3000", IS_FRONTEND: "true" },
});

frontend.stdout.on("data", (data) => {
  process.stdout.write(`\x1b[32m[Frontend:3000]\x1b[0m ${data}`);
});
frontend.stderr.on("data", (data) => {
  process.stderr.write(`\x1b[31m[Frontend:3000 ERROR]\x1b[0m ${data}`);
});

function shutdown() {
  console.log("\nShutting down both Frontend & Backend...");
  backend.kill();
  frontend.kill();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
