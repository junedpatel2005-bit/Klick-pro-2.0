-- Migration: Standardize all database column names to lowercase snake_case
-- Automatically generated for idempotent execution across PostgreSQL

-- Table "cms_pages" (9 columns)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cms_pages' AND column_name = 'metaTitle') THEN
    ALTER TABLE "cms_pages" RENAME COLUMN "metaTitle" TO "meta_title";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cms_pages' AND column_name = 'metaDescription') THEN
    ALTER TABLE "cms_pages" RENAME COLUMN "metaDescription" TO "meta_description";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cms_pages' AND column_name = 'pageKey') THEN
    ALTER TABLE "cms_pages" RENAME COLUMN "pageKey" TO "page_key";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cms_pages' AND column_name = 'ogTitle') THEN
    ALTER TABLE "cms_pages" RENAME COLUMN "ogTitle" TO "og_title";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cms_pages' AND column_name = 'ogDescription') THEN
    ALTER TABLE "cms_pages" RENAME COLUMN "ogDescription" TO "og_description";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cms_pages' AND column_name = 'ogImage') THEN
    ALTER TABLE "cms_pages" RENAME COLUMN "ogImage" TO "og_image";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cms_pages' AND column_name = 'canonicalUrl') THEN
    ALTER TABLE "cms_pages" RENAME COLUMN "canonicalUrl" TO "canonical_url";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cms_pages' AND column_name = 'createdAt') THEN
    ALTER TABLE "cms_pages" RENAME COLUMN "createdAt" TO "created_at";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cms_pages' AND column_name = 'updatedAt') THEN
    ALTER TABLE "cms_pages" RENAME COLUMN "updatedAt" TO "updated_at";
  END IF;
END $$;

-- Table "cms_media" (3 columns)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cms_media' AND column_name = 'mimeType') THEN
    ALTER TABLE "cms_media" RENAME COLUMN "mimeType" TO "mime_type";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cms_media' AND column_name = 'createdBy') THEN
    ALTER TABLE "cms_media" RENAME COLUMN "createdBy" TO "created_by";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cms_media' AND column_name = 'createdAt') THEN
    ALTER TABLE "cms_media" RENAME COLUMN "createdAt" TO "created_at";
  END IF;
END $$;

-- Table "SQLiteMigrationTableArchive" (3 columns)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'SQLiteMigrationTableArchive' AND column_name = 'sourceTable') THEN
    ALTER TABLE "SQLiteMigrationTableArchive" RENAME COLUMN "sourceTable" TO "source_table";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'SQLiteMigrationTableArchive' AND column_name = 'sourceCount') THEN
    ALTER TABLE "SQLiteMigrationTableArchive" RENAME COLUMN "sourceCount" TO "source_count";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'SQLiteMigrationTableArchive' AND column_name = 'migratedAt') THEN
    ALTER TABLE "SQLiteMigrationTableArchive" RENAME COLUMN "migratedAt" TO "migrated_at";
  END IF;
END $$;

-- Table "SQLiteMigrationAudit" (4 columns)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'SQLiteMigrationAudit' AND column_name = 'sourceTable') THEN
    ALTER TABLE "SQLiteMigrationAudit" RENAME COLUMN "sourceTable" TO "source_table";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'SQLiteMigrationAudit' AND column_name = 'sourceCount') THEN
    ALTER TABLE "SQLiteMigrationAudit" RENAME COLUMN "sourceCount" TO "source_count";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'SQLiteMigrationAudit' AND column_name = 'archivedCount') THEN
    ALTER TABLE "SQLiteMigrationAudit" RENAME COLUMN "archivedCount" TO "archived_count";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'SQLiteMigrationAudit' AND column_name = 'migratedAt') THEN
    ALTER TABLE "SQLiteMigrationAudit" RENAME COLUMN "migratedAt" TO "migrated_at";
  END IF;
END $$;

-- Table "WebsitePage" (2 columns)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'WebsitePage' AND column_name = 'pageKey') THEN
    ALTER TABLE "WebsitePage" RENAME COLUMN "pageKey" TO "page_key";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'WebsitePage' AND column_name = 'updatedAt') THEN
    ALTER TABLE "WebsitePage" RENAME COLUMN "updatedAt" TO "updated_at";
  END IF;
END $$;

-- Table "LegalPage" (1 columns)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'LegalPage' AND column_name = 'updatedAt') THEN
    ALTER TABLE "LegalPage" RENAME COLUMN "updatedAt" TO "updated_at";
  END IF;
END $$;

-- Table "ServiceCategory" (5 columns)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ServiceCategory' AND column_name = 'iconName') THEN
    ALTER TABLE "ServiceCategory" RENAME COLUMN "iconName" TO "icon_name";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ServiceCategory' AND column_name = 'sortOrder') THEN
    ALTER TABLE "ServiceCategory" RENAME COLUMN "sortOrder" TO "sort_order";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ServiceCategory' AND column_name = 'createdAt') THEN
    ALTER TABLE "ServiceCategory" RENAME COLUMN "createdAt" TO "created_at";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ServiceCategory' AND column_name = 'updatedAt') THEN
    ALTER TABLE "ServiceCategory" RENAME COLUMN "updatedAt" TO "updated_at";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ServiceCategory' AND column_name = 'parentId') THEN
    ALTER TABLE "ServiceCategory" RENAME COLUMN "parentId" TO "parent_id";
  END IF;
END $$;

