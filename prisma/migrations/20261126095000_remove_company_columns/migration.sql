-- Safe & idempotent migration: preserve professional service bios in users.bio and drop all company_* columns

ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "bio" TEXT;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'users'
      AND column_name = 'company_description'
  ) THEN
    EXECUTE '
      UPDATE "users"
      SET "bio" = COALESCE("bio", "company_description")
      WHERE "role" = ''PROFESSIONAL'' AND "company_description" IS NOT NULL
    ';
  END IF;
END $$;

ALTER TABLE "users" DROP COLUMN IF EXISTS "company_name";
ALTER TABLE "users" DROP COLUMN IF EXISTS "company_website";
ALTER TABLE "users" DROP COLUMN IF EXISTS "company_description";

ALTER TABLE "client_profiles" DROP COLUMN IF EXISTS "company_name";
ALTER TABLE "client_profiles" DROP COLUMN IF EXISTS "company_website";
ALTER TABLE "client_profiles" DROP COLUMN IF EXISTS "company_description";

ALTER TABLE "legacy_user_profiles" DROP COLUMN IF EXISTS "company_name";
