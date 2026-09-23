export type VehicleStatus = "available" | "reserved" | "sold";
export type MediaPlatform = "youtube" | "tiktok" | "instagram";

export type VehicleImage = {
  url: string;
  caption: string | null;
};

export type VehicleVideo = {
  platform: MediaPlatform;
  url: string;
  caption: string | null;
  embedId: string | null;
};

export type VehicleSpec = { label: string; value: string };

export type Vehicle = {
  id: number;
  slug: string;
  make: string;
  model: string;
  trim: string | null;
  title: string;
  year: number;
  condition: string;
  bodyType: string | null;
  transmission: string | null;
  fuelType: string | null;
  drivetrain: string | null;
  engine: string | null;
  exteriorColor: string | null;
  interiorColor: string | null;
  mileageKm: number | null;
  priceNgn: number | null;
  priceOnRequest: boolean;
  priceLabel: string;
  status: VehicleStatus;
  clearance: string | null;
  arrivalNote: string | null;
  badge: string | null;
  titleStatus: string | null;
  location: string;
  description: string;
  features: string[];
  specs: VehicleSpec[];
  isDemo: boolean;
  featured: boolean;
  createdAt: string;
  images: VehicleImage[];
  coverImage: string;
  videos: VehicleVideo[];
  whatsappUrl: string;
};

export type SortKey = "recent" | "price_asc" | "price_desc" | "year_desc" | "year_asc";

export type VehicleFilters = {
  q?: string;
  makes?: string[];
  models?: string[];
  bodyTypes?: string[];
  conditions?: string[];
  transmissions?: string[];
  driveTypes?: string[];
  yearMin?: number;
  yearMax?: number;
  priceMin?: number;
  priceMax?: number;
  status?: VehicleStatus | "all";
  includeDemo?: boolean;
  demoOnly?: boolean;
  sort?: SortKey;
  page?: number;
  perPage?: number;
};

export type FacetOption = { value: string; count: number };

export type InventoryFacets = {
  makes: FacetOption[];
  models: FacetOption[];
  bodyTypes: FacetOption[];
  conditions: FacetOption[];
  transmissions: FacetOption[];
  yearRange: { min: number; max: number };
  priceRange: { min: number; max: number };
  total: number;
  realCount: number;
  demoCount: number;
  availableCount: number;
};

export type InventoryResult = {
  items: Vehicle[];
  total: number;
  page: number;
  perPage: number;
  pageCount: number;
  facets: InventoryFacets;
};
