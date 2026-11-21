/**
 * ============================================================================
 * KLICK-PRO DATABASE CLEANUP & RESET SCRIPT
 * ============================================================================
 * 
 * PURPOSE:
 *   Wipes all operational test data (test users, jobs, bids, milestones, 
 *   disputes, messages, notifications, payments, and wallets) to give you a 
 *   fresh, clean marketplace database for production launch.
 * 
 * STRICT SAFETY RULE (RULE 7):
 *   SERVICE CATEGORIES ARE NEVER DELETED UNDER ANY CIRCUMSTANCE.
 *   - ServiceCategory and Service tables are 100% protected and untouched.
 *   - Admin accounts (role = 'ADMIN') are preserved so you can always log in.
 *   - Platform settings, email templates, and FAQs remain safe.
 * 
 * HOW TO RUN:
 *   node "C:\Users\juned\Desktop\wipe_data_preserve_categories.mjs"
 *   (or pass --force to run without the interactive prompt)
 * ============================================================================
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';

// 1. Locate and read the project .env to get DATABASE_URL
const PROJECT_DIR = 'D:/Klick-pro';
const ENV_PATH = path.join(PROJECT_DIR, '.env');

if (!fs.existsSync(ENV_PATH)) {
  console.error(`\x1b[31m[ERROR] Cannot find .env file at ${ENV_PATH}\x1b[0m`);
  process.exit(1);
}

// Simple human-readable .env parser
function loadEnv(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const env = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      env[key] = val;
    }
  }
  return env;
}

const envVars = loadEnv(ENV_PATH);
const databaseUrl = envVars.DATABASE_URL;

if (!databaseUrl) {
  console.error('\x1b[31m[ERROR] DATABASE_URL is not defined in your .env file.\x1b[0m');
  process.exit(1);
}

// 2. Dynamically import pg from the project node_modules
const pgPath = path.join(PROJECT_DIR, 'node_modules', 'pg', 'lib', 'index.js');
let pgModule;
try {
  pgModule = await import(`file:///${pgPath.replace(/\\/g, '/')}`);
} catch {
  try {
    pgModule = await import('pg');
  } catch (err) {
    console.error(`\x1b[31m[ERROR] Could not load 'pg' client module. Ensure D:\\Klick-pro\\node_modules is intact.\x1b[0m`, err);
    process.exit(1);
  }
}

const { Pool } = pgModule.default || pgModule;
const pool = new Pool({ connectionString: databaseUrl });

// 3. Define what is wiped and what is strictly preserved
const TABLES_TO_WIPE = [
  // Disputes & Claims
  'project_dispute_messages',
  'ProjectDispute',
  
  // Reviews & Feedback
  'ProjectReviewRequest',
  'ProjectRevisionRequest',
  'ProjectCompletionRequest',
  'ProjectReview',
  
  // Milestones & Work Submissions
  'ProjectWorkUpload',
  'ProjectTimelineEvent',
  'ProjectMilestone',
  'ClientJobMilestone',
  
  // Proposals & Negotiations
  'ProjectNegotiation',
  'ProjectRequest',
  'ProjectTracking',
  
  // Jobs & Attachments
  'FavoriteJob',
  'ClientJobAttachment',
  'ClientJob',
  'ClientHiringNeed',
  'SavedProfessional',
  
  // Transactions, Escrow & Wallets
  'ProjectTransaction',
  'Payment',
  'razorpay_webhook_events',
  'ProjectWithdrawal',
  'WalletTransaction',
  'Wallet',
  'invoices',
  
  // Communications & Live Chat
  'SocketMessage',
  'SocketConversationClear',
  'SocketConversation',
  'CallSession',
  'Message',
  'MessageConversation',
  
  // Notifications & Subscriptions
  'UserNotificationState',
  'UserNotification',
  'BrowserSubscription',
  
  // Verifications & KYC
  'verification_document_reviews',
  'persona_verifications',
  'persona_webhook_events',
  'ProfessionalVerification',
  
  // User Sessions & Auth Logs
  'StoredFile',
  'audit_logs',
  'ApiToken',
  'OtpCode',
  'sessions',
  'user_linked_accounts',
  'ClientSavedLocation',
  'ClientProfile',
  'ContactRequest',
];

async function main() {
  console.log('\n\x1b[36m====================================================================\x1b[0m');
  console.log('\x1b[1m\x1b[33m           KLICK-PRO DATABASE CLEANUP & RESET TOOL                 \x1b[0m');
  console.log('\x1b[36m====================================================================\x1b[0m\n');

  // Verify connection
  const client = await pool.connect();
  let preCategoriesCount = 0;
  let preUsersCount = 0;
  let adminAccounts = [];

  try {
    const catRes = await client.query('SELECT COUNT(*)::int AS count FROM "ServiceCategory";');
    preCategoriesCount = catRes.rows[0].count;

    const userRes = await client.query('SELECT COUNT(*)::int AS count FROM "User";');
    preUsersCount = userRes.rows[0].count;

    const adminRes = await client.query('SELECT id, email, username FROM "User" WHERE role = \'ADMIN\';');
    adminAccounts = adminRes.rows;
  } catch (err) {
    console.error('\x1b[31m[ERROR] Failed to query database:\x1b[0m', err.message);
    client.release();
    process.exit(1);
  }

  console.log('\x1b[32m✔ Connected to PostgreSQL database successfully.\x1b[0m\n');
  console.log('\x1b[1mCURRENT DATABASE STATUS:\x1b[0m');
  console.log(` • \x1b[32mService Categories:\x1b[0m   ${preCategoriesCount} (STRICTLY PROTECTED - Will NEVER be touched)`);
  console.log(` • \x1b[33mTotal Users in DB:\x1b[0m    ${preUsersCount}`);
  console.log(` • \x1b[36mAdmin Users Kept:\x1b[0m     ${adminAccounts.length} (${adminAccounts.map(a => a.email).join(', ')})`);
  console.log('\n\x1b[1mWHAT THIS SCRIPT WILL DO:\x1b[0m');
  console.log(' [1] \x1b[31mDelete\x1b[0m all test jobs, proposals, milestones, transactions, and reviews.');
  console.log(' [2] \x1b[31mDelete\x1b[0m all client/professional chat messages, calls, and notifications.');
  console.log(' [3] \x1b[31mDelete\x1b[0m test client and professional accounts (clears test users).');
  console.log(' [4] \x1b[32mPRESERVE 100%\x1b[0m of Service Categories, subcategories, and service catalog.');
  console.log(' [5] \x1b[32mPRESERVE 100%\x1b[0m of Admin accounts, platform settings, and FAQs.');

  const isForce = process.argv.includes('--force');

  if (!isForce) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const answer = await new Promise((resolve) => {
      rl.question('\n\x1b[1m\x1b[33mAre you sure you want to proceed with the database reset? Type "YES" to confirm: \x1b[0m', (ans) => {
        rl.close();
        resolve(ans.trim());
      });
    });

    if (answer !== 'YES') {
      console.log('\n\x1b[33m[CANCELLED] Database cleanup aborted by user. Nothing was modified.\x1b[0m\n');
      client.release();
      await pool.end();
      process.exit(0);
    }
  }

  console.log('\n\x1b[34m[STARTING] Beginning clean wipe...\x1b[0m\n');

  try {
    await client.query('BEGIN;');

    // Step A: Disconnect foreign key references from User to ServiceCategory
    console.log(' • Disconnecting category foreign references from test users...');
    await client.query('UPDATE "User" SET "professional_primary_category_id" = NULL;');

    // Step B: Clean operational tables
    let totalDeletedTables = 0;
    for (const table of TABLES_TO_WIPE) {
      try {
        const delRes = await client.query(`DELETE FROM "${table}";`);
        console.log(`   ✔ Cleared table "${table}" (${delRes.rowCount ?? 0} rows deleted)`);
        totalDeletedTables++;
      } catch (tableErr) {
        // Table might not exist or be empty, continue gracefully
        console.log(`   ⚠ Skipped table "${table}" (${tableErr.message})`);
      }
    }

    // Step C: Delete all non-admin users (preserve admin accounts)
    console.log(' • Removing test clients and professionals (preserving admin)...');
    const userDelRes = await client.query("DELETE FROM \"User\" WHERE role != 'ADMIN';");
    console.log(`   ✔ Removed ${userDelRes.rowCount ?? 0} test user accounts. Admin account(s) preserved.`);

    // Step D: Strictly verify that ServiceCategory count has NOT changed
    const postCatRes = await client.query('SELECT COUNT(*)::int AS count FROM "ServiceCategory";');
    const postCategoriesCount = postCatRes.rows[0].count;

    if (postCategoriesCount !== preCategoriesCount) {
      throw new Error(`CRITICAL INTEGRITY FAILURE: Category count changed from ${preCategoriesCount} to ${postCategoriesCount}. Rolling back!`);
    }

    await client.query('COMMIT;');

    console.log('\n\x1b[32m====================================================================\x1b[0m');
    console.log('\x1b[1m\x1b[32m       ✔ SUCCESS: DATABASE RESET COMPLETED SAFELY!                  \x1b[0m');
    console.log('\x1b[32m====================================================================\x1b[0m\n');
    console.log(` • \x1b[1m\x1b[32mService Categories:\x1b[0m  ${postCategoriesCount} intact (100% Preserved)`);
    console.log(` • \x1b[1m\x1b[36mAdmin User:\x1b[0m          Preserved (${adminAccounts.map(a => a.email).join(', ')})`);
    console.log(` • \x1b[1m\x1b[33mOperational Tables:\x1b[0m  Cleaned (${totalDeletedTables} tables reset)`);
    console.log('\nYour marketplace database is now fresh and ready for clean testing or production launch.\n');

  } catch (err) {
    await client.query('ROLLBACK;');
    console.error('\n\x1b[31m[FAILED] Error during cleanup. All changes were ROLLED BACK safely:\x1b[0m', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error('\x1b[31mFatal error:\x1b[0m', err);
  process.exit(1);
});
