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

// ─── Certificates ─────────────────────────────────────────────────────────────

export interface CertificateDto {
  id: string;
  certNumber: string;
  lab: string | null;
  grade: string | null;
  issueDate: string | null;
  fileUrl: string | null;
  gemId: string | null;
  createdAt: string;
}

// ─── Gems ─────────────────────────────────────────────────────────────────────

export interface GemPhotoDto {
  id: string;
  url: string;
  isCover: boolean;
  createdAt: string;
}

export interface GemSoldInfoDto {
  saleId: string;
  saleDate: string;
  salePrice: number;
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
  acquiredAt: string | null;
  notes: string | null;
  status: string;
  isPublic: boolean;
  ownerId: string;
  originId: string | null;
  originCountry: string | null;
  attributes: string | null;
  publicToken: string | null;
  createdAt: string;
  updatedAt: string;
  photos: GemPhotoDto[];
  soldInfo: GemSoldInfoDto | null;
  certificates: CertificateDto[];
}

export interface GemSummaryDto {
  id: string;
  name: string;
  species: string | null;
  variety: string | null;
  weightCarats: number | null;
  color: string | null;
  status: string;
  isPublic: boolean;
  coverPhotoUrl: string | null;
  createdAt: string;
  isSold: boolean;
}

// ─── GemParcels ───────────────────────────────────────────────────────────────

export interface GemParcelPhotoDto {
  id: string;
  url: string;
  isCover: boolean;
  createdAt: string;
}

export interface GemParcelSoldInfoDto {
  saleId: string;
  saleDate: string;
  salePrice: number;
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
  acquiredAt: string | null;
  notes: string | null;
  isPublic: boolean;
  ownerId: string;
  originId: string | null;
  originCountry: string | null;
  publicToken: string | null;
  createdAt: string;
  updatedAt: string;
  photos: GemParcelPhotoDto[];
  soldInfo: GemParcelSoldInfoDto | null;
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
  isSold: boolean;
}

// ─── Vocabulary ───────────────────────────────────────────────────────────────

export interface VocabularyItemDto {
  value: string;
  parentValue: string | null;
}

export interface VocabularyAdminDto {
  id: number;
  field: string;
  value: string;
  parentValue: string | null;
  sortOrder: number;
}

// ─── Origins ──────────────────────────────────────────────────────────────────

export interface OriginDto {
  id: string;
  country: string;
  locality: string | null;
  createdAt: string;
  gemCount: number;
  parcelCount: number;
}

// ─── Suppliers ────────────────────────────────────────────────────────────────

export interface SupplierDto {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  website: string | null;
  address: string | null;
  notes: string | null;
  orderCount: number;
  createdAt: string;
}

// ─── PurchaseOrders ───────────────────────────────────────────────────────────

export interface OrderItemDto {
  id: string;
  gemId: string | null;
  gemName: string | null;
  gemParcelId: string | null;
  gemParcelName: string | null;
  costPrice: number;
  notes: string | null;
}

export interface PurchaseOrderDto {
  id: string;
  reference: string | null;
  orderDate: string;
  supplierId: string | null;
  supplierName: string | null;
  boughtFrom: string | null;
  notes: string | null;
  items: OrderItemDto[];
  totalCost: number;
  createdAt: string;
}

export interface PurchaseOrderSummaryDto {
  id: string;
  reference: string | null;
  orderDate: string;
  supplierName: string | null;
  boughtFrom: string | null;
  totalCost: number;
  itemCount: number;
  createdAt: string;
}

// ─── Sales ────────────────────────────────────────────────────────────────────

export interface SaleItemDto {
  id: string;
  gemId: string | null;
  gemName: string | null;
  gemParcelId: string | null;
  gemParcelName: string | null;
  quantity: number;
  salePrice: number;
}

export interface SaleDto {
  id: string;
  saleDate: string;
  buyerName: string | null;
  buyerEmail: string | null;
  buyerPhone: string | null;
  notes: string | null;
  items: SaleItemDto[];
  totalSaleValue: number;
  createdAt: string;
}