-- Table "User" (44 columns)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'firstName') THEN
    ALTER TABLE "User" RENAME COLUMN "firstName" TO "first_name";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'lastName') THEN
    ALTER TABLE "User" RENAME COLUMN "lastName" TO "last_name";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'passwordHash') THEN
    ALTER TABLE "User" RENAME COLUMN "passwordHash" TO "password_hash";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'googleId') THEN
    ALTER TABLE "User" RENAME COLUMN "googleId" TO "google_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'avatarUrl') THEN
    ALTER TABLE "User" RENAME COLUMN "avatarUrl" TO "avatar_url";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'companyName') THEN
    ALTER TABLE "User" RENAME COLUMN "companyName" TO "company_name";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'companyWebsite') THEN
    ALTER TABLE "User" RENAME COLUMN "companyWebsite" TO "company_website";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'teamSize') THEN
    ALTER TABLE "User" RENAME COLUMN "teamSize" TO "team_size";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'companyDescription') THEN
    ALTER TABLE "User" RENAME COLUMN "companyDescription" TO "company_description";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'professionalCategory') THEN
    ALTER TABLE "User" RENAME COLUMN "professionalCategory" TO "professional_category";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'professionalCity') THEN
    ALTER TABLE "User" RENAME COLUMN "professionalCity" TO "professional_city";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'professionalSkillsJson') THEN
    ALTER TABLE "User" RENAME COLUMN "professionalSkillsJson" TO "professional_skills_json";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'experienceYears') THEN
    ALTER TABLE "User" RENAME COLUMN "experienceYears" TO "experience_years";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'hourlyRate') THEN
    ALTER TABLE "User" RENAME COLUMN "hourlyRate" TO "hourly_rate";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'fixedRate') THEN
    ALTER TABLE "User" RENAME COLUMN "fixedRate" TO "fixed_rate";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'portfolioUrl') THEN
    ALTER TABLE "User" RENAME COLUMN "portfolioUrl" TO "portfolio_url";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'workPhotosJson') THEN
    ALTER TABLE "User" RENAME COLUMN "workPhotosJson" TO "work_photos_json";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'certificationsJson') THEN
    ALTER TABLE "User" RENAME COLUMN "certificationsJson" TO "certifications_json";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'tradeLicenseUrl') THEN
    ALTER TABLE "User" RENAME COLUMN "tradeLicenseUrl" TO "trade_license_url";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'serviceArea') THEN
    ALTER TABLE "User" RENAME COLUMN "serviceArea" TO "service_area";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'workMode') THEN
    ALTER TABLE "User" RENAME COLUMN "workMode" TO "work_mode";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'serviceRadiusKm') THEN
    ALTER TABLE "User" RENAME COLUMN "serviceRadiusKm" TO "service_radius_km";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'averageRating') THEN
    ALTER TABLE "User" RENAME COLUMN "averageRating" TO "average_rating";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'reviewCount') THEN
    ALTER TABLE "User" RENAME COLUMN "reviewCount" TO "review_count";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'isVerified') THEN
    ALTER TABLE "User" RENAME COLUMN "isVerified" TO "is_verified";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'availabilityStatus') THEN
    ALTER TABLE "User" RENAME COLUMN "availabilityStatus" TO "availability_status";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'savedLocationsJson') THEN
    ALTER TABLE "User" RENAME COLUMN "savedLocationsJson" TO "saved_locations_json";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'hiringNeedsJson') THEN
    ALTER TABLE "User" RENAME COLUMN "hiringNeedsJson" TO "hiring_needs_json";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'authProvider') THEN
    ALTER TABLE "User" RENAME COLUMN "authProvider" TO "auth_provider";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'isActive') THEN
    ALTER TABLE "User" RENAME COLUMN "isActive" TO "is_active";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'lastLoginAt') THEN
    ALTER TABLE "User" RENAME COLUMN "lastLoginAt" TO "last_login_at";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'createdAt') THEN
    ALTER TABLE "User" RENAME COLUMN "createdAt" TO "created_at";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'updatedAt') THEN
    ALTER TABLE "User" RENAME COLUMN "updatedAt" TO "updated_at";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'professionalLatitude') THEN
    ALTER TABLE "User" RENAME COLUMN "professionalLatitude" TO "professional_latitude";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'professionalLongitude') THEN
    ALTER TABLE "User" RENAME COLUMN "professionalLongitude" TO "professional_longitude";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'biometricEnabled') THEN
    ALTER TABLE "User" RENAME COLUMN "biometricEnabled" TO "biometric_enabled";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'biometricType') THEN
    ALTER TABLE "User" RENAME COLUMN "biometricType" TO "biometric_type";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'browserNotificationsEnabled') THEN
    ALTER TABLE "User" RENAME COLUMN "browserNotificationsEnabled" TO "browser_notifications_enabled";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'emailNotificationsEnabled') THEN
    ALTER TABLE "User" RENAME COLUMN "emailNotificationsEnabled" TO "email_notifications_enabled";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'emailVerifiedAt') THEN
    ALTER TABLE "User" RENAME COLUMN "emailVerifiedAt" TO "email_verified_at";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'projectActivityNotificationsEnabled') THEN
    ALTER TABLE "User" RENAME COLUMN "projectActivityNotificationsEnabled" TO "project_activity_notifications_enabled";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'phoneVerifiedAt') THEN
    ALTER TABLE "User" RENAME COLUMN "phoneVerifiedAt" TO "phone_verified_at";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'professionalState') THEN
    ALTER TABLE "User" RENAME COLUMN "professionalState" TO "professional_state";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'professionalDistrict') THEN
    ALTER TABLE "User" RENAME COLUMN "professionalDistrict" TO "professional_district";
  END IF;
END $$;

-- Table "ClientProfile" (9 columns)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ClientProfile' AND column_name = 'userId') THEN
    ALTER TABLE "ClientProfile" RENAME COLUMN "userId" TO "user_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ClientProfile' AND column_name = 'fullName') THEN
    ALTER TABLE "ClientProfile" RENAME COLUMN "fullName" TO "full_name";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ClientProfile' AND column_name = 'companyName') THEN
    ALTER TABLE "ClientProfile" RENAME COLUMN "companyName" TO "company_name";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ClientProfile' AND column_name = 'companyWebsite') THEN
    ALTER TABLE "ClientProfile" RENAME COLUMN "companyWebsite" TO "company_website";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ClientProfile' AND column_name = 'teamSize') THEN
    ALTER TABLE "ClientProfile" RENAME COLUMN "teamSize" TO "team_size";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ClientProfile' AND column_name = 'companyDescription') THEN
    ALTER TABLE "ClientProfile" RENAME COLUMN "companyDescription" TO "company_description";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ClientProfile' AND column_name = 'profilePhotoUrl') THEN
    ALTER TABLE "ClientProfile" RENAME COLUMN "profilePhotoUrl" TO "profile_photo_url";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ClientProfile' AND column_name = 'createdAt') THEN
    ALTER TABLE "ClientProfile" RENAME COLUMN "createdAt" TO "created_at";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ClientProfile' AND column_name = 'updatedAt') THEN
    ALTER TABLE "ClientProfile" RENAME COLUMN "updatedAt" TO "updated_at";
  END IF;
END $$;

-- Table "ClientSavedLocation" (3 columns)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ClientSavedLocation' AND column_name = 'clientProfileId') THEN
    ALTER TABLE "ClientSavedLocation" RENAME COLUMN "clientProfileId" TO "client_profile_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ClientSavedLocation' AND column_name = 'createdAt') THEN
    ALTER TABLE "ClientSavedLocation" RENAME COLUMN "createdAt" TO "created_at";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ClientSavedLocation' AND column_name = 'isPrimary') THEN
    ALTER TABLE "ClientSavedLocation" RENAME COLUMN "isPrimary" TO "is_primary";
  END IF;
END $$;

-- Table "ClientHiringNeed" (2 columns)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ClientHiringNeed' AND column_name = 'clientProfileId') THEN
    ALTER TABLE "ClientHiringNeed" RENAME COLUMN "clientProfileId" TO "client_profile_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ClientHiringNeed' AND column_name = 'createdAt') THEN
    ALTER TABLE "ClientHiringNeed" RENAME COLUMN "createdAt" TO "created_at";
  END IF;
END $$;

-- Table "ClientJob" (17 columns)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ClientJob' AND column_name = 'userId') THEN
    ALTER TABLE "ClientJob" RENAME COLUMN "userId" TO "user_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ClientJob' AND column_name = 'budgetMin') THEN
    ALTER TABLE "ClientJob" RENAME COLUMN "budgetMin" TO "budget_min";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ClientJob' AND column_name = 'budgetMax') THEN
    ALTER TABLE "ClientJob" RENAME COLUMN "budgetMax" TO "budget_max";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ClientJob' AND column_name = 'jobDate') THEN
    ALTER TABLE "ClientJob" RENAME COLUMN "jobDate" TO "job_date";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ClientJob' AND column_name = 'workMode') THEN
    ALTER TABLE "ClientJob" RENAME COLUMN "workMode" TO "work_mode";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ClientJob' AND column_name = 'locationLabel') THEN
    ALTER TABLE "ClientJob" RENAME COLUMN "locationLabel" TO "location_label";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ClientJob' AND column_name = 'locationAddress') THEN
    ALTER TABLE "ClientJob" RENAME COLUMN "locationAddress" TO "location_address";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ClientJob' AND column_name = 'locationLat') THEN
    ALTER TABLE "ClientJob" RENAME COLUMN "locationLat" TO "location_lat";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ClientJob' AND column_name = 'locationLng') THEN
    ALTER TABLE "ClientJob" RENAME COLUMN "locationLng" TO "location_lng";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ClientJob' AND column_name = 'createdAt') THEN
    ALTER TABLE "ClientJob" RENAME COLUMN "createdAt" TO "created_at";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ClientJob' AND column_name = 'updatedAt') THEN
    ALTER TABLE "ClientJob" RENAME COLUMN "updatedAt" TO "updated_at";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ClientJob' AND column_name = 'hourlyRate') THEN
    ALTER TABLE "ClientJob" RENAME COLUMN "hourlyRate" TO "hourly_rate";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ClientJob' AND column_name = 'totalJobHours') THEN
    ALTER TABLE "ClientJob" RENAME COLUMN "totalJobHours" TO "total_job_hours";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ClientJob' AND column_name = 'timingType') THEN
    ALTER TABLE "ClientJob" RENAME COLUMN "timingType" TO "timing_type";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ClientJob' AND column_name = 'paymentMethod') THEN
    ALTER TABLE "ClientJob" RENAME COLUMN "paymentMethod" TO "payment_method";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ClientJob' AND column_name = 'locationState') THEN
    ALTER TABLE "ClientJob" RENAME COLUMN "locationState" TO "location_state";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ClientJob' AND column_name = 'locationDistrict') THEN
    ALTER TABLE "ClientJob" RENAME COLUMN "locationDistrict" TO "location_district";
  END IF;
