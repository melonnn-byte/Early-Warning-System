-- Add explicit USER role and institution support for end-user accounts
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'USER';

ALTER TABLE "users"
ADD COLUMN IF NOT EXISTS "institution" TEXT;

ALTER TABLE "users"
ALTER COLUMN "role" SET DEFAULT 'USER';
