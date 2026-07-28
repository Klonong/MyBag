-- Replaces Supabase Auth with self-hosted JWT authentication.
-- Adds a password_hash column to store bcrypt-hashed credentials.
ALTER TABLE "public"."users"
  ADD COLUMN "password_hash" VARCHAR(255) NOT NULL DEFAULT '';

ALTER TABLE "public"."users"
  ALTER COLUMN "password_hash" DROP DEFAULT;
