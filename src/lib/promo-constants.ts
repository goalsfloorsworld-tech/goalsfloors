export const VALID_PRODUCT_SLUGS = [
  "artificial-grass",
  "cobra-pu-stone",
  "herringbone-laminate-flooring",
  "hybrid-laminate-flooring",
  "laminate-flooring",
  "spc-flooring",
  "tokyo-charcoal-moulding",
  "upfit-panels",
  "wall-panels",
  "wpc-baffle-ceiling",
  "wpc-decking",
  "wpc-exterior-louvers",
  "wpc-timber-tubes",
] as const;

export type ValidProductSlug = (typeof VALID_PRODUCT_SLUGS)[number] | "*";

export interface PageLinkOption {
  label: string;
  value: string;
  group: "Action Pages" | "Info Pages" | "Product Pages";
}

export const AVAILABLE_PAGE_LINKS: PageLinkOption[] = [
  // Primary Action Pages
  { label: "Order Free Sample Kit (/sample-kit)", value: "/sample-kit", group: "Action Pages" },
  { label: "Contact & Enquiry (/contact)", value: "/contact", group: "Action Pages" },
  { label: "Find Nearest Dealer (/dealers)", value: "/dealers", group: "Action Pages" },
  { label: "Compare Flooring (/compare)", value: "/compare", group: "Action Pages" },

  // Info & Catalog Pages
  { label: "Digital Product Catalogs (/catalogs)", value: "/catalogs", group: "Info Pages" },
  { label: "Blogs & Guides (/blogs)", value: "/blogs", group: "Info Pages" },
  { label: "About Goals Floors (/about)", value: "/about", group: "Info Pages" },

  // All 13 Product Pages
  { label: "Artificial Grass (/products/artificial-grass)", value: "/products/artificial-grass", group: "Product Pages" },
  { label: "Cobra PU Stone (/products/cobra-pu-stone)", value: "/products/cobra-pu-stone", group: "Product Pages" },
  { label: "Herringbone Laminate Flooring (/products/herringbone-laminate-flooring)", value: "/products/herringbone-laminate-flooring", group: "Product Pages" },
  { label: "Hybrid Laminate Flooring (/products/hybrid-laminate-flooring)", value: "/products/hybrid-laminate-flooring", group: "Product Pages" },
  { label: "Laminate Flooring (/products/laminate-flooring)", value: "/products/laminate-flooring", group: "Product Pages" },
  { label: "SPC Flooring (/products/spc-flooring)", value: "/products/spc-flooring", group: "Product Pages" },
  { label: "Tokyo Charcoal Moulding (/products/tokyo-charcoal-moulding)", value: "/products/tokyo-charcoal-moulding", group: "Product Pages" },
  { label: "Upfit Wall Panels (/products/upfit-panels)", value: "/products/upfit-panels", group: "Product Pages" },
  { label: "Wall Panels (/products/wall-panels)", value: "/products/wall-panels", group: "Product Pages" },
  { label: "WPC Baffle Ceiling (/products/wpc-baffle-ceiling)", value: "/products/wpc-baffle-ceiling", group: "Product Pages" },
  { label: "WPC Decking (/products/wpc-decking)", value: "/products/wpc-decking", group: "Product Pages" },
  { label: "WPC Exterior Louvers (/products/wpc-exterior-louvers)", value: "/products/wpc-exterior-louvers", group: "Product Pages" },
  { label: "WPC Timber Tubes (/products/wpc-timber-tubes)", value: "/products/wpc-timber-tubes", group: "Product Pages" },
];