END $$;

-- Table "FavoriteJob" (3 columns)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'FavoriteJob' AND column_name = 'userId') THEN
    ALTER TABLE "FavoriteJob" RENAME COLUMN "userId" TO "user_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'FavoriteJob' AND column_name = 'jobId') THEN
    ALTER TABLE "FavoriteJob" RENAME COLUMN "jobId" TO "job_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'FavoriteJob' AND column_name = 'createdAt') THEN
    ALTER TABLE "FavoriteJob" RENAME COLUMN "createdAt" TO "created_at";
  END IF;
END $$;

-- Table "SavedProfessional" (3 columns)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'SavedProfessional' AND column_name = 'userId') THEN
    ALTER TABLE "SavedProfessional" RENAME COLUMN "userId" TO "user_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'SavedProfessional' AND column_name = 'professionalId') THEN
    ALTER TABLE "SavedProfessional" RENAME COLUMN "professionalId" TO "professional_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'SavedProfessional' AND column_name = 'createdAt') THEN
    ALTER TABLE "SavedProfessional" RENAME COLUMN "createdAt" TO "created_at";
  END IF;
END $$;

-- Table "ClientJobAttachment" (6 columns)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ClientJobAttachment' AND column_name = 'jobId') THEN
    ALTER TABLE "ClientJobAttachment" RENAME COLUMN "jobId" TO "job_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ClientJobAttachment' AND column_name = 'fileName') THEN
    ALTER TABLE "ClientJobAttachment" RENAME COLUMN "fileName" TO "file_name";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ClientJobAttachment' AND column_name = 'fileType') THEN
    ALTER TABLE "ClientJobAttachment" RENAME COLUMN "fileType" TO "file_type";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ClientJobAttachment' AND column_name = 'fileSize') THEN
    ALTER TABLE "ClientJobAttachment" RENAME COLUMN "fileSize" TO "file_size";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ClientJobAttachment' AND column_name = 'previewUrl') THEN
    ALTER TABLE "ClientJobAttachment" RENAME COLUMN "previewUrl" TO "preview_url";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ClientJobAttachment' AND column_name = 'createdAt') THEN
    ALTER TABLE "ClientJobAttachment" RENAME COLUMN "createdAt" TO "created_at";
  END IF;
END $$;

-- Table "ClientJobMilestone" (4 columns)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ClientJobMilestone' AND column_name = 'jobId') THEN
    ALTER TABLE "ClientJobMilestone" RENAME COLUMN "jobId" TO "job_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ClientJobMilestone' AND column_name = 'sortOrder') THEN
    ALTER TABLE "ClientJobMilestone" RENAME COLUMN "sortOrder" TO "sort_order";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ClientJobMilestone' AND column_name = 'createdAt') THEN
    ALTER TABLE "ClientJobMilestone" RENAME COLUMN "createdAt" TO "created_at";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ClientJobMilestone' AND column_name = 'updatedAt') THEN
    ALTER TABLE "ClientJobMilestone" RENAME COLUMN "updatedAt" TO "updated_at";
  END IF;
END $$;

-- Table "ProjectTransaction" (7 columns)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectTransaction' AND column_name = 'trackingId') THEN
    ALTER TABLE "ProjectTransaction" RENAME COLUMN "trackingId" TO "tracking_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectTransaction' AND column_name = 'milestoneId') THEN
    ALTER TABLE "ProjectTransaction" RENAME COLUMN "milestoneId" TO "milestone_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectTransaction' AND column_name = 'completionId') THEN
    ALTER TABLE "ProjectTransaction" RENAME COLUMN "completionId" TO "completion_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectTransaction' AND column_name = 'clientId') THEN
    ALTER TABLE "ProjectTransaction" RENAME COLUMN "clientId" TO "client_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectTransaction' AND column_name = 'professionalId') THEN
    ALTER TABLE "ProjectTransaction" RENAME COLUMN "professionalId" TO "professional_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectTransaction' AND column_name = 'createdAt') THEN
    ALTER TABLE "ProjectTransaction" RENAME COLUMN "createdAt" TO "created_at";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectTransaction' AND column_name = 'updatedAt') THEN
    ALTER TABLE "ProjectTransaction" RENAME COLUMN "updatedAt" TO "updated_at";
  END IF;
END $$;

-- Table "ProjectNegotiation" (15 columns)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectNegotiation' AND column_name = 'requestId') THEN
    ALTER TABLE "ProjectNegotiation" RENAME COLUMN "requestId" TO "request_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectNegotiation' AND column_name = 'jobId') THEN
    ALTER TABLE "ProjectNegotiation" RENAME COLUMN "jobId" TO "job_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectNegotiation' AND column_name = 'clientId') THEN
    ALTER TABLE "ProjectNegotiation" RENAME COLUMN "clientId" TO "client_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectNegotiation' AND column_name = 'professionalId') THEN
    ALTER TABLE "ProjectNegotiation" RENAME COLUMN "professionalId" TO "professional_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectNegotiation' AND column_name = 'senderId') THEN
    ALTER TABLE "ProjectNegotiation" RENAME COLUMN "senderId" TO "sender_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectNegotiation' AND column_name = 'senderRole') THEN
    ALTER TABLE "ProjectNegotiation" RENAME COLUMN "senderRole" TO "sender_role";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectNegotiation' AND column_name = 'bidAmount') THEN
    ALTER TABLE "ProjectNegotiation" RENAME COLUMN "bidAmount" TO "bid_amount";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectNegotiation' AND column_name = 'hourlyRate') THEN
    ALTER TABLE "ProjectNegotiation" RENAME COLUMN "hourlyRate" TO "hourly_rate";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectNegotiation' AND column_name = 'totalJobHours') THEN
    ALTER TABLE "ProjectNegotiation" RENAME COLUMN "totalJobHours" TO "total_job_hours";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectNegotiation' AND column_name = 'createdAt') THEN
    ALTER TABLE "ProjectNegotiation" RENAME COLUMN "createdAt" TO "created_at";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectNegotiation' AND column_name = 'previousBidAmount') THEN
    ALTER TABLE "ProjectNegotiation" RENAME COLUMN "previousBidAmount" TO "previous_bid_amount";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectNegotiation' AND column_name = 'previousHourlyRate') THEN
    ALTER TABLE "ProjectNegotiation" RENAME COLUMN "previousHourlyRate" TO "previous_hourly_rate";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectNegotiation' AND column_name = 'previousTotalJobHours') THEN
    ALTER TABLE "ProjectNegotiation" RENAME COLUMN "previousTotalJobHours" TO "previous_total_job_hours";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectNegotiation' AND column_name = 'previousDuration') THEN
    ALTER TABLE "ProjectNegotiation" RENAME COLUMN "previousDuration" TO "previous_duration";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectNegotiation' AND column_name = 'previousMessage') THEN
    ALTER TABLE "ProjectNegotiation" RENAME COLUMN "previousMessage" TO "previous_message";
  END IF;
END $$;

