-- Pioma e-commerce schema for the NestJS backend (PostgreSQL).
-- Replaces the old Prisma/Supabase schema. Run against a fresh Postgres database.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ── Auth / users ──────────────────────────────────────────────────────────

CREATE TABLE "users" (
    "id"            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "email"         VARCHAR(255) NOT NULL UNIQUE,
    "password_hash" VARCHAR(255) NOT NULL,
    "name"          VARCHAR(255),
    "phone"         VARCHAR(255),
    "role"          VARCHAR(50) NOT NULL DEFAULT 'user', -- 'user' | 'admin'
    "is_active"     BOOLEAN NOT NULL DEFAULT true,
    "created_at"    TIMESTAMP(6) NOT NULL DEFAULT now(),
    "updated_at"    TIMESTAMP(6) NOT NULL DEFAULT now()
);

CREATE TABLE "addresses" (
    "id"             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id"        UUID NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE,
    "label"          VARCHAR(100),
    "recipient_name" VARCHAR(255) NOT NULL,
    "phone"          VARCHAR(255) NOT NULL,
    "address_line"   VARCHAR(500) NOT NULL,
    "address_line2"  VARCHAR(500),
    "city"           VARCHAR(255) NOT NULL,
    "province"       VARCHAR(255) NOT NULL,
    "postal_code"    VARCHAR(20) NOT NULL,
    "country"        VARCHAR(100) NOT NULL DEFAULT 'Indonesia',
    "is_default"     BOOLEAN NOT NULL DEFAULT false,
    "created_at"     TIMESTAMP(6) NOT NULL DEFAULT now(),
    "updated_at"     TIMESTAMP(6) NOT NULL DEFAULT now()
);

-- ── Catalog ───────────────────────────────────────────────────────────────

CREATE TABLE "categories" (
    "id"   BIGSERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE "badges" (
    "id"   BIGSERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL
);

CREATE TABLE "products" (
    "id"          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name"        VARCHAR(255) NOT NULL,
    "description" TEXT,
    "price"       DECIMAL(15, 2) NOT NULL,
    "discount"    DECIMAL(15, 2),
    "category_id" BIGINT NOT NULL REFERENCES "categories" ("id"),
    "badge_id"    BIGINT REFERENCES "badges" ("id"),
    "created_by"  UUID REFERENCES "users" ("id"),
    "updated_by"  UUID REFERENCES "users" ("id"),
    "created_at"  TIMESTAMP(6) NOT NULL DEFAULT now(),
    "updated_at"  TIMESTAMP(6) NOT NULL DEFAULT now()
);

CREATE TABLE "product_images" (
    "id"         BIGSERIAL PRIMARY KEY,
    "product_id" UUID NOT NULL REFERENCES "products" ("id") ON DELETE CASCADE,
    "image_url"  VARCHAR(1000) NOT NULL
);

CREATE TABLE "product_colors" (
    "id"         BIGSERIAL PRIMARY KEY,
    "product_id" UUID NOT NULL REFERENCES "products" ("id") ON DELETE CASCADE,
    "name"       VARCHAR(255),
    "hex_code"   VARCHAR(20),
    "stock"      BIGINT NOT NULL DEFAULT 0
);

CREATE TABLE "product_color_images" (
    "id"       BIGSERIAL PRIMARY KEY,
    "color_id" BIGINT NOT NULL REFERENCES "product_colors" ("id") ON DELETE CASCADE,
    "image_url" VARCHAR(1000) NOT NULL
);

-- ── Cart ──────────────────────────────────────────────────────────────────

CREATE TABLE "carts" (
    "id"         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id"    UUID NOT NULL UNIQUE REFERENCES "users" ("id") ON DELETE CASCADE,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT now()
);

CREATE TABLE "cart_items" (
    "id"         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "cart_id"    UUID NOT NULL REFERENCES "carts" ("id") ON DELETE CASCADE,
    "product_id" UUID NOT NULL REFERENCES "products" ("id"),
    "color_id"   BIGINT REFERENCES "product_colors" ("id"),
    "quantity"   INTEGER NOT NULL DEFAULT 1 CHECK ("quantity" > 0),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT now(),
    UNIQUE ("cart_id", "product_id", "color_id")
);

-- ── Wishlist ──────────────────────────────────────────────────────────────

CREATE TABLE "wishlist_items" (
    "id"         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id"    UUID NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE,
    "product_id" UUID NOT NULL REFERENCES "products" ("id") ON DELETE CASCADE,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT now(),
    UNIQUE ("user_id", "product_id")
);

-- ── Orders / checkout ─────────────────────────────────────────────────────

CREATE TABLE "orders" (
    "id"              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id"         UUID NOT NULL REFERENCES "users" ("id"),
    "address_id"      UUID REFERENCES "addresses" ("id"),
    "status"          VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending|paid|shipped|completed|cancelled
    "delivery_method"  VARCHAR(50) NOT NULL DEFAULT 'standard', -- standard|express
    "payment_method"  VARCHAR(50) NOT NULL DEFAULT 'card', -- card|bank|wallet
    "subtotal"        DECIMAL(15, 2) NOT NULL,
    "shipping_fee"    DECIMAL(15, 2) NOT NULL DEFAULT 0,
    "tax"             DECIMAL(15, 2) NOT NULL DEFAULT 0,
    "discount"        DECIMAL(15, 2) NOT NULL DEFAULT 0,
    "total"           DECIMAL(15, 2) NOT NULL,
    "created_at"      TIMESTAMP(6) NOT NULL DEFAULT now(),
    "updated_at"      TIMESTAMP(6) NOT NULL DEFAULT now()
);

CREATE TABLE "order_items" (
    "id"         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "order_id"   UUID NOT NULL REFERENCES "orders" ("id") ON DELETE CASCADE,
    "product_id" UUID NOT NULL REFERENCES "products" ("id"),
    "color_id"   BIGINT REFERENCES "product_colors" ("id"),
    "product_name" VARCHAR(255) NOT NULL,
    "color_name"   VARCHAR(255),
    "unit_price" DECIMAL(15, 2) NOT NULL,
    "quantity"   INTEGER NOT NULL CHECK ("quantity" > 0),
    "subtotal"   DECIMAL(15, 2) NOT NULL
);

-- ── Indexes ───────────────────────────────────────────────────────────────

CREATE INDEX "idx_addresses_user_id" ON "addresses" ("user_id");
CREATE INDEX "idx_products_category_id" ON "products" ("category_id");
CREATE INDEX "idx_products_badge_id" ON "products" ("badge_id");
CREATE INDEX "idx_product_images_product_id" ON "product_images" ("product_id");
CREATE INDEX "idx_product_colors_product_id" ON "product_colors" ("product_id");
CREATE INDEX "idx_product_color_images_color_id" ON "product_color_images" ("color_id");
CREATE INDEX "idx_cart_items_cart_id" ON "cart_items" ("cart_id");
CREATE INDEX "idx_wishlist_items_user_id" ON "wishlist_items" ("user_id");
CREATE INDEX "idx_orders_user_id" ON "orders" ("user_id");
CREATE INDEX "idx_order_items_order_id" ON "order_items" ("order_id");

-- ── Seed reference data ───────────────────────────────────────────────────

INSERT INTO "categories" ("name") VALUES
    ('tote'), ('crossbody'), ('shoulder'), ('backpacks'), ('clutches')
ON CONFLICT ("name") DO NOTHING;

INSERT INTO "badges" ("name") VALUES
    ('LIMITED'), ('BESTSELLER');
