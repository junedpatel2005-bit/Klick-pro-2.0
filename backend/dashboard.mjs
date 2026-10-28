/**
 * Generates the HTML for the Klick-Pro Backend Control & API Dashboard
 */
export async function getBackendDashboardHtml(req, options = {}) {
  const { port = 5000, dbPool = null, uptimeSeconds = Math.floor(process.uptime()) } = options;

  let dbStatus = "Not Configured";
  let dbConnected = false;
  let dbLatency = null;

  if (dbPool) {
    try {
      const started = Date.now();
      await dbPool.query("SELECT 1");
      dbLatency = Date.now() - started;
      dbConnected = true;
      dbStatus = `Connected (${dbLatency}ms)`;
    } catch (err) {
      dbConnected = false;
      dbStatus = `Disconnected (${err instanceof Error ? err.message : "Error"})`;
    }
  } else if (process.env.DATABASE_URL) {
    dbStatus = "Database configured (pool initializing)";
  }

  const hours = Math.floor(uptimeSeconds / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = uptimeSeconds % 60;
  const formattedUptime = `${hours}h ${minutes}m ${seconds}s`;

  const memoryUsage = process.memoryUsage();
  const memoryMB = Math.round(memoryUsage.rss / 1024 / 1024);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Klick-Pro Backend & API Gateway (Port ${port})</title>
  <link rel="icon" href="/favicon.ico">
  <style>
    :root {
      --bg: #090d16;
      --card-bg: #111827;
      --card-border: #1f2937;
      --primary: #3b82f6;
      --primary-hover: #2563eb;
      --success: #10b981;
      --warning: #f59e0b;
      --danger: #ef4444;
      --text: #f9fafb;
      --text-muted: #9ca3af;
      --code-bg: #030712;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: radial-gradient(circle at 50% 0%, #1e293b 0%, var(--bg) 70%);
      color: var(--text);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    header {
      border-bottom: 1px solid var(--card-border);
      background: rgba(17, 24, 39, 0.8);
      backdrop-filter: blur(12px);
      position: sticky;
      top: 0;
      z-index: 50;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .brand-badge {
      background: #1e3a8a;
      color: #93c5fd;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.25rem 0.6rem;
      border-radius: 9999px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .brand-title {
      font-size: 1.25rem;
      font-weight: 700;
      letter-spacing: -0.02em;
    }
    .nav-actions {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s ease;
      cursor: pointer;
      border: 1px solid transparent;
    }
    .btn-primary {
      background: var(--primary);
      color: #fff;
    }
    .btn-primary:hover {
      background: var(--primary-hover);
      box-shadow: 0 0 15px rgba(59, 130, 246, 0.4);
    }
    .btn-outline {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--card-border);
      color: var(--text);
    }
    .btn-outline:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: var(--text-muted);
    }
    .container {
      max-width: 1200px;
      margin: 2rem auto;
      padding: 0 1.5rem;
      flex: 1;
      width: 100%;
    }
    .hero {
      margin-bottom: 2rem;
      text-align: center;
    }
    .hero h1 {
      font-size: 2.25rem;
      font-weight: 800;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, #60a5fa, #a78bfa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .hero p {
      color: var(--text-muted);
      font-size: 1.1rem;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 1.25rem;
      margin-bottom: 2rem;
    }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 0.75rem;
      padding: 1.25rem;
      position: relative;
      overflow: hidden;
    }
    .card-label {
      font-size: 0.8rem;
      text-transform: uppercase;
      font-weight: 600;
      color: var(--text-muted);
      margin-bottom: 0.5rem;
      letter-spacing: 0.05em;
    }
    .card-value {
      font-size: 1.5rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .status-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      display: inline-block;
    }
    .status-online {
      background-color: var(--success);
      box-shadow: 0 0 10px var(--success);
    }
    .status-offline {
      background-color: var(--danger);
      box-shadow: 0 0 10px var(--danger);
    }
    .section-title {
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .table-container {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 0.75rem;
      overflow-x: auto;
      margin-bottom: 2rem;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 0.875rem;
    }
    th {
      background: rgba(255, 255, 255, 0.03);
      padding: 0.875rem 1.25rem;
      color: var(--text-muted);
      font-weight: 600;
      border-bottom: 1px solid var(--card-border);
    }
    td {
      padding: 0.875rem 1.25rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    tr:last-child td { border-bottom: none; }
    .badge {
      display: inline-block;
      padding: 0.2rem 0.5rem;
      border-radius: 0.375rem;
      font-size: 0.75rem;
      font-weight: 700;
      font-family: monospace;
    }
    .badge-get { background: #064e3b; color: #6ee7b7; }
    .badge-post { background: #1e3a8a; color: #93c5fd; }
    .badge-put { background: #78350f; color: #fde68a; }
    .badge-ws { background: #581c87; color: #e9d5ff; }
    .code-path {
      font-family: monospace;
      color: #93c5fd;
      text-decoration: none;
    }
    .code-path:hover {
      text-decoration: underline;
    }
    footer {
      border-top: 1px solid var(--card-border);
      padding: 1.5rem;
      text-align: center;
      color: var(--text-muted);
      font-size: 0.85rem;
    }
  </style>
</head>
<body>
  <header>
    <div class="brand">
      <span class="brand-title">Klick-Pro</span>
      <span class="brand-badge">Backend Core</span>
    </div>
    <div class="nav-actions">
      <a href="http://localhost:3000" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
        🚀 View Frontend Website (Port 3000)
      </a>
      <a href="http://localhost:3000/admin" target="_blank" rel="noopener noreferrer" class="btn btn-outline">
        🛡️ Admin Portal
      </a>
      <button onclick="window.location.reload()" class="btn btn-outline">
        🔄 Refresh Status
      </button>
    </div>
  </header>

  <div class="container">
    <div class="hero">
      <h1>Backend API & Realtime Gateway</h1>
      <p>Dedicated backend microservice handling all business logic, database queries, and live WebSockets.</p>
    </div>

    <div class="grid">
      <div class="card">
        <div class="card-label">Server Status</div>
        <div class="card-value">
          <span class="status-dot status-online"></span>
          <span>Online (Port ${port})</span>
        </div>
      </div>

      <div class="card">
        <div class="card-label">Database Connection</div>
        <div class="card-value">
          <span class="status-dot ${dbConnected ? "status-online" : "status-offline"}"></span>
          <span style="font-size: 1.1rem">${dbStatus}</span>
        </div>
      </div>

      <div class="card">
        <div class="card-label">Realtime Socket.IO</div>
        <div class="card-value">
          <span class="status-dot status-online"></span>
          <span style="font-size: 1.1rem">Active (/api/realtime)</span>
        </div>
      </div>

      <div class="card">
        <div class="card-label">Process Health</div>
        <div class="card-value" style="font-size: 1.1rem">
          <span>Uptime: ${formattedUptime}</span>
        </div>
        <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.25rem">
          Memory: ${memoryMB} MB | Node ${process.version}
        </div>
      </div>
    </div>

    <div class="section-title">
      📡 Core API Endpoints & Realtime Services
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Protocol</th>
            <th>Endpoint Route</th>
            <th>Service Module</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><span class="badge badge-ws">WS</span></td>
            <td><span class="code-path">/api/realtime</span></td>
            <td>Socket.IO Gateway</td>
            <td>Real-time messaging, instant notifications, and job state synchronization</td>
          </tr>
          <tr>
            <td><span class="badge badge-get">GET</span></td>
            <td><a href="/api/backend-status" target="_blank" class="code-path">/api/backend-status</a></td>
            <td>Health Check</td>
            <td>Live JSON health metrics (DB connectivity, uptime, memory)</td>
          </tr>
          <tr>
            <td><span class="badge badge-get">GET</span></td>
            <td><span class="code-path">/api/auth/*</span></td>
            <td>Authentication</td>
            <td>Session validation, JWT issuance, OTP verification, and password resets</td>
          </tr>
          <tr>
            <td><span class="badge badge-get">GET</span></td>
            <td><span class="code-path">/api/client/*</span></td>
            <td>Client Operations</td>
            <td>Client jobs, proposal evaluation, escrow milestone releases, and profile</td>
          </tr>
          <tr>
            <td><span class="badge badge-get">GET</span></td>
            <td><span class="code-path">/api/professional/*</span></td>
            <td>Professional Suite</td>
            <td>Proposals, gig submissions, earnings, bank accounts, and verification</td>
          </tr>
          <tr>
            <td><span class="badge badge-get">GET</span></td>
            <td><span class="code-path">/api/admin/*</span></td>
            <td>Administration</td>
            <td>Platform moderation, disputes, user verification, finance, and CMS</td>
          </tr>
          <tr>
            <td><span class="badge badge-post">POST</span></td>
            <td><span class="code-path">/api/payments/*</span></td>
            <td>Escrow & Payouts</td>
            <td>Razorpay order creation, Webhook validation, and RazorpayX payouts</td>
          </tr>
          <tr>
            <td><span class="badge badge-get">GET</span></td>
            <td><span class="code-path">/api/marketplace/*</span></td>
            <td>Catalog & Search</td>
            <td>Service categories, professional directory, and geocoded search</td>
          </tr>
          <tr>
            <td><span class="badge badge-get">GET</span></td>
            <td><span class="code-path">/api/cron/*</span></td>
            <td>Automated Cron</td>
            <td>Milestone validity checks and auto-escrow release background worker</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div style="background: rgba(30, 58, 138, 0.2); border: 1px solid #1e40af; border-radius: 0.75rem; padding: 1.25rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap;">
      <div>
        <h3 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 0.25rem;">Looking for the customer or client website?</h3>
        <p style="color: var(--text-muted); font-size: 0.9rem;">The user-facing website runs on Port 3000. Click the button to switch to the Frontend application.</p>
      </div>
      <a href="http://localhost:3000" class="btn btn-primary" style="white-space: nowrap;">
        Open Frontend Website (Port 3000) &rarr;
      </a>
    </div>
  </div>

  <footer>
    Klick-Pro Architecture v2.0 &bull; Running Backend on Port ${port} &bull; Frontend on Port 3000
  </footer>
</body>
</html>`;
}
