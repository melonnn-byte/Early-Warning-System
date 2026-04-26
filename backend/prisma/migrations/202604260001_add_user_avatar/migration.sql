-- Add avatar column for user profile photo
ALTER TABLE "users"
ADD COLUMN IF NOT EXISTS "avatar" TEXT;
