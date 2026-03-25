# GemVault — Observability

## Overview

Every API request produces structured log events in **Seq** with a correlation ID that ties together the nginx access log, all Serilog events for that request, and any exceptions. This lets you trace a single HTTP request from start to finish.

---

## Seq — Structured Log Viewer

### Development access

Browse to `http://localhost:8080` after running `docker compose up -d`.

### Production access

Seq UI is not publicly exposed in production. Use an SSH tunnel:

```bash
ssh -L 8080:localhost:80 user@your-vps
```

Then browse to `http://localhost:8080` on your local machine.

---

## Correlation IDs

Every request gets an `X-Correlation-ID` header (a UUID). If the caller sends one, it's used as-is. If not, the API generates one.

The ID flows through all layers:
1. **nginx** — logs it in the JSON access log as `correlation_id`
2. **CorrelationIdMiddleware** — echoes it on the response, pushes to Serilog `LogContext`
3. **Serilog** — every log event in that request gets `CorrelationId` attached
4. **Seq** — all events for one request share the same `CorrelationId`

**To trace a single request in Seq:**
```
CorrelationId = '5d6f3b2a-1234-...'
```

---

## What Gets Logged Per Request

Serilog's request logging middleware captures:

| Field | Value |
|-------|-------|
| `CorrelationId` | UUID shared across all events for this request |
| `UserId` | Authenticated user GUID, or `"anonymous"` |
| `RequestPath` | e.g. `/api/v1/gems` |
| `RequestMethod` | `GET`, `POST`, etc. |
| `StatusCode` | HTTP response code |
| `Elapsed` | Request duration in milliseconds |
| `UserAgent` | Browser/client user agent string |
| `MachineName` | Container hostname |
| `EnvironmentName` | `Development` or `Production` |

---

## Log Levels

| Scenario | Level |
|----------|-------|
| Normal requests | Information |
| 403 Forbidden | Warning |
| 400 Bad Request | Debug |
| 404 Not Found | Debug |
| 500 Server Error | Error (with full exception) |
| EF Core queries | Warning (slow) / filtered out (fast) |
| ASP.NET Core internals | Warning |

In Development, the default minimum level is `Debug`. In Production, it's `Information` with Microsoft/EF namespaces at `Warning`.

---

## Useful Seq Queries

**All errors in the last hour:**
```
@Level = 'Error' and @Timestamp > Now() - 1h
```

**All requests from a specific user:**
```
UserId = '3fa85f64-5717-4562-b3fc-2c963f66afa6'
```

**Slow requests (>500ms):**
```
Elapsed > 500
```

**All events for one correlation ID:**
```
CorrelationId = '5d6f3b2a-1234-5678-abcd-ef0123456789'
```

**All 500 errors today:**
```
StatusCode = 500 and @Timestamp > Today()
```

**Failed auth attempts:**
```
RequestPath like '/api/v1/auth/%' and StatusCode = 400
```

---

## Health Checks

`GET /health` checks two dependencies:

| Check | What it tests |
|-------|--------------|
| `ApplicationDbContext` | EF Core can open a connection to PostgreSQL |
| `minio` | HTTP GET to `http://minio:9000/minio/health/live` returns 200 |

**Healthy response:**
```json
{
  "status": "Healthy",
  "results": {
    "ApplicationDbContext": { "status": "Healthy" },
    "minio": { "status": "Healthy" }
  }
}
```

**Unhealthy response (HTTP 503):**
```json
{
  "status": "Unhealthy",
  "results": {
    "ApplicationDbContext": { "status": "Healthy" },
    "minio": { "status": "Unhealthy", "description": "Connection refused" }
  }
}
```

The deploy workflow polls `/health` after deployment — if it returns non-200, rollback triggers automatically.

---

## nginx JSON Access Logs

nginx logs every request in JSON format (in addition to the API's structured logs):

```json
{
  "time": "2026-03-25T10:30:00+00:00",
  "remote_addr": "192.168.1.1",
  "request_method": "GET",
  "request_uri": "/api/v1/gems",
  "status": "200",
  "request_time": "0.045",
  "correlation_id": "5d6f3b2a-1234-..."
}
```

nginx forwards the `X-Correlation-ID` header to the API. The same ID appears in both the nginx access log and Seq.

**View nginx logs:**
```bash
docker compose logs nginx --tail=100
```

---

## Container Logs

All containers write JSON-formatted logs with rotation:

```bash
# Tail a service
docker compose logs api --tail=50
docker compose logs frontend --tail=50

# Follow (live)
docker compose logs api -f

# All services
docker compose logs --tail=20
```

Log rotation settings (prevents disk fill):
- `api`: 50 MB max, 10 files
- `frontend`, `db`, `minio`, `nginx`: 20 MB max, 5 files
- `seq`, `backup`: 10 MB max, 3 files

---

## Seq Configuration

**Development:**
- Port 5341: log ingestion (Serilog sink)
- Port 8080: Seq web UI

**Production:**
- Port 5341: log ingestion only (internal Docker network)
- Seq UI: SSH tunnel only (not exposed publicly)
- `SEQ_CACHE_STORAGESIZE=512`: caps Seq's data storage at 512 MB to prevent disk fill

**Seq data** is persisted to `/opt/gemvault/data/seq` on the VPS.

---

## Debugging a Production Issue

**Step 1 — Get the correlation ID**

Find it in the response headers (`X-Correlation-ID`) or ask the user to check their browser's network tab.

**Step 2 — Search Seq**

```
CorrelationId = 'paste-id-here'
```

This shows every log event for that request in chronological order.

**Step 3 — Check the error event**

If there's an exception, the `@Level = 'Error'` event will contain the full stack trace and exception message.

**Step 4 — Check container health**

```bash
docker compose ps
curl http://localhost/api/health
```

**Step 5 — Check recent errors**

```bash
docker compose logs api --tail=100 | grep -i error
```

Or in Seq:
```
@Level = 'Error' and @Timestamp > Now() - 1h
```