export interface SaleSummaryDto {
  id: string;
  saleDate: string;
  buyerName: string | null;
  totalSaleValue: number;
  itemCount: number;
  createdAt: string;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export interface RecentItemDto {
  id: string;
  name: string;
  type: "Gem" | "Parcel";
  species: string | null;
  variety: string | null;
  createdAt: string;
}

export interface MonthlyRevenueDto {
  year: number;
  month: number;
  revenue: number;
}

export interface SpeciesBreakdownDto {
  species: string;
  count: number;
}

export interface RecentSaleDto {
  saleId: string;
  saleDate: string;
  buyerName: string | null;
  totalValue: number;
  itemCount: number;
}

export interface DashboardStatsDto {
  // Inventory counts
  gemCount: number;
  parcelCount: number;
  parcelTotalQuantity: number;
  unsoldGemCount: number;
  unsoldParcelCount: number;
  // Financial
  totalPurchaseValue: number;
  totalSalesValue: number;
  unsoldInventoryValue: number;
  netProfit: number;
  profitMarginPct: number;
  // Business counters
  supplierCount: number;
  purchaseOrderCount: number;
  saleCount: number;
  // Charts & activity
  monthlyRevenue: MonthlyRevenueDto[];
  inventoryBySpecies: SpeciesBreakdownDto[];
  recentSales: RecentSaleDto[];
  recentItems: RecentItemDto[];
}

// ─── Origins (map) ────────────────────────────────────────────────────────────

export interface OriginMapDto {
  id: string;
  country: string;
  locality: string | null;
  gemCount: number;
  parcelCount: number;
  totalCarats: number;
  totalInvested: number;
  species: string[];
  createdAt: string;
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export interface AdminUserDto {
  id: string;
  email: string;
  role: string;
  isDeleted: boolean;
  createdAt: string;
  gemCount: number;
  parcelCount: number;
}

export interface RecentUserDto {
  id: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface AdminStatsDto {
  totalUsers: number;
  adminCount: number;
  businessCount: number;
  collectorCount: number;
  activeUsers: number;
  deletedUsers: number;
  newUsersThisMonth: number;
  totalGems: number;
  totalParcels: number;
  totalPhotos: number;
  totalCertificates: number;
  totalPublicTokens: number;
  activePublicTokens: number;
  recentUsers: RecentUserDto[];
}

export interface AdminSessionDto {
  id: string;
  userId: string;
  userEmail: string;
  tokenHashMasked: string;
  createdAt: string;
  expiresAt: string;
  isExpired: boolean;
}

export interface AdminPublicTokenDto {
  id: string;
  token: string;
  isActive: boolean;
  gemId: string | null;
  gemName: string | null;
  gemParcelId: string | null;
  gemParcelName: string | null;
  ownerId: string;
  ownerEmail: string;
  createdAt: string;
}

// ─── Admin Content ────────────────────────────────────────────────────────────

export interface AdminPhotoDto {
  id: string;
  url: string;
  fileName: string;
  fileSizeBytes: number;
  contentType: string;
  gemId: string | null;
  gemName: string | null;
  gemParcelId: string | null;
  gemParcelName: string | null;
  ownerId: string;
  ownerEmail: string;
  isCover: boolean;
  createdAt: string;
}

export interface AdminCertificateDto {
  id: string;
  certNumber: string;
  lab: string | null;
  grade: string | null;
  issueDate: string | null;
  fileUrl: string | null;
  gemId: string;
  gemName: string;
  ownerId: string;
  ownerEmail: string;
  createdAt: string;
}

// ─── Profile ──────────────────────────────────────────────────────────────────

export interface ProfileDto {
  id: string;
  email: string;
  displayName: string | null;
  role: string;
  joinedAt: string;
  gemCount: number;
  parcelCount: number;
}

export interface ProfileSessionDto {
  id: string;
  createdAt: string;
  expiresAt: string;
  isExpired: boolean;
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
  originLocality: string | null;
  createdAt: string;
  scanCount: number;
  photos: PublicPhotoDto[];
}
