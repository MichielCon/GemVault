import { cookies } from "next/headers";
import type {
  AuthResponse,
  CertificateDto,
  GemDto,
  GemSummaryDto,
  GemParcelDto,
  GemParcelSummaryDto,
  OriginDto,
  OriginMapDto,
  PagedResult,
  PublicGemDto,
  VocabularyItemDto,
  VocabularyAdminDto,
  SupplierDto,
  PurchaseOrderDto,
  PurchaseOrderSummaryDto,
  SaleDto,
  SaleSummaryDto,
  DashboardStatsDto,
  AdminUserDto,
  AdminStatsDto,
  AdminSessionDto,
  AdminPublicTokenDto,
  AdminPhotoDto,
  AdminCertificateDto,
  ProfileDto,
  ProfileSessionDto,
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

async function put<T>(path: string, body: unknown, auth = true): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (auth) Object.assign(headers, await authHeader());

  const res = await fetch(`${baseUrl()}${path}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new ApiError(res.status, text);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

async function del(path: string, auth = true): Promise<void> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (auth) Object.assign(headers, await authHeader());

  const res = await fetch(`${baseUrl()}${path}`, {
    method: "DELETE",
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new ApiError(res.status, text);
  }
}

async function postForm<T>(path: string, body: FormData, auth = true): Promise<T> {
  const headers: Record<string, string> = {};
  // Do NOT set Content-Type — browser sets it with the multipart boundary automatically.
  if (auth) Object.assign(headers, await authHeader());

  const res = await fetch(`${baseUrl()}${path}`, {
    method: "POST",
    headers,
    body,
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
  forgotPassword: (email: string) =>
    post<void>("/api/v1/auth/forgot-password", { email }, false),
  resetPassword: (email: string, token: string, newPassword: string) =>
    post<void>("/api/v1/auth/reset-password", { email, token, newPassword }, false),
};

// ─── Gems ─────────────────────────────────────────────────────────────────────

export const gemsApi = {
  list: (page = 1, pageSize = 20, search?: string, originId?: string, status?: string, gemStatus?: string) => {
    const q = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    if (search) q.set("search", search);
    if (originId) q.set("originId", originId);
    if (status && status !== "All") q.set("status", status);
    if (gemStatus && gemStatus !== "All") q.set("gemStatusFilter", gemStatus);
    return get<PagedResult<GemSummaryDto>>(`/api/v1/gems?${q}`);
  },
  get: (id: string) => get<GemDto>(`/api/v1/gems/${id}`),
  uploadCertificate: (gemId: string, formData: FormData) =>
    postForm<CertificateDto>(`/api/v1/gems/${gemId}/certificates`, formData),
  deleteCertificate: (certId: string) => del(`/api/v1/certificates/${certId}`),
};

// ─── Vocabulary ───────────────────────────────────────────────────────────────

export const vocabularyApi = {
  getField: (field: string, parentValue?: string) => {
    const q = parentValue ? `?parentValue=${encodeURIComponent(parentValue)}` : "";
    return get<VocabularyItemDto[]>(`/api/v1/vocabulary/${field}${q}`);
  },
};

export const vocabularyAdminApi = {
  list: (field: string) =>
    get<VocabularyAdminDto[]>(`/api/v1/vocabulary/${encodeURIComponent(field)}/admin`),
  create: (payload: { field: string; value: string; parentValue: string | null; sortOrder: number }) =>
    post<VocabularyAdminDto>("/api/v1/vocabulary", payload),
  update: (id: number, payload: { id: number; value: string; parentValue: string | null; sortOrder: number }) =>
    put<VocabularyAdminDto>(`/api/v1/vocabulary/${id}`, payload),
  delete: (id: number) => del(`/api/v1/vocabulary/${id}`),
};

// ─── Origins ──────────────────────────────────────────────────────────────────

export const originsApi = {
  list: (search?: string) => {
    const q = search ? `?search=${encodeURIComponent(search)}` : "";
    return get<OriginDto[]>(`/api/v1/origins${q}`, false);
  },
  get: (id: string) => get<OriginDto>(`/api/v1/origins/${id}`, false),
  mapData: () => get<OriginMapDto[]>("/api/v1/origins/map-data"),
  byCountry: (country: string) =>
    get<OriginDto[]>(`/api/v1/origins/by-country?country=${encodeURIComponent(country)}`, false),
  findOrCreate: (data: { country: string; locality: string | null }) =>
    post<OriginDto>("/api/v1/origins/find-or-create", data),
};

// ─── GemParcels ───────────────────────────────────────────────────────────────

export const parcelsApi = {
  list: (page = 1, pageSize = 20, search?: string, originId?: string, status?: string) => {
    const q = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    if (search) q.set("search", search);
    if (originId) q.set("originId", originId);
    if (status && status !== "All") q.set("status", status);
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
  list: (page = 1, pageSize = 20, search?: string, supplierId?: string) => {
    const q = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    if (search) q.set("search", search);
    if (supplierId) q.set("supplierId", supplierId);
    return get<PagedResult<PurchaseOrderSummaryDto>>(`/api/v1/purchase-orders?${q}`);
  },
  get: (id: string) => get<PurchaseOrderDto>(`/api/v1/purchase-orders/${id}`),
};

// ─── Sales ────────────────────────────────────────────────────────────────────

export const salesApi = {
  list: (page = 1, pageSize = 20, search?: string) => {
    const q = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    if (search) q.set("search", search);
    return get<PagedResult<SaleSummaryDto>>(`/api/v1/sales?${q}`);
  },
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

// ─── Admin ────────────────────────────────────────────────────────────────────

async function delWithBody<T = void>(path: string, body: unknown, auth = true): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (auth) Object.assign(headers, await authHeader());

  const res = await fetch(`${baseUrl()}${path}`, {
    method: "DELETE",
    headers,
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new ApiError(res.status, text);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// ─── Profile ──────────────────────────────────────────────────────────────────

export const profileApi = {
  get: () => get<ProfileDto>("/api/v1/profile"),
  getSessions: () => get<ProfileSessionDto[]>("/api/v1/profile/sessions"),
  updateDisplayName: (displayName: string | null) =>
    put<void>("/api/v1/profile/display-name", { displayName }),
  changeEmail: (currentPassword: string, newEmail: string) =>
    put<void>("/api/v1/profile/email", { currentPassword, newEmail }),
  changePassword: (currentPassword: string, newPassword: string) =>
    put<void>("/api/v1/profile/password", { currentPassword, newPassword }),
  revokeSession: (id: string) =>
    del(`/api/v1/profile/sessions/${id}`),
  deleteAccount: (currentPassword: string) =>
    delWithBody<void>("/api/v1/profile", { currentPassword }),
};

// ─── Admin ────────────────────────────────────────────────────────────────────

export const adminApi = {
  stats: () => get<AdminStatsDto>("/api/v1/admin/stats"),
  getUsers: (page = 1, pageSize = 20, search?: string, role?: string, isDeleted?: boolean) => {
    const q = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    if (search) q.set("search", search);
    if (role) q.set("role", role);
    if (isDeleted !== undefined) q.set("isDeleted", String(isDeleted));
    return get<PagedResult<AdminUserDto>>(`/api/v1/admin/users?${q}`);
  },
  changeRole: (userId: string, role: string) =>
    put<void>(`/api/v1/admin/users/${userId}/role`, { role }),
  deactivateUser: (userId: string) =>
    put<void>(`/api/v1/admin/users/${userId}/deactivate`, {}),
  reactivateUser: (userId: string) =>
    put<void>(`/api/v1/admin/users/${userId}/reactivate`, {}),
  revokeUserSessions: (userId: string) =>
    del(`/api/v1/admin/users/${userId}/sessions`),
  getSessions: (page = 1, pageSize = 20, search?: string) => {
    const q = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    if (search) q.set("search", search);
    return get<PagedResult<AdminSessionDto>>(`/api/v1/admin/sessions?${q}`);
  },
  revokeSession: (sessionId: string) =>
    del(`/api/v1/admin/sessions/${sessionId}`),
  getPublicTokens: (page = 1, pageSize = 20, isActive?: boolean) => {
    const q = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    if (isActive !== undefined) q.set("isActive", String(isActive));
    return get<PagedResult<AdminPublicTokenDto>>(`/api/v1/admin/public-tokens?${q}`);
  },
  togglePublicToken: (tokenId: string) =>
    put<AdminPublicTokenDto>(`/api/v1/admin/public-tokens/${tokenId}/toggle`, {}),
  getPhotos: (page = 1, pageSize = 20, search?: string) => {
    const q = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    if (search) q.set("search", search);
    return get<PagedResult<AdminPhotoDto>>(`/api/v1/admin/photos?${q}`);
  },
  deletePhoto: (photoId: string) => del(`/api/v1/admin/photos/${photoId}`),
  getCertificates: (page = 1, pageSize = 20, search?: string) => {
    const q = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    if (search) q.set("search", search);
    return get<PagedResult<AdminCertificateDto>>(`/api/v1/admin/certificates?${q}`);
  },
  deleteCertificate: (certId: string) => del(`/api/v1/admin/certificates/${certId}`),
};
