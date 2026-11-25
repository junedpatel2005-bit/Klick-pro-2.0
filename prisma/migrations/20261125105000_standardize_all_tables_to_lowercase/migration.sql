-- Migration: Standardize all remaining PostgreSQL table names to lowercase snake_case
-- Idempotent & zero-data-loss execution (Rule 1, Rule 2, Rule 7 compliant)

-- Rename "SQLiteMigrationTableArchive" -> "sqlite_migration_table_archives"
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'SQLiteMigrationTableArchive')
     AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sqlite_migration_table_archives') THEN
    ALTER TABLE "SQLiteMigrationTableArchive" RENAME TO "sqlite_migration_table_archives";
  END IF;
END $$;

-- Rename "SQLiteMigrationAudit" -> "sqlite_migration_audits"
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'SQLiteMigrationAudit')
     AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sqlite_migration_audits') THEN
    ALTER TABLE "SQLiteMigrationAudit" RENAME TO "sqlite_migration_audits";
  END IF;
END $$;

-- Rename "WebsitePage" -> "website_pages"
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'WebsitePage')
     AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'website_pages') THEN
    ALTER TABLE "WebsitePage" RENAME TO "website_pages";
  END IF;
END $$;

-- Rename "LegalPage" -> "legal_pages"
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'LegalPage')
     AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'legal_pages') THEN
    ALTER TABLE "LegalPage" RENAME TO "legal_pages";
  END IF;
END $$;

-- Rename "ServiceCategory" -> "service_categories"
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ServiceCategory')
     AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'service_categories') THEN
    ALTER TABLE "ServiceCategory" RENAME TO "service_categories";
  END IF;
END $$;

-- Rename "User" -> "users"
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'User')
     AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users') THEN
    ALTER TABLE "User" RENAME TO "users";
  END IF;
END $$;

-- Rename "ClientProfile" -> "client_profiles"
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ClientProfile')
     AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_profiles') THEN
    ALTER TABLE "ClientProfile" RENAME TO "client_profiles";
  END IF;
END $$;

-- Rename "ClientSavedLocation" -> "client_saved_locations"
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ClientSavedLocation')
     AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_saved_locations') THEN
    ALTER TABLE "ClientSavedLocation" RENAME TO "client_saved_locations";
  END IF;
END $$;

-- Rename "ClientHiringNeed" -> "client_hiring_needs"
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ClientHiringNeed')
     AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_hiring_needs') THEN
    ALTER TABLE "ClientHiringNeed" RENAME TO "client_hiring_needs";
  END IF;
END $$;

-- Rename "ClientJob" -> "client_jobs"
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ClientJob')
     AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_jobs') THEN
    ALTER TABLE "ClientJob" RENAME TO "client_jobs";
  END IF;
END $$;

-- Rename "FavoriteJob" -> "favorite_jobs"
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'FavoriteJob')
     AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'favorite_jobs') THEN
    ALTER TABLE "FavoriteJob" RENAME TO "favorite_jobs";
  END IF;
END $$;

-- Rename "SavedProfessional" -> "saved_professionals"
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'SavedProfessional')
     AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'saved_professionals') THEN
    ALTER TABLE "SavedProfessional" RENAME TO "saved_professionals";
  END IF;
END $$;

-- Rename "ClientJobAttachment" -> "client_job_attachments"
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ClientJobAttachment')
     AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_job_attachments') THEN
    ALTER TABLE "ClientJobAttachment" RENAME TO "client_job_attachments";
  END IF;
END $$;

-- Rename "ClientJobMilestone" -> "client_job_milestones"
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ClientJobMilestone')
     AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_job_milestones') THEN
    ALTER TABLE "ClientJobMilestone" RENAME TO "client_job_milestones";
  END IF;
END $$;

-- Rename "ProjectTransaction" -> "project_transactions"
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ProjectTransaction')
     AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'project_transactions') THEN
    ALTER TABLE "ProjectTransaction" RENAME TO "project_transactions";
  END IF;
END $$;

-- Rename "ProjectNegotiation" -> "project_negotiations"
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ProjectNegotiation')
     AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'project_negotiations') THEN
    ALTER TABLE "ProjectNegotiation" RENAME TO "project_negotiations";
  END IF;
END $$;

-- Rename "ProjectReview" -> "project_reviews"
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ProjectReview')
     AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'project_reviews') THEN
    ALTER TABLE "ProjectReview" RENAME TO "project_reviews";
  END IF;
END $$;

-- Rename "ProjectRequest" -> "project_requests"
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ProjectRequest')
     AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'project_requests') THEN
    ALTER TABLE "ProjectRequest" RENAME TO "project_requests";
  END IF;
END $$;

-- Rename "ProjectTracking" -> "project_trackings"
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ProjectTracking')
     AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'project_trackings') THEN
    ALTER TABLE "ProjectTracking" RENAME TO "project_trackings";
  END IF;
END $$;

-- Rename "ProjectTimelineEvent" -> "project_timeline_events"
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ProjectTimelineEvent')
     AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'project_timeline_events') THEN
    ALTER TABLE "ProjectTimelineEvent" RENAME TO "project_timeline_events";
  END IF;
END $$;

-- Rename "ProjectMilestone" -> "project_milestones"
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ProjectMilestone')
     AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'project_milestones') THEN
    ALTER TABLE "ProjectMilestone" RENAME TO "project_milestones";
  END IF;
END $$;

-- Rename "ProjectWorkUpload" -> "project_work_uploads"
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ProjectWorkUpload')
     AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'project_work_uploads') THEN
    ALTER TABLE "ProjectWorkUpload" RENAME TO "project_work_uploads";
  END IF;