-- Table "ProjectReview" (11 columns)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectReview' AND column_name = 'trackingId') THEN
    ALTER TABLE "ProjectReview" RENAME COLUMN "trackingId" TO "tracking_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectReview' AND column_name = 'clientId') THEN
    ALTER TABLE "ProjectReview" RENAME COLUMN "clientId" TO "client_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectReview' AND column_name = 'professionalId') THEN
    ALTER TABLE "ProjectReview" RENAME COLUMN "professionalId" TO "professional_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectReview' AND column_name = 'clientReviewedAt') THEN
    ALTER TABLE "ProjectReview" RENAME COLUMN "clientReviewedAt" TO "client_reviewed_at";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectReview' AND column_name = 'professionalRating') THEN
    ALTER TABLE "ProjectReview" RENAME COLUMN "professionalRating" TO "professional_rating";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectReview' AND column_name = 'professionalComment') THEN
    ALTER TABLE "ProjectReview" RENAME COLUMN "professionalComment" TO "professional_comment";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectReview' AND column_name = 'professionalReviewedAt') THEN
    ALTER TABLE "ProjectReview" RENAME COLUMN "professionalReviewedAt" TO "professional_reviewed_at";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectReview' AND column_name = 'createdAt') THEN
    ALTER TABLE "ProjectReview" RENAME COLUMN "createdAt" TO "created_at";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectReview' AND column_name = 'updatedAt') THEN
    ALTER TABLE "ProjectReview" RENAME COLUMN "updatedAt" TO "updated_at";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectReview' AND column_name = 'professionalResponse') THEN
    ALTER TABLE "ProjectReview" RENAME COLUMN "professionalResponse" TO "professional_response";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectReview' AND column_name = 'professionalResponseAt') THEN
    ALTER TABLE "ProjectReview" RENAME COLUMN "professionalResponseAt" TO "professional_response_at";
  END IF;
END $$;

-- Table "ProjectRequest" (10 columns)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectRequest' AND column_name = 'jobId') THEN
    ALTER TABLE "ProjectRequest" RENAME COLUMN "jobId" TO "job_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectRequest' AND column_name = 'clientId') THEN
    ALTER TABLE "ProjectRequest" RENAME COLUMN "clientId" TO "client_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectRequest' AND column_name = 'professionalId') THEN
    ALTER TABLE "ProjectRequest" RENAME COLUMN "professionalId" TO "professional_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectRequest' AND column_name = 'bidAmount') THEN
    ALTER TABLE "ProjectRequest" RENAME COLUMN "bidAmount" TO "bid_amount";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectRequest' AND column_name = 'hourlyRate') THEN
    ALTER TABLE "ProjectRequest" RENAME COLUMN "hourlyRate" TO "hourly_rate";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectRequest' AND column_name = 'totalJobHours') THEN
    ALTER TABLE "ProjectRequest" RENAME COLUMN "totalJobHours" TO "total_job_hours";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectRequest' AND column_name = 'coverLetter') THEN
    ALTER TABLE "ProjectRequest" RENAME COLUMN "coverLetter" TO "cover_letter";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectRequest' AND column_name = 'attachmentsJson') THEN
    ALTER TABLE "ProjectRequest" RENAME COLUMN "attachmentsJson" TO "attachments_json";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectRequest' AND column_name = 'createdAt') THEN
    ALTER TABLE "ProjectRequest" RENAME COLUMN "createdAt" TO "created_at";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectRequest' AND column_name = 'updatedAt') THEN
    ALTER TABLE "ProjectRequest" RENAME COLUMN "updatedAt" TO "updated_at";
  END IF;
END $$;

-- Table "ProjectTracking" (10 columns)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectTracking' AND column_name = 'requestId') THEN
    ALTER TABLE "ProjectTracking" RENAME COLUMN "requestId" TO "request_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectTracking' AND column_name = 'jobId') THEN
    ALTER TABLE "ProjectTracking" RENAME COLUMN "jobId" TO "job_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectTracking' AND column_name = 'clientId') THEN
    ALTER TABLE "ProjectTracking" RENAME COLUMN "clientId" TO "client_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectTracking' AND column_name = 'professionalId') THEN
    ALTER TABLE "ProjectTracking" RENAME COLUMN "professionalId" TO "professional_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectTracking' AND column_name = 'acceptedAt') THEN
    ALTER TABLE "ProjectTracking" RENAME COLUMN "acceptedAt" TO "accepted_at";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectTracking' AND column_name = 'createdAt') THEN
    ALTER TABLE "ProjectTracking" RENAME COLUMN "createdAt" TO "created_at";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectTracking' AND column_name = 'updatedAt') THEN
    ALTER TABLE "ProjectTracking" RENAME COLUMN "updatedAt" TO "updated_at";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectTracking' AND column_name = 'currentStage') THEN
    ALTER TABLE "ProjectTracking" RENAME COLUMN "currentStage" TO "current_stage";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectTracking' AND column_name = 'startedAt') THEN
    ALTER TABLE "ProjectTracking" RENAME COLUMN "startedAt" TO "started_at";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectTracking' AND column_name = 'completedAt') THEN
    ALTER TABLE "ProjectTracking" RENAME COLUMN "completedAt" TO "completed_at";
  END IF;
END $$;

-- Table "ProjectTimelineEvent" (6 columns)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectTimelineEvent' AND column_name = 'trackingId') THEN
    ALTER TABLE "ProjectTimelineEvent" RENAME COLUMN "trackingId" TO "tracking_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectTimelineEvent' AND column_name = 'milestoneId') THEN
    ALTER TABLE "ProjectTimelineEvent" RENAME COLUMN "milestoneId" TO "milestone_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectTimelineEvent' AND column_name = 'actorId') THEN
    ALTER TABLE "ProjectTimelineEvent" RENAME COLUMN "actorId" TO "actor_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectTimelineEvent' AND column_name = 'actorRole') THEN
    ALTER TABLE "ProjectTimelineEvent" RENAME COLUMN "actorRole" TO "actor_role";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectTimelineEvent' AND column_name = 'attachmentJson') THEN
    ALTER TABLE "ProjectTimelineEvent" RENAME COLUMN "attachmentJson" TO "attachment_json";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectTimelineEvent' AND column_name = 'createdAt') THEN
    ALTER TABLE "ProjectTimelineEvent" RENAME COLUMN "createdAt" TO "created_at";
  END IF;
END $$;

-- Table "ProjectMilestone" (8 columns)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectMilestone' AND column_name = 'trackingId') THEN
    ALTER TABLE "ProjectMilestone" RENAME COLUMN "trackingId" TO "tracking_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectMilestone' AND column_name = 'clientId') THEN
    ALTER TABLE "ProjectMilestone" RENAME COLUMN "clientId" TO "client_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectMilestone' AND column_name = 'professionalId') THEN
    ALTER TABLE "ProjectMilestone" RENAME COLUMN "professionalId" TO "professional_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectMilestone' AND column_name = 'dueDate') THEN
    ALTER TABLE "ProjectMilestone" RENAME COLUMN "dueDate" TO "due_date";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectMilestone' AND column_name = 'createdAt') THEN
    ALTER TABLE "ProjectMilestone" RENAME COLUMN "createdAt" TO "created_at";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectMilestone' AND column_name = 'updatedAt') THEN
    ALTER TABLE "ProjectMilestone" RENAME COLUMN "updatedAt" TO "updated_at";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectMilestone' AND column_name = 'submittedAt') THEN
    ALTER TABLE "ProjectMilestone" RENAME COLUMN "submittedAt" TO "submitted_at";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectMilestone' AND column_name = 'approvedAt') THEN
    ALTER TABLE "ProjectMilestone" RENAME COLUMN "approvedAt" TO "approved_at";
  END IF;
END $$;

-- Table "ProjectWorkUpload" (7 columns)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectWorkUpload' AND column_name = 'trackingId') THEN
    ALTER TABLE "ProjectWorkUpload" RENAME COLUMN "trackingId" TO "tracking_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectWorkUpload' AND column_name = 'roundNumber') THEN
    ALTER TABLE "ProjectWorkUpload" RENAME COLUMN "roundNumber" TO "round_number";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectWorkUpload' AND column_name = 'fileName') THEN
    ALTER TABLE "ProjectWorkUpload" RENAME COLUMN "fileName" TO "file_name";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectWorkUpload' AND column_name = 'fileUrl') THEN
    ALTER TABLE "ProjectWorkUpload" RENAME COLUMN "fileUrl" TO "file_url";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectWorkUpload' AND column_name = 'filesJson') THEN
    ALTER TABLE "ProjectWorkUpload" RENAME COLUMN "filesJson" TO "files_json";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectWorkUpload' AND column_name = 'createdAt') THEN
    ALTER TABLE "ProjectWorkUpload" RENAME COLUMN "createdAt" TO "created_at";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectWorkUpload' AND column_name = 'milestoneId') THEN
    ALTER TABLE "ProjectWorkUpload" RENAME COLUMN "milestoneId" TO "milestone_id";
  END IF;
