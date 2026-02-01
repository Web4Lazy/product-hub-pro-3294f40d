export interface Marketplace {
  country: string;
  domain: string;
  language: string;
  flag: string;
}

export interface ProductData {
  title: string;
  brand: string;
  ean: string;
  price: number;
  category_user: string;
  category_suggested: string;
  description: string;
  bullet_points: string[];
}

export interface Alert {
  type: string;
  message: string;
}

export interface AnalyzeResponse {
  alerts: Alert[];
  product: ProductData;
}

export interface UploadResponse {
  success: boolean;
  asin: string;
}

export interface ClientStatus {
  nome: string;
  collegato: boolean;
}

export const CLIENTS = [
  "A.T.S. GRAFICA",
  "Calzificiopiemonte",
  "ELEVA PET",
  "EURO INOX ITALY",
  "LA ITALCHIMICA VERNICI SRL",
  "Lume Import S.r.l.",
  "Neri Industria Alimentare",
  "Neri Sottoli",
  "PURANOVA",
  "Tuà sensation",
  "Verdesativa Cosmesi Bio & Vegan",
  "VINO COM",
];

export const MARKETPLACES: Marketplace[] = [
  { country: "Italia", domain: "amazon.it", language: "Italiano", flag: "🇮🇹" },
  { country: "Spagna", domain: "amazon.es", language: "Español", flag: "🇪🇸" },
  { country: "Germania", domain: "amazon.de", language: "Deutsch", flag: "🇩🇪" },
  { country: "Francia", domain: "amazon.fr", language: "Français", flag: "🇫🇷" },
];
