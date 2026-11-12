export interface BlogSideAdItem {
  enabled: boolean;
  badge: string;
  headline: string;
  subtext: string;
  image_url: string;
  button_text: string;
  button_link: string;
  theme: "amber_gold" | "emerald_luxury" | "charcoal_slate" | "royal_navy";
  is_custom_code?: boolean;
  custom_html?: string;
}

export interface BlogSideAdsConfig {
  left_ad: BlogSideAdItem;
  right_ad: BlogSideAdItem;
  updated_at?: string;
}

export const DEFAULT_BLOG_SIDE_ADS: BlogSideAdsConfig = {
  left_ad: {
    enabled: true,
    badge: "FREE AT YOUR DOORSTEP",
    headline: "Touch & Feel Real Wood",
    subtext: "Order an authentic sample kit of luxury SPC and wooden herringbone planks delivered to your NCR home.",
    image_url: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775411703/Luxury_Penthouse_Living_Room_with_Light_Oak_Herringbone_Flooring_Gurugram.jpg",
    button_text: "Order Free Samples →",
    button_link: "/sample-kit",
    theme: "amber_gold",
    is_custom_code: false,
    custom_html: "",
  },
  right_ad: {
    enabled: true,
    badge: "GURGAON EXPERTS",
    headline: "Confused About Flooring?",
    subtext: "Get direct advice from Gurgaon flooring consultants with an instant price estimate for your room size.",
    image_url: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775544853/oak_color_laminate_flooring_installed_images.png",
    button_text: "Chat on WhatsApp ↗",
    button_link: "https://wa.me/917217644573",
    theme: "emerald_luxury",
    is_custom_code: false,
    custom_html: "",
  },
};