END $$;

-- Table "SocketConversation" (8 columns)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'SocketConversation' AND column_name = 'userAId') THEN
    ALTER TABLE "SocketConversation" RENAME COLUMN "userAId" TO "user_a_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'SocketConversation' AND column_name = 'userBId') THEN
    ALTER TABLE "SocketConversation" RENAME COLUMN "userBId" TO "user_b_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'SocketConversation' AND column_name = 'userAName') THEN
    ALTER TABLE "SocketConversation" RENAME COLUMN "userAName" TO "user_a_name";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'SocketConversation' AND column_name = 'userBName') THEN
    ALTER TABLE "SocketConversation" RENAME COLUMN "userBName" TO "user_b_name";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'SocketConversation' AND column_name = 'userAAvatarUrl') THEN
    ALTER TABLE "SocketConversation" RENAME COLUMN "userAAvatarUrl" TO "user_a_avatar_url";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'SocketConversation' AND column_name = 'userBAvatarUrl') THEN
    ALTER TABLE "SocketConversation" RENAME COLUMN "userBAvatarUrl" TO "user_b_avatar_url";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'SocketConversation' AND column_name = 'createdAt') THEN
    ALTER TABLE "SocketConversation" RENAME COLUMN "createdAt" TO "created_at";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'SocketConversation' AND column_name = 'updatedAt') THEN
    ALTER TABLE "SocketConversation" RENAME COLUMN "updatedAt" TO "updated_at";
  END IF;
END $$;

-- Table "SocketMessage" (5 columns)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'SocketMessage' AND column_name = 'conversationId') THEN
    ALTER TABLE "SocketMessage" RENAME COLUMN "conversationId" TO "conversation_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'SocketMessage' AND column_name = 'senderId') THEN
    ALTER TABLE "SocketMessage" RENAME COLUMN "senderId" TO "sender_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'SocketMessage' AND column_name = 'receiverId') THEN
    ALTER TABLE "SocketMessage" RENAME COLUMN "receiverId" TO "receiver_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'SocketMessage' AND column_name = 'createdAt') THEN
    ALTER TABLE "SocketMessage" RENAME COLUMN "createdAt" TO "created_at";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'SocketMessage' AND column_name = 'readAt') THEN
    ALTER TABLE "SocketMessage" RENAME COLUMN "readAt" TO "read_at";
  END IF;
END $$;

-- Table "SocketConversationClear" (3 columns)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'SocketConversationClear' AND column_name = 'conversationId') THEN
    ALTER TABLE "SocketConversationClear" RENAME COLUMN "conversationId" TO "conversation_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'SocketConversationClear' AND column_name = 'userId') THEN
    ALTER TABLE "SocketConversationClear" RENAME COLUMN "userId" TO "user_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'SocketConversationClear' AND column_name = 'clearedAt') THEN
    ALTER TABLE "SocketConversationClear" RENAME COLUMN "clearedAt" TO "cleared_at";
  END IF;
END $$;

-- Table "CallSession" (6 columns)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'CallSession' AND column_name = 'conversationId') THEN
    ALTER TABLE "CallSession" RENAME COLUMN "conversationId" TO "conversation_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'CallSession' AND column_name = 'startedBy') THEN
    ALTER TABLE "CallSession" RENAME COLUMN "startedBy" TO "started_by";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'CallSession' AND column_name = 'offerSdp') THEN
    ALTER TABLE "CallSession" RENAME COLUMN "offerSdp" TO "offer_sdp";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'CallSession' AND column_name = 'answerSdp') THEN
    ALTER TABLE "CallSession" RENAME COLUMN "answerSdp" TO "answer_sdp";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'CallSession' AND column_name = 'createdAt') THEN
    ALTER TABLE "CallSession" RENAME COLUMN "createdAt" TO "created_at";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'CallSession' AND column_name = 'updatedAt') THEN
    ALTER TABLE "CallSession" RENAME COLUMN "updatedAt" TO "updated_at";
  END IF;
END $$;

-- Table "MessageConversation" (7 columns)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'MessageConversation' AND column_name = 'clientId') THEN
    ALTER TABLE "MessageConversation" RENAME COLUMN "clientId" TO "client_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'MessageConversation' AND column_name = 'professionalId') THEN
    ALTER TABLE "MessageConversation" RENAME COLUMN "professionalId" TO "professional_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'MessageConversation' AND column_name = 'contractId') THEN
    ALTER TABLE "MessageConversation" RENAME COLUMN "contractId" TO "contract_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'MessageConversation' AND column_name = 'jobTitle') THEN
    ALTER TABLE "MessageConversation" RENAME COLUMN "jobTitle" TO "job_title";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'MessageConversation' AND column_name = 'createdAt') THEN
    ALTER TABLE "MessageConversation" RENAME COLUMN "createdAt" TO "created_at";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'MessageConversation' AND column_name = 'updatedAt') THEN
    ALTER TABLE "MessageConversation" RENAME COLUMN "updatedAt" TO "updated_at";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'MessageConversation' AND column_name = 'lastMessageAt') THEN
    ALTER TABLE "MessageConversation" RENAME COLUMN "lastMessageAt" TO "last_message_at";
  END IF;
END $$;

-- Table "Message" (4 columns)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Message' AND column_name = 'conversationId') THEN
    ALTER TABLE "Message" RENAME COLUMN "conversationId" TO "conversation_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Message' AND column_name = 'senderId') THEN
    ALTER TABLE "Message" RENAME COLUMN "senderId" TO "sender_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Message' AND column_name = 'createdAt') THEN
    ALTER TABLE "Message" RENAME COLUMN "createdAt" TO "created_at";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Message' AND column_name = 'readAt') THEN
    ALTER TABLE "Message" RENAME COLUMN "readAt" TO "read_at";
  END IF;
END $$;

-- Table "UserNotification" (4 columns)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'UserNotification' AND column_name = 'userId') THEN
    ALTER TABLE "UserNotification" RENAME COLUMN "userId" TO "user_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'UserNotification' AND column_name = 'createdAt') THEN
    ALTER TABLE "UserNotification" RENAME COLUMN "createdAt" TO "created_at";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'UserNotification' AND column_name = 'readAt') THEN
    ALTER TABLE "UserNotification" RENAME COLUMN "readAt" TO "read_at";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'UserNotification' AND column_name = 'clearedAt') THEN
    ALTER TABLE "UserNotification" RENAME COLUMN "clearedAt" TO "cleared_at";
  END IF;
END $$;

-- Table "UserNotificationState" (4 columns)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'UserNotificationState' AND column_name = 'userId') THEN
    ALTER TABLE "UserNotificationState" RENAME COLUMN "userId" TO "user_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'UserNotificationState' AND column_name = 'notificationKey') THEN
    ALTER TABLE "UserNotificationState" RENAME COLUMN "notificationKey" TO "notification_key";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'UserNotificationState' AND column_name = 'readAt') THEN
    ALTER TABLE "UserNotificationState" RENAME COLUMN "readAt" TO "read_at";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'UserNotificationState' AND column_name = 'clearedAt') THEN
    ALTER TABLE "UserNotificationState" RENAME COLUMN "clearedAt" TO "cleared_at";
  END IF;
END $$;

