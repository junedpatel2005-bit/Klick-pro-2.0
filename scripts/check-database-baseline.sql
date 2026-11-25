-- Read-only baseline diagnostics. Run with psql against the target database.
SELECT migration_name, started_at, finished_at, rolled_back_at
FROM "_prisma_migrations"
ORDER BY started_at;

SELECT table_schema, table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Read-only preflight for relationship constraints.
SELECT p.id
FROM payments p
LEFT JOIN users c ON c.id = p."clientId"
WHERE c.id IS NULL;

SELECT p.id
FROM payments p
LEFT JOIN users u ON u.id = p."professionalId"
WHERE u.id IS NULL;

SELECT pt.id
FROM project_trackings pt
LEFT JOIN project_requests pr ON pr.id = pt."requestId"
WHERE pr.id IS NULL;

SELECT pm.id
FROM project_milestones pm
LEFT JOIN project_trackings pt ON pt.id = pm."trackingId"
WHERE pt.id IS NULL;

SELECT e.id FROM project_timeline_events e
LEFT JOIN project_trackings pt ON pt.id = e."trackingId"
WHERE pt.id IS NULL;

SELECT w.id FROM project_work_uploads w
LEFT JOIN project_trackings pt ON pt.id = w."trackingId"
WHERE pt.id IS NULL;

SELECT w.id FROM project_work_uploads w
LEFT JOIN project_milestones pm ON pm.id = w."milestoneId"
WHERE w."milestoneId" IS NOT NULL AND pm.id IS NULL;

SELECT s.id FROM services s
LEFT JOIN service_categories c ON c.id = s."categoryId"
WHERE c.id IS NULL;

SELECT "clientProfileId", COUNT(*) AS primary_count
FROM client_saved_locations
WHERE "isPrimary" = true
GROUP BY "clientProfileId"
HAVING COUNT(*) > 1;

SELECT "userId", COUNT(*) AS profile_count
FROM client_profiles
GROUP BY "userId"
HAVING COUNT(*) > 1;

-- Every column converted by 202608200005_integer_money_fields.
SELECT id, budget_min, 'hire_jobs.budget_min' AS source_column
FROM hire_jobs
WHERE budget_min IS NOT NULL AND budget_min <> trunc(budget_min)
UNION ALL
SELECT id, budget_max, 'hire_jobs.budget_max'
FROM hire_jobs
WHERE budget_max IS NOT NULL AND budget_max <> trunc(budget_max)
UNION ALL
SELECT id, total_amount, 'hire_contracts.total_amount'
FROM hire_contracts
WHERE total_amount IS NOT NULL AND total_amount <> trunc(total_amount)
UNION ALL
SELECT id, platform_fee, 'hire_contracts.platform_fee'
FROM hire_contracts
WHERE platform_fee IS NOT NULL AND platform_fee <> trunc(platform_fee)
UNION ALL
SELECT id, amount, 'hire_milestones.amount'
FROM hire_milestones
WHERE amount IS NOT NULL AND amount <> trunc(amount)
UNION ALL
SELECT id, "bidAmount", 'direct_hire_negotiations.bidAmount'
FROM direct_hire_negotiations
WHERE "bidAmount" IS NOT NULL AND "bidAmount" <> trunc("bidAmount")
UNION ALL
SELECT id, "hourlyRate", 'legacy_professional_details.hourlyRate'
FROM legacy_professional_details
WHERE "hourlyRate" IS NOT NULL AND "hourlyRate" <> trunc("hourlyRate")
UNION ALL
SELECT id, "fixedRate", 'legacy_professional_details.fixedRate'
FROM legacy_professional_details
WHERE "fixedRate" IS NOT NULL AND "fixedRate" <> trunc("fixedRate");

-- CHECK preflight queries.
SELECT id FROM payments
WHERE amount < 0
   OR "base_amount" < 0
   OR "client_fee_amount" < 0
   OR "professional_payout_amount" < 0
   OR "admin_net_amount" < 0;

SELECT id FROM project_trackings WHERE progress NOT BETWEEN 0 AND 100;
SELECT id FROM project_reviews WHERE rating NOT BETWEEN 1 AND 5;
SELECT id FROM users
WHERE "averageRating" NOT BETWEEN 0 AND 5 OR "reviewCount" < 0;
SELECT id, "budgetMin", "budgetMax" FROM client_jobs
WHERE "budgetMin" IS NOT NULL AND "budgetMax" IS NOT NULL AND "budgetMin" > "budgetMax";

-- Stored-value inventory for stable/internal lifecycle values and providers.
SELECT 'User.role' AS field, role AS value, count(*) FROM users GROUP BY role
UNION ALL SELECT 'ClientJob.status', status, count(*) FROM client_jobs GROUP BY status
UNION ALL SELECT 'ClientJob.paymentMethod', "paymentMethod", count(*) FROM client_jobs GROUP BY "paymentMethod"
UNION ALL SELECT 'ProjectTracking.status', status, count(*) FROM project_trackings GROUP BY status
UNION ALL SELECT 'ProjectMilestone.status', status, count(*) FROM project_milestones GROUP BY status
UNION ALL SELECT 'Payment.status', status, count(*) FROM payments GROUP BY status
UNION ALL SELECT 'Payment.provider', provider, count(*) FROM payments GROUP BY provider
UNION ALL SELECT 'Payment.currency', currency, count(*) FROM payments GROUP BY currency
UNION ALL SELECT 'ProjectDispute.status', status, count(*) FROM project_disputes GROUP BY status
UNION ALL SELECT 'ProjectDispute.priority', priority, count(*) FROM project_disputes GROUP BY priority;
