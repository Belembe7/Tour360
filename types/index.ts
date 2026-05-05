export type Package = {
  id: string;
  name: string;
  slug: string;
  type: "nacional" | "internacional";
  category: "economico" | "intermediario" | "premium";
  description: string | null;
  price_min: number;
  price_max: number | null;
  currency: string;
  image_url: string | null;
  is_active: boolean;
};

export type Vehicle = {
  id: string;
  model: string;
  plate: string | null;
  capacity: number | null;
  price_per_day: number;
  currency: string;
  is_available: boolean;
  description: string | null;
  image_url: string | null;
};

export type Destination = {
  id: string;
  name: string;
  country: string;
  description: string | null;
  is_national: boolean;
};