-- Table "Payment" (8 columns)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Payment' AND column_name = 'clientId') THEN
    ALTER TABLE "Payment" RENAME COLUMN "clientId" TO "client_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Payment' AND column_name = 'professionalId') THEN
    ALTER TABLE "Payment" RENAME COLUMN "professionalId" TO "professional_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Payment' AND column_name = 'jobId') THEN
    ALTER TABLE "Payment" RENAME COLUMN "jobId" TO "job_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Payment' AND column_name = 'commissionAmount') THEN
    ALTER TABLE "Payment" RENAME COLUMN "commissionAmount" TO "commission_amount";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Payment' AND column_name = 'providerReference') THEN
    ALTER TABLE "Payment" RENAME COLUMN "providerReference" TO "provider_reference";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Payment' AND column_name = 'idempotencyKey') THEN
    ALTER TABLE "Payment" RENAME COLUMN "idempotencyKey" TO "idempotency_key";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Payment' AND column_name = 'createdAt') THEN
    ALTER TABLE "Payment" RENAME COLUMN "createdAt" TO "created_at";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Payment' AND column_name = 'updatedAt') THEN
    ALTER TABLE "Payment" RENAME COLUMN "updatedAt" TO "updated_at";
  END IF;
END $$;

-- Table "Wallet" (3 columns)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Wallet' AND column_name = 'userId') THEN
    ALTER TABLE "Wallet" RENAME COLUMN "userId" TO "user_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Wallet' AND column_name = 'pendingBalance') THEN
    ALTER TABLE "Wallet" RENAME COLUMN "pendingBalance" TO "pending_balance";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Wallet' AND column_name = 'updatedAt') THEN
    ALTER TABLE "Wallet" RENAME COLUMN "updatedAt" TO "updated_at";
  END IF;
END $$;

-- Table "WalletTransaction" (4 columns)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'WalletTransaction' AND column_name = 'walletId') THEN
    ALTER TABLE "WalletTransaction" RENAME COLUMN "walletId" TO "wallet_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'WalletTransaction' AND column_name = 'paymentId') THEN
    ALTER TABLE "WalletTransaction" RENAME COLUMN "paymentId" TO "payment_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'WalletTransaction' AND column_name = 'metadataJson') THEN
    ALTER TABLE "WalletTransaction" RENAME COLUMN "metadataJson" TO "metadata_json";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'WalletTransaction' AND column_name = 'createdAt') THEN
    ALTER TABLE "WalletTransaction" RENAME COLUMN "createdAt" TO "created_at";
  END IF;
END $$;

-- Table "ProjectWithdrawal" (5 columns)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectWithdrawal' AND column_name = 'professionalId') THEN
    ALTER TABLE "ProjectWithdrawal" RENAME COLUMN "professionalId" TO "professional_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectWithdrawal' AND column_name = 'destinationType') THEN
    ALTER TABLE "ProjectWithdrawal" RENAME COLUMN "destinationType" TO "destination_type";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectWithdrawal' AND column_name = 'destinationLabel') THEN
    ALTER TABLE "ProjectWithdrawal" RENAME COLUMN "destinationLabel" TO "destination_label";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectWithdrawal' AND column_name = 'createdAt') THEN
    ALTER TABLE "ProjectWithdrawal" RENAME COLUMN "createdAt" TO "created_at";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectWithdrawal' AND column_name = 'updatedAt') THEN
    ALTER TABLE "ProjectWithdrawal" RENAME COLUMN "updatedAt" TO "updated_at";
  END IF;
END $$;

-- Table "ProjectDispute" (9 columns)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectDispute' AND column_name = 'trackingId') THEN
    ALTER TABLE "ProjectDispute" RENAME COLUMN "trackingId" TO "tracking_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectDispute' AND column_name = 'reporterId') THEN
    ALTER TABLE "ProjectDispute" RENAME COLUMN "reporterId" TO "reporter_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectDispute' AND column_name = 'reporterRole') THEN
    ALTER TABLE "ProjectDispute" RENAME COLUMN "reporterRole" TO "reporter_role";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectDispute' AND column_name = 'clientId') THEN
    ALTER TABLE "ProjectDispute" RENAME COLUMN "clientId" TO "client_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectDispute' AND column_name = 'professionalId') THEN
    ALTER TABLE "ProjectDispute" RENAME COLUMN "professionalId" TO "professional_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectDispute' AND column_name = 'issueType') THEN
    ALTER TABLE "ProjectDispute" RENAME COLUMN "issueType" TO "issue_type";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectDispute' AND column_name = 'attachmentsJson') THEN
    ALTER TABLE "ProjectDispute" RENAME COLUMN "attachmentsJson" TO "attachments_json";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectDispute' AND column_name = 'createdAt') THEN
    ALTER TABLE "ProjectDispute" RENAME COLUMN "createdAt" TO "created_at";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectDispute' AND column_name = 'updatedAt') THEN
    ALTER TABLE "ProjectDispute" RENAME COLUMN "updatedAt" TO "updated_at";
  END IF;
END $$;

-- Table "ProjectCompletionRequest" (5 columns)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectCompletionRequest' AND column_name = 'trackingId') THEN
    ALTER TABLE "ProjectCompletionRequest" RENAME COLUMN "trackingId" TO "tracking_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectCompletionRequest' AND column_name = 'clientId') THEN
    ALTER TABLE "ProjectCompletionRequest" RENAME COLUMN "clientId" TO "client_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectCompletionRequest' AND column_name = 'professionalId') THEN
    ALTER TABLE "ProjectCompletionRequest" RENAME COLUMN "professionalId" TO "professional_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectCompletionRequest' AND column_name = 'submittedAt') THEN
    ALTER TABLE "ProjectCompletionRequest" RENAME COLUMN "submittedAt" TO "submitted_at";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectCompletionRequest' AND column_name = 'updatedAt') THEN
    ALTER TABLE "ProjectCompletionRequest" RENAME COLUMN "updatedAt" TO "updated_at";
  END IF;
END $$;

-- Table "ProjectRevisionRequest" (5 columns)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectRevisionRequest' AND column_name = 'trackingId') THEN
    ALTER TABLE "ProjectRevisionRequest" RENAME COLUMN "trackingId" TO "tracking_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectRevisionRequest' AND column_name = 'clientId') THEN
    ALTER TABLE "ProjectRevisionRequest" RENAME COLUMN "clientId" TO "client_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectRevisionRequest' AND column_name = 'professionalId') THEN
    ALTER TABLE "ProjectRevisionRequest" RENAME COLUMN "professionalId" TO "professional_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectRevisionRequest' AND column_name = 'createdAt') THEN
    ALTER TABLE "ProjectRevisionRequest" RENAME COLUMN "createdAt" TO "created_at";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectRevisionRequest' AND column_name = 'updatedAt') THEN
    ALTER TABLE "ProjectRevisionRequest" RENAME COLUMN "updatedAt" TO "updated_at";
  END IF;
END $$;

-- Table "ProjectReviewRequest" (5 columns)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectReviewRequest' AND column_name = 'trackingId') THEN
    ALTER TABLE "ProjectReviewRequest" RENAME COLUMN "trackingId" TO "tracking_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectReviewRequest' AND column_name = 'clientId') THEN
    ALTER TABLE "ProjectReviewRequest" RENAME COLUMN "clientId" TO "client_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectReviewRequest' AND column_name = 'professionalId') THEN
    ALTER TABLE "ProjectReviewRequest" RENAME COLUMN "professionalId" TO "professional_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectReviewRequest' AND column_name = 'createdAt') THEN
    ALTER TABLE "ProjectReviewRequest" RENAME COLUMN "createdAt" TO "created_at";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProjectReviewRequest' AND column_name = 'updatedAt') THEN
    ALTER TABLE "ProjectReviewRequest" RENAME COLUMN "updatedAt" TO "updated_at";
  END IF;
END $$;

