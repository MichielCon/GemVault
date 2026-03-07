import { cookies } from "next/headers";
import type {
  AuthResponse,
  GemDto,
  GemSummaryDto,
  GemParcelDto,
  GemParcelSummaryDto,
  OriginDto,
  PagedResult,
  PublicGemDto,
  VocabularyItemDto,
  SupplierDto,
  PurchaseOrderDto,
  PurchaseOrderSummaryDto,
  SaleDto,
  SaleSummaryDto,
  DashboardStatsDto,
} from "./types";

// Server-side: uses INTERNAL_API_URL so SSR requests go container-to-container.
// Client-side callers use Server Actions (which run server-side too).
function baseUrl() {
  return (
    process.env.INTERNAL_API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:5000"
  );
}

async function authHeader(): Promise<Record<string, string>> {
  const store = await cookies();
  const token = store.get("access_token")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function get<T>(path: string, auth = true): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (auth) Object.assign(headers, await authHeader());

  const res = await fetch(`${baseUrl()}${path}`, {
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new ApiError(res.status, body);
  }
  return res.json() as Promise<T>;
}

async function post<T>(path: string, body: unknown, auth = true): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (auth) Object.assign(headers, await authHeader());

  const res = await fetch(`${baseUrl()}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new ApiError(res.status, text);
  }
  return res.json() as Promise<T>;
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authApi = {
  login: (email: string, password: string) =>
    post<AuthResponse>("/api/v1/auth/login", { email, password }, false),
  register: (email: string, password: string, role: string) =>
    post<AuthResponse>("/api/v1/auth/register", { email, password, role }, false),
  logout: () => post<void>("/api/v1/auth/logout", {}).catch(() => {}),
};

// ─── Gems ─────────────────────────────────────────────────────────────────────

export const gemsApi = {
  list: (page = 1, pageSize = 20, search?: string, originId?: string) => {
    const q = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    if (search) q.set("search", search);
    if (originId) q.set("originId", originId);
    return get<PagedResult<GemSummaryDto>>(`/api/v1/gems?${q}`);
  },
  get: (id: string) => get<GemDto>(`/api/v1/gems/${id}`),
};

// ─── Vocabulary ───────────────────────────────────────────────────────────────

export const vocabularyApi = {
  getField: (field: string, parentValue?: string) => {
    const q = parentValue ? `?parentValue=${encodeURIComponent(parentValue)}` : "";
    return get<VocabularyItemDto[]>(`/api/v1/vocabulary/${field}${q}`);
  },
};

// ─── Origins ──────────────────────────────────────────────────────────────────

export const originsApi = {
  list: (search?: string) => {
    const q = search ? `?search=${encodeURIComponent(search)}` : "";
    return get<OriginDto[]>(`/api/v1/origins${q}`, false);
  },
  get: (id: string) => get<OriginDto>(`/api/v1/origins/${id}`, false),
};

// ─── GemParcels ───────────────────────────────────────────────────────────────

export const parcelsApi = {
  list: (page = 1, pageSize = 20, search?: string, originId?: string) => {
    const q = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    if (search) q.set("search", search);
    if (originId) q.set("originId", originId);
    return get<PagedResult<GemParcelSummaryDto>>(`/api/v1/gem-parcels?${q}`);
  },
  get: (id: string) => get<GemParcelDto>(`/api/v1/gem-parcels/${id}`),
};

// ─── Suppliers ────────────────────────────────────────────────────────────────

export const suppliersApi = {
  list: (search?: string) => {
    const q = search ? `?search=${encodeURIComponent(search)}` : "";
    return get<SupplierDto[]>(`/api/v1/suppliers${q}`);
  },
  get: (id: string) => get<SupplierDto>(`/api/v1/suppliers/${id}`),
};

// ─── PurchaseOrders ───────────────────────────────────────────────────────────

export const purchaseOrdersApi = {
  list: (page = 1, pageSize = 20) =>
    get<PagedResult<PurchaseOrderSummaryDto>>(
      `/api/v1/purchase-orders?page=${page}&pageSize=${pageSize}`
    ),
  get: (id: string) => get<PurchaseOrderDto>(`/api/v1/purchase-orders/${id}`),
};

// ─── Sales ────────────────────────────────────────────────────────────────────

export const salesApi = {
  list: (page = 1, pageSize = 20) =>
    get<PagedResult<SaleSummaryDto>>(`/api/v1/sales?page=${page}&pageSize=${pageSize}`),
  get: (id: string) => get<SaleDto>(`/api/v1/sales/${id}`),
};

// ─── Dashboard ────────────────────────────────────────────────────────────────

export const dashboardApi = {
  stats: () => get<DashboardStatsDto>(`/api/v1/dashboard/stats`),
};

// ─── Public scan ──────────────────────────────────────────────────────────────

export const publicApi = {
  scan: (token: string) => get<PublicGemDto>(`/api/v1/public/${token}`, false),
};
