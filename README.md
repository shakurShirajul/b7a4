# RentNest Backend

RentNest is a backend API for a rental property marketplace. Tenants can browse properties, submit rental requests, pay with Stripe after approval, and review completed rentals. Landlords can manage properties and rental requests. Admins can manage users and categories.

## Live API

- Production: `https://b7a4-beta.vercel.app`
- Health check: `GET /`

## Mandatory Submission Checklist

| Requirement | Status |
|---|---|
| API Documentation | Done. See [RentNest.postman_collection.json](./RentNest.postman_collection.json). |
| Consistent Error Responses | Done. Errors return `{ success, message, errorDetails }`. |
| Commits | Done. Repository has 20 backend commits at time of review. |
| Input Validation | Done. Zod validation is used for endpoints with body, params, or query input. |
| Admin Credentials | Provided below. Seed script included. |
| Payment Integration | Done. Stripe checkout/session integration is implemented. |

## Admin Credentials

Use these credentials for evaluator/admin testing after running the admin seed script:

```txt
Email: admin@rentnest.com
Password: Admin@123456
```

The seed script upserts this admin user. You can override the credentials with `ADMIN_EMAIL` and `ADMIN_PASSWORD`.

```bash
pnpm seed:admin
```

To seed the database with demo users, categories, properties, rentals, Stripe-style completed payments, and reviews:

```bash
pnpm seed
```

## API Documentation

Postman documentation is available in:

[RentNest.postman_collection.json](./RentNest.postman_collection.json)

It covers:

- Health check
- Auth
- Users
- Categories
- Properties
- Rentals
- Payments
- Reviews

## Error Response Format

All expected errors use structured JSON:

```json
{
  "success": false,
  "message": "Validation failed",
  "errorDetails": [
    {
      "path": ["body", "email"],
      "message": "Invalid email address"
    }
  ]
}
```

## Payment Integration

Stripe is the implemented payment gateway.

Main payment routes:

- `POST /api/payments/create`
- `POST /api/payments/confirm`
- `POST /api/payments/webhook`
- `GET /api/payments`
- `GET /api/payments/:id`

Simulated/fake payments are not used.

## Environment Variables

Required:

```txt
DATABASE_URL=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_EXPIRES_IN=
JWT_REFRESH_EXPIRES_IN=
BCRYPT_SALT_ROUNDS=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
APP_URL=
CLIENT_URL=
```

Optional admin seed overrides:

```txt
ADMIN_EMAIL=
ADMIN_PASSWORD=
```

## Deployment Notes

Before production deployment:

```bash
pnpm install
pnpm run build
```

If the production database already exists, run migrations before using the new rental lifecycle statuses:

```bash
pnpm prisma migrate deploy
pnpm seed:admin
pnpm seed
```

## Core Routes

### Auth

- `POST /api/auth/login`
- `POST /api/auth/refresh-token`
- `POST /api/auth/logout`

### Users

- `POST /api/users/register`
- `GET /api/users`
- `GET /api/users/me`
- `GET /api/users/:id`
- `PATCH /api/users/me`
- `PATCH /api/users/update`
- `PATCH /api/users/status/:id`

### Categories

- `GET /api/categories`
- `GET /api/categories/:id`
- `POST /api/categories`
- `PATCH /api/categories/:id`
- `DELETE /api/categories/:id`

### Properties

- `GET /api/properties`
- `GET /api/properties/:id`
- `POST /api/properties`
- `PATCH /api/properties/:id`
- `DELETE /api/properties/:id`

Property filters:

```txt
searchTerm, city, country, categoryId, minPrice, maxPrice, amenities,
status, isAvailable, page, limit, sortBy, sortOrder
```

### Rentals

- `GET /api/rentals`
- `GET /api/rentals/:id`
- `POST /api/rentals`
- `PATCH /api/rentals/:id`
- `DELETE /api/rentals/:id`
- `PATCH /api/rentals/:id/status`

### Payments

- `POST /api/payments/create`
- `POST /api/payments/confirm`
- `POST /api/payments/webhook`
- `GET /api/payments`
- `GET /api/payments/:id`

### Reviews

- `GET /api/reviews`
- `GET /api/reviews/me`
- `GET /api/reviews/property/:propertyId`
- `POST /api/reviews`
