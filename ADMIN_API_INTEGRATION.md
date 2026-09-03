# Admin API Integration Guide

The admin dashboard uses the typed service in `src/services/admin.service.ts` for categories, discounts, orders, customers, and settings. The dashboard and product catalog retain demo fallback data when their API returns no records. The remaining requirement is for the NestJS backend to expose the endpoints below.

## Conventions

- Base URL: `NEXT_PUBLIC_API_URL`
- Requests use JSON and the existing httpOnly auth cookie.
- List responses should use the existing envelope shape:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "OK",
  "data": []
}
```

- Admin endpoints must require an authenticated user with `role = admin`.
- Return `204` for successful deletes and use the existing error shape for failures.

## Products

Already consumed by the dashboard.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/products?page=1&limit=10&search=` | Paginated admin catalog |
| `POST` | `/products` | Create a product with images and color variants |
| `GET` | `/products/:id` | Product detail |
| `PATCH` | `/products/:id` | Update product data |
| `DELETE` | `/products/:id` | Remove product |

The list response must include `items` and `meta`:

```json
{
  "data": {
    "items": [],
    "meta": { "page": 1, "limit": 10, "total": 0, "totalPages": 1 }
  }
}
```

## Frontend implementation status

| Module | Frontend service | Current actions |
| --- | --- | --- |
| Categories | `adminService` | List, create, delete |
| Discounts | `adminService` | List, create, delete |
| Orders | `adminService` | List, filter, update status |
| Customers | `adminService` | Search and list |
| Settings | `adminService` | Get and update |

## Categories

| Method | Endpoint | Body |
| --- | --- | --- |
| `GET` | `/categories` | None |
| `POST` | `/categories` | `{ "name": "Tote" }` |
| `PATCH` | `/categories/:id` | `{ "name": "Totes" }` |
| `DELETE` | `/categories/:id` | None |

Suggested list item: `{ id, name, productCount, updatedAt }`.

## Discounts

Add a dedicated `discounts` table instead of overloading the product discount amount when campaign behavior is needed.

| Method | Endpoint | Body |
| --- | --- | --- |
| `GET` | `/admin/discounts` | Optional `status`, `page`, `limit`, `search` |
| `POST` | `/admin/discounts` | `{ name, code, type, value, startsAt, endsAt, isActive }` |
| `PATCH` | `/admin/discounts/:id` | Partial discount fields |
| `DELETE` | `/admin/discounts/:id` | None |

`type` should be `percentage` or `fixed`; `value` should be numeric and non-negative.

## Orders

| Method | Endpoint | Body |
| --- | --- | --- |
| `GET` | `/admin/orders?page=1&limit=10&status=` | Paginated order list |
| `GET` | `/admin/orders/:id` | Order detail and customer/address |
| `PATCH` | `/admin/orders/:id/status` | `{ "status": "shipped" }` |

Allowed statuses should match the database workflow: `pending`, `paid`, `shipped`, `completed`, `cancelled`.

## Customers

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/admin/customers?page=1&limit=10&search=` | Paginated customer directory |
| `GET` | `/admin/customers/:id` | Profile, addresses, and order history |
| `PATCH` | `/admin/customers/:id/status` | `{ "isActive": true }` |

Suggested list item: `{ id, name, email, orderCount, totalSpent, isActive, createdAt }`.

## Store Settings

| Method | Endpoint | Body |
| --- | --- | --- |
| `GET` | `/admin/settings` | None |
| `PATCH` | `/admin/settings` | `{ storeName, supportEmail, currency }` |

Settings should be scoped to one store or tenant if multi-store support is introduced.

## Frontend migration checklist

1. Add a service in `src/services` using the shared `api` client.
2. Replace the corresponding `admin-mock` import with the service call.
3. Keep loading, empty, error, and optimistic-update states in each page.
4. Add server-side pagination for every list endpoint.
5. Verify admin authorization on the server; the client route guard is not sufficient.
6. Add integration tests for authorization, validation, status transitions, and deletes.