END $$;

-- Rename "SocketConversation" -> "socket_conversations"
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'SocketConversation')
     AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'socket_conversations') THEN
    ALTER TABLE "SocketConversation" RENAME TO "socket_conversations";
  END IF;
END $$;

-- Rename "SocketMessage" -> "socket_messages"
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'SocketMessage')
     AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'socket_messages') THEN
    ALTER TABLE "SocketMessage" RENAME TO "socket_messages";
  END IF;
END $$;

-- Rename "SocketConversationClear" -> "socket_conversation_clears"
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'SocketConversationClear')
     AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'socket_conversation_clears') THEN
    ALTER TABLE "SocketConversationClear" RENAME TO "socket_conversation_clears";
  END IF;
END $$;

-- Rename "CallSession" -> "call_sessions"
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'CallSession')
     AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'call_sessions') THEN
    ALTER TABLE "CallSession" RENAME TO "call_sessions";
  END IF;
END $$;

-- Rename "MessageConversation" -> "message_conversations"
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'MessageConversation')
     AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'message_conversations') THEN
    ALTER TABLE "MessageConversation" RENAME TO "message_conversations";
  END IF;
END $$;

-- Rename "Message" -> "messages"
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'Message')
     AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'messages') THEN
    ALTER TABLE "Message" RENAME TO "messages";
  END IF;
END $$;

-- Rename "UserNotification" -> "user_notifications"
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'UserNotification')
     AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_notifications') THEN
    ALTER TABLE "UserNotification" RENAME TO "user_notifications";
  END IF;
END $$;

-- Rename "UserNotificationState" -> "user_notification_states"
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'UserNotificationState')
     AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_notification_states') THEN
    ALTER TABLE "UserNotificationState" RENAME TO "user_notification_states";
  END IF;
END $$;

-- Rename "Payment" -> "payments"
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'Payment')
     AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'payments') THEN
    ALTER TABLE "Payment" RENAME TO "payments";
  END IF;
END $$;

-- Rename "Wallet" -> "wallets"
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'Wallet')
     AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'wallets') THEN
    ALTER TABLE "Wallet" RENAME TO "wallets";
  END IF;
END $$;

-- Rename "WalletTransaction" -> "wallet_transactions"
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'WalletTransaction')
     AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'wallet_transactions') THEN
    ALTER TABLE "WalletTransaction" RENAME TO "wallet_transactions";
  END IF;
END $$;

-- Rename "ProjectWithdrawal" -> "project_withdrawals"
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ProjectWithdrawal')
     AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'project_withdrawals') THEN
    ALTER TABLE "ProjectWithdrawal" RENAME TO "project_withdrawals";
  END IF;
END $$;

-- Rename "ProjectDispute" -> "project_disputes"
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ProjectDispute')
     AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'project_disputes') THEN
    ALTER TABLE "ProjectDispute" RENAME TO "project_disputes";
  END IF;
END $$;

-- Rename "ProjectCompletionRequest" -> "project_completion_requests"
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ProjectCompletionRequest')
     AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'project_completion_requests') THEN
    ALTER TABLE "ProjectCompletionRequest" RENAME TO "project_completion_requests";
  END IF;
END $$;

-- Rename "ProjectRevisionRequest" -> "project_revision_requests"
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ProjectRevisionRequest')
     AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'project_revision_requests') THEN
    ALTER TABLE "ProjectRevisionRequest" RENAME TO "project_revision_requests";
  END IF;
END $$;

-- Rename "ProjectReviewRequest" -> "project_review_requests"
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ProjectReviewRequest')
     AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'project_review_requests') THEN
    ALTER TABLE "ProjectReviewRequest" RENAME TO "project_review_requests";
  END IF;
END $$;

-- Rename "ProfessionalVerification" -> "professional_verifications"
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ProfessionalVerification')
     AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'professional_verifications') THEN
    ALTER TABLE "ProfessionalVerification" RENAME TO "professional_verifications";
  END IF;
END $$;

-- Rename "StoredFile" -> "stored_files"
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'StoredFile')
     AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'stored_files') THEN
    ALTER TABLE "StoredFile" RENAME TO "stored_files";
  END IF;
END $$;

-- Rename "ApiToken" -> "api_tokens"
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ApiToken')
     AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'api_tokens') THEN
    ALTER TABLE "ApiToken" RENAME TO "api_tokens";
  END IF;
END $$;

-- Rename "OtpCode" -> "otp_codes"
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'OtpCode')
     AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'otp_codes') THEN
    ALTER TABLE "OtpCode" RENAME TO "otp_codes";
  END IF;
END $$;

-- Rename "BrowserSubscription" -> "browser_subscriptions"
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'BrowserSubscription')
     AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'browser_subscriptions') THEN
    ALTER TABLE "BrowserSubscription" RENAME TO "browser_subscriptions";
  END IF;
END $$;

-- Rename "Faq" -> "faqs"
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'Faq')
     AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'faqs') THEN
    ALTER TABLE "Faq" RENAME TO "faqs";
  END IF;
END $$;

-- Rename "ContactRequest" -> "contact_requests"
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ContactRequest')
     AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'contact_requests') THEN
    ALTER TABLE "ContactRequest" RENAME TO "contact_requests";
  END IF;
END $$;

-- Rename "Service" -> "services"
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'Service')
     AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'services') THEN
    ALTER TABLE "Service" RENAME TO "services";
  END IF;
END $$;
