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
  soldInfo: GemSoldInfoDto | null;
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
  isSold: boolean;
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
  isSold: boolean;
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

// ─── Suppliers ────────────────────────────────────────────────────────────────

export interface SupplierDto {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
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
  supplierId: string;
  supplierName: string;
  notes: string | null;
  items: OrderItemDto[];
  totalCost: number;
  createdAt: string;
}

export interface PurchaseOrderSummaryDto {
  id: string;
  reference: string | null;
  orderDate: string;
  supplierName: string;
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
  mine: string | null;
  region: string | null;
  gemCount: number;
  parcelCount: number;
  totalCarats: number;
  totalInvested: number;
  species: string[];
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
