export interface PanelLayer {
  id: string;
  name: string;
  badge: string;
  thickness: string;
  description: string;
  accentColor: string;
}

export interface PanelColorway {
  id: string;
  name: string;
  finish: string;
  colorHex: string;
  heroImage: string;
  roomImage: string;
  textureImage: string;
  tagline: string;
}

export interface PanelSpec {
  label: string;
  value: string;
  detail: string;
}

export interface CatalogVariant {
  id: string;
  code: string;
  name: string;
  type: "fluted" | "plain";
  thickness: string;
  dimensions: string;
  badge: string;
  textureUrl: string;
  thumbnailUrl: string;
  colorHex: string;
  description: string;
}

export interface WallPanelExperienceData {
  slug: string;
  name: string;
  title: string;
  subtitle: string;
  tagline: string;
  badge: string;
  startingPrice: string;
  pricePerSqFt: string;
  aestheticTone: "dark" | "cinematic" | "warm-minimal";
  themeColor: string;
  glowColor: string;
  accentGradient: string;
  description: string;
  heroImage: string;
  roomImage: string;
  textureImage: string;
  dimensions: {
    height: string;
    width: string;
    thickness: string;
    fluteSpacing: string;
  };
  features: {
    title: string;
    description: string;
    stat: string;
  }[];
  layers: PanelLayer[];
  specs: PanelSpec[];
  colorways: PanelColorway[];
  catalogVariants: CatalogVariant[];
  roomLightingModes: {
    id: string;
    name: string;
    tempKelvin: string;
    ambientColor: string;
    glowFilter: string;
    description: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
}
