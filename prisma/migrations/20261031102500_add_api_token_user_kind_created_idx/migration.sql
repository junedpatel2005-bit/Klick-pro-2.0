-- CreateIndex
CREATE INDEX IF NOT EXISTS "ApiToken_userId_kind_createdAt_idx" ON "ApiToken"("userId", "kind", "createdAt");
