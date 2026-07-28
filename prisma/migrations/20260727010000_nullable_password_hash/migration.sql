-- Allow OAuth-only users (Google/Apple via Auth.js) to have no local password.
ALTER TABLE "public"."users"
  ALTER COLUMN "password_hash" DROP NOT NULL;