-- Table "ProfessionalVerification" (7 columns)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProfessionalVerification' AND column_name = 'userId') THEN
    ALTER TABLE "ProfessionalVerification" RENAME COLUMN "userId" TO "user_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProfessionalVerification' AND column_name = 'governmentIdUrl') THEN
    ALTER TABLE "ProfessionalVerification" RENAME COLUMN "governmentIdUrl" TO "government_id_url";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProfessionalVerification' AND column_name = 'licenseUrl') THEN
    ALTER TABLE "ProfessionalVerification" RENAME COLUMN "licenseUrl" TO "license_url";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProfessionalVerification' AND column_name = 'certificationsJson') THEN
    ALTER TABLE "ProfessionalVerification" RENAME COLUMN "certificationsJson" TO "certifications_json";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProfessionalVerification' AND column_name = 'insuranceUrl') THEN
    ALTER TABLE "ProfessionalVerification" RENAME COLUMN "insuranceUrl" TO "insurance_url";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProfessionalVerification' AND column_name = 'selfieUrl') THEN
    ALTER TABLE "ProfessionalVerification" RENAME COLUMN "selfieUrl" TO "selfie_url";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ProfessionalVerification' AND column_name = 'updatedAt') THEN
    ALTER TABLE "ProfessionalVerification" RENAME COLUMN "updatedAt" TO "updated_at";
  END IF;
END $$;

-- Table "verification_document_reviews" (5 columns)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'verification_document_reviews' AND column_name = 'userId') THEN
    ALTER TABLE "verification_document_reviews" RENAME COLUMN "userId" TO "user_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'verification_document_reviews' AND column_name = 'documentKey') THEN
    ALTER TABLE "verification_document_reviews" RENAME COLUMN "documentKey" TO "document_key";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'verification_document_reviews' AND column_name = 'reviewedAt') THEN
    ALTER TABLE "verification_document_reviews" RENAME COLUMN "reviewedAt" TO "reviewed_at";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'verification_document_reviews' AND column_name = 'createdAt') THEN
    ALTER TABLE "verification_document_reviews" RENAME COLUMN "createdAt" TO "created_at";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'verification_document_reviews' AND column_name = 'updatedAt') THEN
    ALTER TABLE "verification_document_reviews" RENAME COLUMN "updatedAt" TO "updated_at";
  END IF;
END $$;

-- Table "StoredFile" (7 columns)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'StoredFile' AND column_name = 'ownerId') THEN
    ALTER TABLE "StoredFile" RENAME COLUMN "ownerId" TO "owner_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'StoredFile' AND column_name = 'fileName') THEN
    ALTER TABLE "StoredFile" RENAME COLUMN "fileName" TO "file_name";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'StoredFile' AND column_name = 'mimeType') THEN
    ALTER TABLE "StoredFile" RENAME COLUMN "mimeType" TO "mime_type";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'StoredFile' AND column_name = 'sizeBytes') THEN
    ALTER TABLE "StoredFile" RENAME COLUMN "sizeBytes" TO "size_bytes";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'StoredFile' AND column_name = 'storageKey') THEN
    ALTER TABLE "StoredFile" RENAME COLUMN "storageKey" TO "storage_key";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'StoredFile' AND column_name = 'isPublic') THEN
    ALTER TABLE "StoredFile" RENAME COLUMN "isPublic" TO "is_public";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'StoredFile' AND column_name = 'createdAt') THEN
    ALTER TABLE "StoredFile" RENAME COLUMN "createdAt" TO "created_at";
  END IF;
END $$;

-- Table "audit_logs" (5 columns)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'audit_logs' AND column_name = 'actorId') THEN
    ALTER TABLE "audit_logs" RENAME COLUMN "actorId" TO "actor_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'audit_logs' AND column_name = 'entityType') THEN
    ALTER TABLE "audit_logs" RENAME COLUMN "entityType" TO "entity_type";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'audit_logs' AND column_name = 'entityId') THEN
    ALTER TABLE "audit_logs" RENAME COLUMN "entityId" TO "entity_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'audit_logs' AND column_name = 'requestId') THEN
    ALTER TABLE "audit_logs" RENAME COLUMN "requestId" TO "request_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'audit_logs' AND column_name = 'createdAt') THEN
    ALTER TABLE "audit_logs" RENAME COLUMN "createdAt" TO "created_at";
  END IF;
END $$;

-- Table "ApiToken" (5 columns)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ApiToken' AND column_name = 'userId') THEN
    ALTER TABLE "ApiToken" RENAME COLUMN "userId" TO "user_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ApiToken' AND column_name = 'tokenHash') THEN
    ALTER TABLE "ApiToken" RENAME COLUMN "tokenHash" TO "token_hash";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ApiToken' AND column_name = 'expiresAt') THEN
    ALTER TABLE "ApiToken" RENAME COLUMN "expiresAt" TO "expires_at";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ApiToken' AND column_name = 'usedAt') THEN
    ALTER TABLE "ApiToken" RENAME COLUMN "usedAt" TO "used_at";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ApiToken' AND column_name = 'createdAt') THEN
    ALTER TABLE "ApiToken" RENAME COLUMN "createdAt" TO "created_at";
  END IF;
END $$;

-- Table "OtpCode" (4 columns)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'OtpCode' AND column_name = 'codeHash') THEN
    ALTER TABLE "OtpCode" RENAME COLUMN "codeHash" TO "code_hash";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'OtpCode' AND column_name = 'expiresAt') THEN
    ALTER TABLE "OtpCode" RENAME COLUMN "expiresAt" TO "expires_at";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'OtpCode' AND column_name = 'consumedAt') THEN
    ALTER TABLE "OtpCode" RENAME COLUMN "consumedAt" TO "consumed_at";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'OtpCode' AND column_name = 'createdAt') THEN
    ALTER TABLE "OtpCode" RENAME COLUMN "createdAt" TO "created_at";
  END IF;
END $$;

-- Table "BrowserSubscription" (2 columns)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'BrowserSubscription' AND column_name = 'userId') THEN
    ALTER TABLE "BrowserSubscription" RENAME COLUMN "userId" TO "user_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'BrowserSubscription' AND column_name = 'createdAt') THEN
    ALTER TABLE "BrowserSubscription" RENAME COLUMN "createdAt" TO "created_at";
  END IF;
END $$;

-- Table "Faq" (3 columns)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Faq' AND column_name = 'displayOrder') THEN
    ALTER TABLE "Faq" RENAME COLUMN "displayOrder" TO "display_order";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Faq' AND column_name = 'createdAt') THEN
    ALTER TABLE "Faq" RENAME COLUMN "createdAt" TO "created_at";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Faq' AND column_name = 'updatedAt') THEN
    ALTER TABLE "Faq" RENAME COLUMN "updatedAt" TO "updated_at";
  END IF;
END $$;

-- Table "ContactRequest" (2 columns)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ContactRequest' AND column_name = 'createdAt') THEN
    ALTER TABLE "ContactRequest" RENAME COLUMN "createdAt" TO "created_at";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ContactRequest' AND column_name = 'updatedAt') THEN
    ALTER TABLE "ContactRequest" RENAME COLUMN "updatedAt" TO "updated_at";
  END IF;
END $$;

-- Table "Service" (6 columns)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Service' AND column_name = 'categoryId') THEN
    ALTER TABLE "Service" RENAME COLUMN "categoryId" TO "category_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Service' AND column_name = 'professionalId') THEN
    ALTER TABLE "Service" RENAME COLUMN "professionalId" TO "professional_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Service' AND column_name = 'imageUrl') THEN
    ALTER TABLE "Service" RENAME COLUMN "imageUrl" TO "image_url";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Service' AND column_name = 'isActive') THEN
    ALTER TABLE "Service" RENAME COLUMN "isActive" TO "is_active";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Service' AND column_name = 'createdAt') THEN
    ALTER TABLE "Service" RENAME COLUMN "createdAt" TO "created_at";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Service' AND column_name = 'updatedAt') THEN
    ALTER TABLE "Service" RENAME COLUMN "updatedAt" TO "updated_at";
  END IF;
END $$;

-- Table "page_configurations" (5 columns)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'page_configurations' AND column_name = 'pageId') THEN
    ALTER TABLE "page_configurations" RENAME COLUMN "pageId" TO "page_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'page_configurations' AND column_name = 'publishedConfig') THEN
    ALTER TABLE "page_configurations" RENAME COLUMN "publishedConfig" TO "published_config";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'page_configurations' AND column_name = 'createdAt') THEN
    ALTER TABLE "page_configurations" RENAME COLUMN "createdAt" TO "created_at";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'page_configurations' AND column_name = 'updatedAt') THEN
    ALTER TABLE "page_configurations" RENAME COLUMN "updatedAt" TO "updated_at";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'page_configurations' AND column_name = 'publishedAt') THEN
    ALTER TABLE "page_configurations" RENAME COLUMN "publishedAt" TO "published_at";
  END IF;
