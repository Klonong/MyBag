# Pioma ↔ NestJS Backend Integration Guide

Pioma's Next.js app is a pure frontend that talks to a separate **Pioma API**
backend over HTTP. This document describes the contract the frontend expects.

## Backend overview

Pioma API is a [NestJS](https://nestjs.com/) 11 REST API secured with JWT auth,
backed by PostgreSQL via [Prisma](https://www.prisma.io/), with Redis-backed
caching/queues and OpenAPI (Swagger) docs.

| Layer | Technology |
|---|---|
| Runtime | Node.js + TypeScript |
| Framework | NestJS 11 (`@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express`) |
| Database | PostgreSQL |
| ORM | Prisma (`@prisma/client`, `prisma`) |
| Auth | JWT (`@nestjs/jwt`), password hashing with `bcrypt` |
| Caching | `@nestjs/cache-manager` + `cache-manager` |
| Queues | `@nestjs/bullmq` + `bullmq` (Redis-backed) |
| Rate limiting | `@nestjs/throttler` (default: 20 requests / 60s) |
| API docs | `@nestjs/swagger` (OpenAPI, served at `/docs`) |
| Validation | `class-validator` / `class-transformer` (global `ValidationPipe`, `whitelist` + `transform`) |
| Security headers | `helmet` |
| Testing | `jest`, `supertest`, `ts-jest` |

Backend project structure:
```
prisma/
  schema.prisma        # Prisma schema (PostgreSQL datasource)
src/
  main.ts               # App bootstrap: helmet, validation pipe, Swagger at /docs
  app.module.ts         # Root module wiring Config, Throttler, Prisma, Auth
  common/
    filters/            # Global exception filters
  config/
    configuration.ts    # Typed config loader (port, database, jwt, redis)
  database/
    prisma.module.ts    # Global Prisma module
    prisma.service.ts   # PrismaClient wrapper as injectable service
  modules/
    auth/                # Authentication module (controller, service)
```

Backend environment variables (`.env` on the NestJS side):

| Variable | Purpose | Default |
|---|---|---|
| `PORT` | HTTP port | `3000` |
| `DATABASE_URL` | PostgreSQL connection string | — |
| `JWT_SECRET` | Secret used to sign JWTs | — |
| `JWT_EXPIRES_IN` | JWT access token TTL | `15m` |
| `REDIS_HOST` | Redis host (cache/queues) | `localhost` |
| `REDIS_PORT` | Redis port | `6379` |

---

## 1. Frontend wiring

| File | Purpose |
|---|---|
| [src/lib/api.ts](src/lib/api.ts) | `fetch` wrapper. Sends `credentials: "include"` on every request and returns `{ data, error }`. |
| [src/services/auth.service.ts](src/services/auth.service.ts) | Login / register / logout / current-session calls. |
| [src/services/profile.service.ts](src/services/profile.service.ts) | Read/update the logged-in user's profile. |
| [src/services/upload.service.ts](src/services/upload.service.ts) | Uploads product images to the backend. |
| [src/context/AuthProvider.tsx](src/context/AuthProvider.tsx) | Calls `authService.getMe()` on mount, exposes `{ user, profile, loading, refresh }`. |
| [src/app/(main)/shop/actions.ts](src/app/(main)/shop/actions.ts) | Server Action, `fetch`es `/categories` at build/request time. |
| [src/app/admin/create-product/actions.ts](src/app/admin/create-product/actions.ts) | Server Actions for admin category/badge lookups and product creation. |

### Environment variables (`.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Auth model
- The backend issues a JWT on login/register and sets it as an **httpOnly cookie**
  (e.g. `access_token`). The frontend never reads the token directly — it just
  sends `credentials: "include"` and relies on the cookie.
- CORS on the NestJS side must allow the Next.js origin with `credentials: true`.

```ts
// main.ts
app.enableCors({
  origin: process.env.FRONTEND_URL, // e.g. http://localhost:3000
  credentials: true,
});
```

---

## 2. Required REST endpoints

All responses are JSON. Error responses should be `{ "message": string }` with a
non-2xx status code — the frontend surfaces `message` in toasts.

### Auth — `/auth`
| Method | Path | Body | Response | Notes |
|---|---|---|---|---|
| POST | `/auth/register` | `{ email, password, phone }` | `{ user }` | Creates user, sets JWT cookie. |
| POST | `/auth/login` | `{ email, password }` | `{ user }` | Verifies password, sets JWT cookie. |
| POST | `/auth/logout` | — | `204` | Clears the JWT cookie. |
| GET | `/auth/me` | — | `{ user }` or `401` | Reads the JWT cookie, returns the current user. |
| GET | `/auth/google`, `/auth/apple` | — | redirect | Optional OAuth (Passport strategies); redirects back to the frontend with the cookie set. |

`user` shape:
```ts
{
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  role: "user" | "admin";
}
```

### Users — `/users`
| Method | Path | Body | Response |
|---|---|---|---|
| GET | `/users/:id` | — | `user` |
| PATCH | `/users/:id` | `{ name?, phone? }` | `user` |

Guard these routes so a user can only read/update their own record (or an admin).

### Catalog — `/categories`, `/badges`, `/products`
| Method | Path | Body | Response |
|---|---|---|---|
| GET | `/categories` | — | `{ id: number; name: string }[]` |
| GET | `/badges` | — | `{ id: number; name: string }[]` |
| GET | `/products` | query: `category`, `page`, etc. | `Product[]` |
| GET | `/products/:id` | — | `Product` |
| POST | `/products` | `CreateProductInput` (below) | `Product` — admin only |

`CreateProductInput` (matches [src/app/admin/create-product/actions.ts](src/app/admin/create-product/actions.ts)):
```ts
{
  name: string;
  description: string;
  price: number;
  discount?: number;
  categoryId: number;
  badgeId: number;
  productImageUrls: string[];
  colors: {
    name: string;
    hexCode: string;
    stock: number;
    imageUrls: string[];
  }[];
}
```

### Uploads — `/uploads`
| Method | Path | Body | Response |
|---|---|---|---|
| POST | `/uploads` | `multipart/form-data` — fields `file`, `folder` | `{ url: string }` |

Store files on disk/S3/Supabase Storage/whatever the backend prefers; only the
public `url` matters to the frontend.

### Cart, wishlist, addresses, orders
Not yet wired up in the UI beyond mock data, but the SQL schema
([sql/schema.sql](sql/schema.sql)) already models them for when these endpoints are
built:

- `GET/POST/PATCH/DELETE /cart` (backed by `carts` + `cart_items`)
- `GET/POST/DELETE /wishlist` (backed by `wishlist_items`)
- `GET/POST/PATCH/DELETE /addresses` (backed by `addresses`)
- `GET/POST /orders` (backed by `orders` + `order_items`)

---

## 3. Database

[sql/schema.sql](sql/schema.sql) documents the tables the frontend expects:
`users`, `addresses`, `categories`, `badges`, `products`, `product_images`,
`product_colors`, `product_color_images`, `carts`, `cart_items`,
`wishlist_items`, `orders`, `order_items`. On the Pioma API side these are
modeled 1:1 in `prisma/schema.prisma` and applied via `prisma migrate`.

Backend setup notes:
- `PrismaService` (in `src/database/`) wraps `PrismaClient` as a global,
  injectable Nest provider.
- `@nestjs/jwt` issues the access token; a custom guard reads it back out of
  the httpOnly cookie (no `passport-jwt` cookie extractor needed unless added
  later).
- `bcrypt` hashes `users.password_hash`.
- A `multer`-backed controller (`@nestjs/platform-express` `FileInterceptor`)
  handles `/uploads`.
- `@nestjs/swagger` serves interactive API docs at `/docs`.

---

## 4. Local dev checklist

1. In the Pioma API repo: `npm install`, `cp .env.example .env` and fill in
   `DATABASE_URL`, `JWT_SECRET`, `REDIS_HOST`/`REDIS_PORT`, then
   `npm run prisma:generate && npm run prisma:migrate`.
2. `npm run start:dev` to run the NestJS API on port `3000` (or set `PORT` /
   update `NEXT_PUBLIC_API_URL` here to match).
3. Set `FRONTEND_URL=http://localhost:3000` and enable CORS with credentials on the
   NestJS app.
4. Set `NEXT_PUBLIC_API_URL` in `.env.local` for the Next.js app to match the
   API's `PORT` (e.g. `http://localhost:3000`).
5. `npm run dev` in this repo — sign up, sign in, and admin product creation should
   all round-trip through the NestJS API. Swagger docs are at
   `http://localhost:<PORT>/docs`.
