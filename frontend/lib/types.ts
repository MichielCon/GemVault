// ─── Auth ─────────────────────────────────────────────────────────────────────

export type UserRole = "Collector" | "Business" | "Admin";

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
  email: string;
  role: UserRole;
}

// ─── Paging ───────────────────────────────────────────────────────────────────

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// ─── Gems ─────────────────────────────────────────────────────────────────────

export interface GemPhotoDto {
  id: string;
  url: string;
  isCover: boolean;
  createdAt: string;
}

export interface GemDto {
  id: string;
  name: string;
  species: string | null;
  variety: string | null;
  weightCarats: number | null;
  color: string | null;
  clarity: string | null;
  cut: string | null;
  treatment: string | null;
  shape: string | null;
  lengthMm: number | null;
  widthMm: number | null;
  heightMm: number | null;
  purchasePrice: number | null;
  notes: string | null;
  isPublic: boolean;
  ownerId: string;
  originId: string | null;
  originCountry: string | null;
  attributes: string | null;
  publicToken: string | null;
  createdAt: string;
  updatedAt: string;
  photos: GemPhotoDto[];
}

export interface GemSummaryDto {
  id: string;
  name: string;
  species: string | null;
  variety: string | null;
  weightCarats: number | null;
  color: string | null;
  isPublic: boolean;
  coverPhotoUrl: string | null;
  createdAt: string;
}

// ─── GemParcels ───────────────────────────────────────────────────────────────

export interface GemParcelPhotoDto {
  id: string;
  url: string;
  isCover: boolean;
  createdAt: string;
}

export interface GemParcelDto {
  id: string;
  name: string;
  species: string | null;
  variety: string | null;
  quantity: number;
  totalWeightCarats: number | null;
  color: string | null;
  treatment: string | null;
  purchasePrice: number | null;
  notes: string | null;
  isPublic: boolean;
  ownerId: string;
  originId: string | null;
  originCountry: string | null;
  publicToken: string | null;
  createdAt: string;
  updatedAt: string;
  photos: GemParcelPhotoDto[];
}

export interface GemParcelSummaryDto {
  id: string;
  name: string;
  species: string | null;
  variety: string | null;
  quantity: number;
  totalWeightCarats: number | null;
  color: string | null;
  isPublic: boolean;
  coverPhotoUrl: string | null;
  createdAt: string;
}

// ─── Vocabulary ───────────────────────────────────────────────────────────────

export interface VocabularyItemDto {
  value: string;
  parentValue: string | null;
}

// ─── Origins ──────────────────────────────────────────────────────────────────

export interface OriginDto {
  id: string;
  country: string;
  mine: string | null;
  region: string | null;
  createdAt: string;
}

// ─── Public scan ──────────────────────────────────────────────────────────────

export interface PublicPhotoDto {
  id: string;
  url: string;
  isCover: boolean;
}

export interface PublicGemDto {
  id: string;
  recordType: "Gem" | "Parcel";
  name: string;
  species: string | null;
  variety: string | null;
  color: string | null;
  treatment: string | null;
  shape: string | null;
  clarity: string | null;
  cut: string | null;
  weightCarats: number | null;
  totalWeightCarats: number | null;
  quantity: number | null;
  notes: string | null;
  originCountry: string | null;
  originMine: string | null;
  originRegion: string | null;
  createdAt: string;
  photos: PublicPhotoDto[];
}