END $$;

-- Table "website_page_overrides" (2 columns)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'website_page_overrides' AND column_name = 'createdAt') THEN
    ALTER TABLE "website_page_overrides" RENAME COLUMN "createdAt" TO "created_at";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'website_page_overrides' AND column_name = 'updatedAt') THEN
    ALTER TABLE "website_page_overrides" RENAME COLUMN "updatedAt" TO "updated_at";
  END IF;
END $$;

-- Table "page_text_overrides" (3 columns)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'page_text_overrides' AND column_name = 'pagePath') THEN
    ALTER TABLE "page_text_overrides" RENAME COLUMN "pagePath" TO "page_path";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'page_text_overrides' AND column_name = 'elementKey') THEN
    ALTER TABLE "page_text_overrides" RENAME COLUMN "elementKey" TO "element_key";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'page_text_overrides' AND column_name = 'updatedAt') THEN
    ALTER TABLE "page_text_overrides" RENAME COLUMN "updatedAt" TO "updated_at";
  END IF;
END $$;

-- Table "legacy_users" (7 columns)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'legacy_users' AND column_name = 'passwordHash') THEN
    ALTER TABLE "legacy_users" RENAME COLUMN "passwordHash" TO "password_hash";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'legacy_users' AND column_name = 'googleId') THEN
    ALTER TABLE "legacy_users" RENAME COLUMN "googleId" TO "google_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'legacy_users' AND column_name = 'isEmailVerified') THEN
    ALTER TABLE "legacy_users" RENAME COLUMN "isEmailVerified" TO "is_email_verified";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'legacy_users' AND column_name = 'isPhoneVerified') THEN
    ALTER TABLE "legacy_users" RENAME COLUMN "isPhoneVerified" TO "is_phone_verified";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'legacy_users' AND column_name = 'createdAt') THEN
    ALTER TABLE "legacy_users" RENAME COLUMN "createdAt" TO "created_at";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'legacy_users' AND column_name = 'updatedAt') THEN
    ALTER TABLE "legacy_users" RENAME COLUMN "updatedAt" TO "updated_at";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'legacy_users' AND column_name = 'lastLogin') THEN
    ALTER TABLE "legacy_users" RENAME COLUMN "lastLogin" TO "last_login";
  END IF;
END $$;

-- Table "legacy_user_profiles" (4 columns)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'legacy_user_profiles' AND column_name = 'userId') THEN
    ALTER TABLE "legacy_user_profiles" RENAME COLUMN "userId" TO "user_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'legacy_user_profiles' AND column_name = 'fullName') THEN
    ALTER TABLE "legacy_user_profiles" RENAME COLUMN "fullName" TO "full_name";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'legacy_user_profiles' AND column_name = 'companyName') THEN
    ALTER TABLE "legacy_user_profiles" RENAME COLUMN "companyName" TO "company_name";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'legacy_user_profiles' AND column_name = 'profilePhoto') THEN
    ALTER TABLE "legacy_user_profiles" RENAME COLUMN "profilePhoto" TO "profile_photo";
  END IF;
END $$;

-- Table "legacy_professional_details" (9 columns)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'legacy_professional_details' AND column_name = 'userId') THEN
    ALTER TABLE "legacy_professional_details" RENAME COLUMN "userId" TO "user_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'legacy_professional_details' AND column_name = 'hourlyRate') THEN
    ALTER TABLE "legacy_professional_details" RENAME COLUMN "hourlyRate" TO "hourly_rate";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'legacy_professional_details' AND column_name = 'fixedRate') THEN
    ALTER TABLE "legacy_professional_details" RENAME COLUMN "fixedRate" TO "fixed_rate";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'legacy_professional_details' AND column_name = 'experienceYears') THEN
    ALTER TABLE "legacy_professional_details" RENAME COLUMN "experienceYears" TO "experience_years";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'legacy_professional_details' AND column_name = 'serviceType') THEN
    ALTER TABLE "legacy_professional_details" RENAME COLUMN "serviceType" TO "service_type";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'legacy_professional_details' AND column_name = 'serviceRadiusKm') THEN
    ALTER TABLE "legacy_professional_details" RENAME COLUMN "serviceRadiusKm" TO "service_radius_km";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'legacy_professional_details' AND column_name = 'availabilityStatus') THEN
    ALTER TABLE "legacy_professional_details" RENAME COLUMN "availabilityStatus" TO "availability_status";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'legacy_professional_details' AND column_name = 'portfolioUrl') THEN
    ALTER TABLE "legacy_professional_details" RENAME COLUMN "portfolioUrl" TO "portfolio_url";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'legacy_professional_details' AND column_name = 'isVerified') THEN
    ALTER TABLE "legacy_professional_details" RENAME COLUMN "isVerified" TO "is_verified";
  END IF;
END $$;

-- Table "legacy_locations" (4 columns)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'legacy_locations' AND column_name = 'userId') THEN
    ALTER TABLE "legacy_locations" RENAME COLUMN "userId" TO "user_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'legacy_locations' AND column_name = 'addressApprox') THEN
    ALTER TABLE "legacy_locations" RENAME COLUMN "addressApprox" TO "address_approx";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'legacy_locations' AND column_name = 'serviceRadiusKm') THEN
    ALTER TABLE "legacy_locations" RENAME COLUMN "serviceRadiusKm" TO "service_radius_km";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'legacy_locations' AND column_name = 'isBaseLocation') THEN
    ALTER TABLE "legacy_locations" RENAME COLUMN "isBaseLocation" TO "is_base_location";
  END IF;
END $$;

-- Table "legacy_verifications" (5 columns)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'legacy_verifications' AND column_name = 'professionalId') THEN
    ALTER TABLE "legacy_verifications" RENAME COLUMN "professionalId" TO "professional_id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'legacy_verifications' AND column_name = 'documentType') THEN
    ALTER TABLE "legacy_verifications" RENAME COLUMN "documentType" TO "document_type";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'legacy_verifications' AND column_name = 'documentUrl') THEN
    ALTER TABLE "legacy_verifications" RENAME COLUMN "documentUrl" TO "document_url";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'legacy_verifications' AND column_name = 'reviewedBy') THEN
    ALTER TABLE "legacy_verifications" RENAME COLUMN "reviewedBy" TO "reviewed_by";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'legacy_verifications' AND column_name = 'reviewedAt') THEN
    ALTER TABLE "legacy_verifications" RENAME COLUMN "reviewedAt" TO "reviewed_at";
  END IF;
END $$;

-- Table "email_templates" (5 columns)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'email_templates' AND column_name = 'bodyText') THEN
    ALTER TABLE "email_templates" RENAME COLUMN "bodyText" TO "body_text";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'email_templates' AND column_name = 'actionText') THEN
    ALTER TABLE "email_templates" RENAME COLUMN "actionText" TO "action_text";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'email_templates' AND column_name = 'actionUrl') THEN
    ALTER TABLE "email_templates" RENAME COLUMN "actionUrl" TO "action_url";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'email_templates' AND column_name = 'isActive') THEN
    ALTER TABLE "email_templates" RENAME COLUMN "isActive" TO "is_active";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'email_templates' AND column_name = 'isCustomized') THEN
    ALTER TABLE "email_templates" RENAME COLUMN "isCustomized" TO "is_customized";
  END IF;
END $$;

-- Table "sms_templates" (3 columns)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sms_templates' AND column_name = 'bodyText') THEN
    ALTER TABLE "sms_templates" RENAME COLUMN "bodyText" TO "body_text";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sms_templates' AND column_name = 'isActive') THEN
    ALTER TABLE "sms_templates" RENAME COLUMN "isActive" TO "is_active";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sms_templates' AND column_name = 'isCustomized') THEN
    ALTER TABLE "sms_templates" RENAME COLUMN "isCustomized" TO "is_customized";
  END IF;
END $$;

