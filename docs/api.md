# GemVault — API Reference

**Base URL:** `/api/v1`

All endpoints require `Authorization: Bearer {token}` unless marked `[public]`.

Responses use standard HTTP status codes. Error responses return:
```json
{ "message": "Description of the error" }
```

Validation errors (400) return:
```json
{ "errors": { "fieldName": ["Validation message"] } }
```

---

## Authentication

### POST /api/v1/auth/register

Register a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "Password1!",
  "role": "Collector"
}
```

`role`: `"Collector"` | `"Business"` | `"Admin"`

**Response 200:**
```json
{
  "accessToken": "eyJhbG...",
  "refreshToken": "abc123...",
  "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "email": "user@example.com",
  "role": "Collector"
}
```

---

### POST /api/v1/auth/login

**Request:**
```json
{ "email": "user@example.com", "password": "Password1!" }
```

**Response 200:** Same shape as register.

---

### POST /api/v1/auth/refresh

Exchange a refresh token for a new access token.

**Request:**
```json
{ "refreshToken": "abc123..." }
```

**Response 200:** Same shape as register (new tokens).

---

### POST /api/v1/auth/logout

Revoke the current refresh token. Requires auth.

**Request:**
```json
{ "refreshToken": "abc123..." }
```

**Response 200:** Empty.

---

## Gems

### GET /api/v1/gems

Paginated list of gems owned by the authenticated user.

**Query parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | int | Page number (default: 1) |
| `pageSize` | int | Items per page (default: 20) |
| `search` | string | Filter by name, species, or variety |
| `status` | string | `"InStock"` \| `"Sold"` — omit for all |
| `originId` | GUID | Filter by origin |

**Response 200:**
```json
{
  "items": [ { ...GemDto } ],
  "totalCount": 42,
  "page": 1,
  "pageSize": 20
}
```

**GemDto:**
```json
{
  "id": "3fa85f64-...",
  "name": "Burma Ruby",
  "species": "Corundum",
  "variety": "Ruby",
  "color": "Red",
  "clarity": "Eye-Clean",
  "cut": "Oval",
  "shape": "Oval",
  "treatment": "Heat",
  "caratWeight": 1.25,
  "attributes": { "dimensions": "7x5mm", "origin": "Burma" },
  "isSold": false,
  "coverPhotoUrl": "http://localhost/api/photos?url=...",
  "publicToken": "aabbcc...",
  "originId": "...",
  "origin": { "id": "...", "country": "Myanmar", "mine": "Mogok", "region": "Mandalay" },
  "createdAt": "2026-01-15T10:30:00Z"
}
```

---

### POST /api/v1/gems

Create a new gem.

**Request:**
```json
{
  "name": "Burma Ruby",
  "species": "Corundum",
  "variety": "Ruby",
  "color": "Red",
  "clarity": "Eye-Clean",
  "cut": "Oval",
  "shape": "Oval",
  "treatment": "Heat",
  "caratWeight": 1.25,
  "originId": "3fa85f64-...",
  "attributes": {}
}
```

All fields except `name` are optional.

**Response 200:** `"3fa85f64-..."` (new gem ID as string)

---

### GET /api/v1/gems/{id}

Get a single gem by ID. Returns 403 if the gem belongs to another user (not 404, to prevent enumeration).

**Response 200:** Full `GemDto` including `photos`, `certificates`, `saleInfo`.

---

### PUT /api/v1/gems/{id}

Update a gem. Request body is the same shape as POST.

**Response 200:** Empty.

---

### DELETE /api/v1/gems/{id}

Soft-delete a gem. Returns 404 if not found, 403 if owned by another user.

**Response 200:** Empty.

---

### POST /api/v1/gems/{id}/photos

Upload photos for a gem. `multipart/form-data`.

**Form fields:** One or more files with field name `photos`. Supported types: `image/jpeg`, `image/png`, `image/webp`, `image/gif`.

**Response 200:** Empty.

---

## Gem Parcels

All parcel endpoints mirror the gem endpoints exactly.

| Endpoint | Description |
|----------|-------------|
| `GET /api/v1/gem-parcels` | Paginated list (same query params as gems) |
| `POST /api/v1/gem-parcels` | Create parcel (same fields as gem + `quantity: int`) |
| `GET /api/v1/gem-parcels/{id}` | Get single parcel |
| `PUT /api/v1/gem-parcels/{id}` | Update parcel |
| `DELETE /api/v1/gem-parcels/{id}` | Soft-delete |
| `POST /api/v1/gem-parcels/{id}/photos` | Upload photos |

---

### POST /api/v1/gem-parcels/{id}/split

Split a parcel into individual gems.

**Request:**
```json
{
  "count": 3,
  "nameTemplate": "Burma Ruby {n}"
}
```

Creates `count` gems with `SourceParcelId` set to the parcel ID. Gem names are generated from the template with `{n}` replaced by the index (1-based).

**Response 200:** Empty.

---

## Origins

### GET /api/v1/origins `[public]`

List all origins. No authentication required — used to populate dropdowns.

**Response 200:** `OriginDto[]`

```json
[
  { "id": "...", "country": "Myanmar", "mine": "Mogok", "region": "Mandalay", "latitude": 22.9, "longitude": 96.5 }
]
```

---

### POST /api/v1/origins

Create a new origin.

**Request:**
```json
{ "country": "Myanmar", "mine": "Mogok", "region": "Mandalay", "latitude": 22.9, "longitude": 96.5 }
```

**Response 200:** New origin ID.

---

### GET /api/v1/origins/{id}

Get origin with all linked gems and parcels.

---

### PUT /api/v1/origins/{id} / DELETE /api/v1/origins/{id}

Standard update / soft-delete.

---

### GET /api/v1/origins/map-data

Returns all origins with gem/parcel counts — used by the provenance map.

**Response 200:**
```json
[
  {
    "id": "...",
    "country": "Myanmar",
    "mine": "Mogok",
    "latitude": 22.9,
    "longitude": 96.5,
    "gemCount": 12,
    "parcelCount": 3
  }
]
```

---

## Vocabulary

### GET /api/v1/vocabulary/{field} `[public]`

Get vocabulary values for a field.

`field`: `species` | `variety` | `color` | `cut` | `shape` | `clarity` | `treatment`

**Query parameters:**
- `parentValue` — filter varieties by parent species (e.g. `?parentValue=Corundum`)

**Response 200:**
```json
[
  { "id": "...", "field": "species", "value": "Corundum", "parentValue": null, "sortOrder": 1 }
]
```

---

### GET /api/v1/vocabulary/{field}/admin `[Admin]`

Get all values including `isActive` status. Admin only.

---

### POST /api/v1/vocabulary `[Admin]`

Create a vocabulary entry.

**Request:**
```json
{ "field": "species", "value": "Phenakite", "parentValue": null, "sortOrder": 100 }
```

---

### PUT /api/v1/vocabulary/{id} / DELETE /api/v1/vocabulary/{id} `[Admin]`

Update / delete a vocabulary entry. Admin only.

---

## Suppliers

### GET /api/v1/suppliers

List all suppliers for the authenticated user.

**Response 200:** `SupplierDto[]`
```json
[{ "id": "...", "name": "Bangkok Gems Ltd", "contactInfo": "contact@bgems.com", "notes": "" }]
```

---

### POST /api/v1/suppliers

**Request:** `{ "name": "...", "contactInfo": "...", "notes": "..." }`

**Response 200:** New supplier ID.

---

### GET /api/v1/suppliers/{id} / PUT / DELETE

Standard get, update, soft-delete.

---

## Purchase Orders

### GET /api/v1/purchase-orders

List purchase orders.

**Response 200:** `PurchaseOrderDto[]` (includes `items[]` array)

---

### POST /api/v1/purchase-orders

**Request:**
```json
{
  "supplierId": "3fa85f64-...",
  "orderDate": "2026-03-01",
  "notes": "Optional notes",
  "items": [
    {
      "description": "Burma Ruby parcel",
      "costPrice": 1500.00,
      "quantity": 1,
      "gemId": null,
      "gemParcelId": null
    }
  ]
}
```

`gemId` and `gemParcelId` are optional per line item. `orderDate` accepts `YYYY-MM-DD` strings.

**Response 200:** New order ID.

---

### GET /api/v1/purchase-orders/{id} / PUT / DELETE

Standard get (includes full item list), update, soft-delete.

---

## Sales

### GET /api/v1/sales

List sales.

**Response 200:** `SaleDto[]` (includes `items[]` array with linked gem/parcel info)

---

### POST /api/v1/sales

**Request:**
```json
{
  "buyerName": "John Smith",
  "buyerEmail": "john@example.com",
  "saleDate": "2026-03-15",
  "notes": "",
  "items": [
    {
      "gemId": "3fa85f64-...",
      "gemParcelId": null,
      "quantity": 1,
      "salePrice": 2500.00
    }
  ]
}
```

**Response 200:** New sale ID.

---

### GET /api/v1/sales/{id} / PUT / DELETE

Standard get, update, soft-delete.

---

## Certificates

### POST /api/v1/gems/{gemId}/certificates

Upload a lab certificate PDF for a gem.

**Form fields (`multipart/form-data`):**

| Field | Type | Required |
|-------|------|----------|
| `file` | PDF file | Yes |
| `certNumber` | string | No |
| `lab` | string | No |
| `grade` | string | No |
| `issueDate` | date string | No |

**Response 200:** New certificate ID.

---

### DELETE /api/v1/certificates/{id}

Delete a certificate (removes PDF from MinIO + DB record).

**Response 200:** Empty.

---

## Dashboard

### GET /api/v1/dashboard/stats

Returns aggregated statistics for the dashboard KPI cards.

**Query parameters:**
- `from` — ISO date string, start of range (optional)
- `to` — ISO date string, end of range (optional)

**Response 200:**
```json
{
  "gemsInStock": 42,
  "inventoryValue": 15400.00,
  "totalRevenue": 8200.00,
  "netProfit": 3100.00,
  "marginPercent": 37.8,
  "supplierCount": 5,
  "orderCount": 12,
  "saleCount": 8,
  "recentSales": [ { "id": "...", "buyerName": "...", "saleDate": "...", "total": 2500.00 } ],
  "recentGems": [ { "id": "...", "name": "...", "createdAt": "..." } ],
  "revenueByMonth": [
    { "month": "2025-10", "revenue": 1200.00 }
  ],
  "speciesBreakdown": [
    { "species": "Corundum", "count": 18 }
  ]
}
```

---

## Public Scan

### GET /api/v1/public/{token} `[public]`

Get public-facing gem or parcel details by public token UUID. No authentication required.

Returns 404 (not 403) if the token is invalid, the gem is deleted, or the owner has disabled public access. This prevents token enumeration.

**Response 200:**
```json
{
  "type": "Gem",
  "name": "Burma Ruby",
  "species": "Corundum",
  "variety": "Ruby",
  "color": "Red",
  "caratWeight": 1.25,
  "photoUrls": ["..."],
  "origin": { "country": "Myanmar", "mine": "Mogok" },
  "certificates": [ { "lab": "GIA", "certNumber": "1234567890", "grade": "AA" } ]
}
```

Purchase prices and private notes are **never** included in the public response.

---

## Health

### GET /health `[public]`

Returns the health of all dependencies.

**Response 200 (healthy):**
```json
{
  "status": "Healthy",
  "results": {
    "ApplicationDbContext": { "status": "Healthy" },
    "minio": { "status": "Healthy" }
  }
}
```

**Response 503** if any dependency is unhealthy.

---

## OpenAPI / Scalar

`GET /scalar` — Interactive API documentation. **Development only** — not available in Production.

---

## Rate Limiting

| Scope | Limit |
|-------|-------|
| Auth endpoints (`/api/v1/auth/*`) | 10 requests/minute |
| All other API endpoints | 300 requests/minute |
| Public endpoints (`/api/v1/public/*`, `/api/v1/origins`, `/api/v1/vocabulary/*`) | 60 requests/minute |

Rate limit responses return HTTP 429 with a `Retry-After` header.

---

## Pagination

All list endpoints return a `PagedResult<T>`:

```json
{
  "items": [...],
  "totalCount": 100,
  "page": 1,
  "pageSize": 20
}
```

Default `pageSize` is 20. There is no upper limit enforced server-side, but large values impact performance.
