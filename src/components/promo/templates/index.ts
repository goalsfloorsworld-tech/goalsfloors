import React from "react";
import CountdownBanner from "./CountdownBanner";
import FestiveOfferBanner from "./FestiveOfferBanner";
import B2BProjectLeadBanner from "./B2BProjectLeadBanner";
import CustomCodeBanner from "./CustomCodeBanner";

/**
 * Validate promo links to prevent security issues (e.g. javascript: or data: URIs).
 * Only allows relative paths, valid HTTPS URLs, tel:, mailto:, and WhatsApp links.
 */
export function isValidPromoLink(url?: string | null): boolean {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return true;
  if (/^https:\/\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+$/i.test(trimmed)) return true;
  if (/^(tel:|mailto:)[a-zA-Z0-9+@._-]+$/i.test(trimmed)) return true;
  if (/^https?:\/\/(wa\.me|api\.whatsapp\.com)\/.+$/i.test(trimmed)) return true;
  return false;
}

export function getSafePromoLink(url?: string | null): string | null {
  if (isValidPromoLink(url)) return url!.trim();
  return null;
}

export type TemplateFieldType = "text" | "textarea" | "boolean" | "url" | "theme_select" | "image";

export interface TemplateFieldDefinition {
  name: string;
  label: string;
  type: TemplateFieldType;
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  multiple?: boolean;
  maxImages?: number;
}

export type PromoTemplateProps = {
  heading?: string;
  subtext?: string;
  coupon_code?: string;
  show_countdown?: boolean;
  badge_text?: string;
  tier_1_label?: string;
  tier_1_value?: string;
  tier_2_label?: string;
  tier_2_value?: string;
  tier_3_label?: string;
  tier_3_value?: string;
  button_text?: string;
  button_link?: string;
  startAt?: string | null;
  endAt?: string | null;
  isMobileView?: boolean;
  [key: string]: unknown;
};

export interface PromoTemplateEntry {
  id: string;
  label: string;
  description: string;
  component: React.ComponentType<PromoTemplateProps>;
  fields: TemplateFieldDefinition[];
  defaults: Record<string, unknown>;
}

export const PROMO_TEMPLATES: Record<string, PromoTemplateEntry> = {
  CountdownBanner: {
    id: "CountdownBanner",
    label: "Countdown Banner",
    description: "Urgent promotional banner with 4-box countdown timer, dual CTA buttons, and multi-image showcase.",
    component: CountdownBanner as unknown as React.ComponentType<PromoTemplateProps>,
    fields: [
      {
        name: "badge_text",
        label: "Top Badge Text",
        type: "text",
        placeholder: "e.g. LIMITED PERIOD OFFER",
      },
      {
        name: "heading",
        label: "Main Headline",
        type: "text",
        required: true,
        placeholder: "e.g. Don't Miss This Deal!",
      },
      {
        name: "heading_highlight",
        label: "Highlight / Accent Text (Gold)",
        type: "text",
        placeholder: "e.g. Timer Hits Zero, Price Up.",
      },
      {
        name: "subtext",
        label: "Subtext Description",
        type: "textarea",
        placeholder: "e.g. Lock today's special price on this product before the offer ends...",
      },
      {
        name: "show_countdown",
        label: "Show 4-Box Countdown Timer (Days, Hours, Mins, Secs)",
        type: "boolean",
        helpText: "Displays the 4-box countdown timer with real-time countdown.",
      },
      {
        name: "button_text",
        label: "Primary Button Text",
        type: "text",
        placeholder: "e.g. Claim This Offer",
      },
      {
        name: "button_link",
        label: "Primary Button Link",
        type: "url",
        placeholder: "e.g. /sample-kit or /contact",
      },
      {
        name: "secondary_button_text",
        label: "Secondary / WhatsApp Button Text",
        type: "text",
        placeholder: "e.g. WhatsApp 72176 44573",
      },
      {
        name: "secondary_button_link",
        label: "Secondary / WhatsApp Link",
        type: "url",
        placeholder: "e.g. https://wa.me/917217644573 or phone number",
      },
      {
        name: "features",
        label: "Trust Features (Comma separated)",
        type: "text",
        placeholder: "e.g. 100% Waterproof, Termite-Proof, Gurgaon & Delhi NCR",
        helpText: "Displays bullet points with checkmark icons at the bottom.",
      },
      {
        name: "image_urls",
        label: "Carousel Showcase Images (Up to 4)",
        type: "image",
        multiple: true,
        maxImages: 4,
        placeholder: "Select or upload up to 4 images for the banner slider",
        helpText: "Multiple images rotate smoothly every 4 seconds in an automatic carousel.",
      },
      {
        name: "image_tag",
        label: "Image Bottom Tag Pill",
        type: "text",
        placeholder: "e.g. Wall Panels • SPC Flooring • Premium Finish",
      },
    ],
    defaults: {
      badge_text: "LIMITED PERIOD OFFER",
      heading: "Don't Miss This Deal!",
      heading_highlight: "Timer Hits Zero, Price Up.",
      subtext: "Lock today's special price on this product before the offer ends. No coupon needed — inquire directly before the timer runs out.",
      show_countdown: true,
      button_text: "Claim Offer",
      button_link: "/sample-kit",
      secondary_button_text: "WhatsApp",
      secondary_button_link: "https://wa.me/917217644573",
      features: "100% Waterproof, Termite-Proof, Gurgaon & Delhi NCR",
      image_urls: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775411703/Luxury_Penthouse_Living_Room_with_Light_Oak_Herringbone_Flooring_Gurugram.jpg\nhttps://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775544853/oak_color_laminate_flooring_installed_images.png",
      image_tag: "Wall Panels • SPC Flooring • Premium Finish",
    },
  },

  FestiveOfferBanner: {
    id: "FestiveOfferBanner",
    label: "Festive Celebration Banner (5 Cards)",
    description: "Grand festive banner with 5 scattered polaroid cards, customizable background pattern colors, garland & WhatsApp CTA.",
    component: FestiveOfferBanner as unknown as React.ComponentType<PromoTemplateProps>,
    fields: [
      {
        name: "heading",
        label: "Festival Name / Heading",
        type: "text",
        required: true,
        placeholder: "e.g. Happy Diwali, Eid Mubarak, Happy New Year",
      },
      {
        name: "subheading",
        label: "Greeting Message / Subtitle",
        type: "text",
        placeholder: "e.g. May your home glow with light and happiness.",
      },
      {
        name: "sale_tagline",
        label: "Sale Offer Tagline",
        type: "text",
        placeholder: "e.g. Diwali Sale on Floors and Wall Panels.",
      },
      {
        name: "bg_theme",
        label: "Background Theme & Pattern Color",
        type: "theme_select",
        helpText: "Select the background gradient and geometric festive pattern color.",
      },
      {
        name: "button_text",
        label: "Button Text",
        type: "text",
        placeholder: "e.g. Chat on WhatsApp",
      },
      {
        name: "button_link",
        label: "Primary Button Link",
        type: "url",
        placeholder: "e.g. https://wa.me/917217644573 or /contact",
      },
      {
        name: "tagline",
        label: "Bottom Brand Tagline",
        type: "text",
        placeholder: "e.g. Premium Flooring • Wall Panels • Trusted Quality",
      },
      // 5 Compulsory Cards (Title, Clickable Link, Image)
      {
        name: "card_1_title",
        label: "Card 1 Label (Compulsory)",
        type: "text",
        required: true,
        placeholder: "e.g. Fluted Wall Panel TV Wall",
      },
      {
        name: "card_1_link",
        label: "Card 1 Clickable Link",
        type: "url",
        placeholder: "e.g. /products/fluted-wall-panel",
      },
      {
        name: "card_1_image",
        label: "Card 1 Image",
        type: "image",
        required: true,
        placeholder: "https://...",
      },
      {
        name: "card_2_title",
        label: "Card 2 Label (Compulsory)",
        type: "text",
        required: true,
        placeholder: "e.g. Wooden SPC Floor Bedroom",
      },
      {
        name: "card_2_link",
        label: "Card 2 Clickable Link",
        type: "url",
        placeholder: "e.g. /products/spc-herringbone-oak",
      },
      {
        name: "card_2_image",
        label: "Card 2 Image",
        type: "image",
        required: true,
        placeholder: "https://...",
      },
      {
        name: "card_3_title",
        label: "Card 3 Label (Compulsory)",
        type: "text",
        required: true,
        placeholder: "e.g. Green Balcony Flooring",
      },
      {
        name: "card_3_link",
        label: "Card 3 Clickable Link",
        type: "url",
        placeholder: "e.g. /sample-kit",
      },
      {
        name: "card_3_image",
        label: "Card 3 Image",
        type: "image",
        required: true,
        placeholder: "https://...",
      },
      {
        name: "card_4_title",
        label: "Card 4 Label (Compulsory)",
        type: "text",
        required: true,
        placeholder: "e.g. Herringbone Floor Living Room",
      },
      {
        name: "card_4_link",
        label: "Card 4 Clickable Link",
        type: "url",
        placeholder: "e.g. /products/spc-luxury-plank",
      },
      {
        name: "card_4_image",
        label: "Card 4 Image",
        type: "image",
        required: true,
        placeholder: "https://...",
      },
      {
        name: "card_5_title",
        label: "Card 5 Label (Compulsory)",
        type: "text",
        required: true,
        placeholder: "e.g. WPC Louver Exterior Wall",
      },
      {
        name: "card_5_link",
        label: "Card 5 Clickable Link",
        type: "url",
        placeholder: "e.g. /products/wpc-exterior-louvers",
      },
      {
        name: "card_5_image",
        label: "Card 5 Image",
        type: "image",
        required: true,
        placeholder: "https://...",
      },
    ],
    defaults: {
      heading: "Happy Diwali",
      subheading: "May your home glow with light and happiness.",
      sale_tagline: "Diwali Sale on Floors and Wall Panels.",
      button_text: "Chat on WhatsApp",
      button_link: "https://wa.me/917217644573",
      bg_theme: "royal_amber",
      tagline: "Premium Flooring • Wall Panels • Trusted Quality",
      card_1_title: "Fluted Wall Panel TV Wall",
      card_1_link: "/products/fluted-wall-panel",
      card_1_image: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775411703/Luxury_Penthouse_Living_Room_with_Light_Oak_Herringbone_Flooring_Gurugram.jpg",
      card_2_title: "Wooden SPC Floor Bedroom",
      card_2_link: "/products/spc-herringbone-oak",
      card_2_image: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775544853/oak_color_laminate_flooring_installed_images.png",
      card_3_title: "Green Balcony Flooring",
      card_3_link: "/sample-kit",
      card_3_image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
      card_4_title: "Herringbone Floor Living Room",
      card_4_link: "/products/spc-luxury-plank",
      card_4_image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      card_5_title: "WPC Louver Exterior Wall",
      card_5_link: "/products/wpc-exterior-louvers",
      card_5_image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
    },
  },

  B2BProjectLeadBanner: {
    id: "B2BProjectLeadBanner",
    label: "B2B Projects Showcase & Quote Form",
    description: "Architectural bulk project showcase with 4 space cards (Offices, Restaurants, Hotels, Retail) and a high-converting instant lead capture form.",
    component: B2BProjectLeadBanner as unknown as React.ComponentType<PromoTemplateProps>,
    fields: [
      {
        name: "badge_text",
        label: "Top Pill Badge",
        type: "text",
        placeholder: "e.g. FOR BUSINESS AND PROJECTS",
      },
      {
        name: "heading",
        label: "Main Headline",
        type: "text",
        required: true,
        placeholder: "e.g. Flooring for Big Projects",
      },
      {
        name: "subheading",
        label: "Subheading / Target Audience",
        type: "text",
        placeholder: "e.g. For architects, builders, designers and contractors.",
      },
      {
        name: "benefit_1",
        label: "Key Benefit 1 (with Checkmark)",
        type: "text",
        placeholder: "e.g. Bulk Pricing",
      },
      {
        name: "benefit_2",
        label: "Key Benefit 2 (with Checkmark)",
        type: "text",
        placeholder: "e.g. Project Supply",
      },
      {
        name: "benefit_3",
        label: "Key Benefit 3 (with Checkmark)",
        type: "text",
        placeholder: "e.g. Delhi NCR Delivery",
      },
      // 4 Compulsory Showcase Cards
      {
        name: "card_1_title",
        label: "Card 1 Space Name (Compulsory)",
        type: "text",
        required: true,
        placeholder: "e.g. Offices",
      },
      {
        name: "card_1_image",
        label: "Card 1 Image",
        type: "image",
        required: true,
        placeholder: "https://...",
      },
      {
        name: "card_2_title",
        label: "Card 2 Space Name (Compulsory)",
        type: "text",
        required: true,
        placeholder: "e.g. Restaurants",
      },
      {
        name: "card_2_image",
        label: "Card 2 Image",
        type: "image",
        required: true,
        placeholder: "https://...",
      },
      {
        name: "card_3_title",
        label: "Card 3 Space Name (Compulsory)",
        type: "text",
        required: true,
        placeholder: "e.g. Hotels",
      },
      {
        name: "card_3_image",
        label: "Card 3 Image",
        type: "image",
        required: true,
        placeholder: "https://...",
      },
      {
        name: "card_4_title",
        label: "Card 4 Space Name (Compulsory)",
        type: "text",
        required: true,
        placeholder: "e.g. Retail Stores",
      },
      {
        name: "card_4_image",
        label: "Card 4 Image",
        type: "image",
        required: true,
        placeholder: "https://...",
      },
      // Lead Form Configuration
      {
        name: "form_title",
        label: "Lead Form Title",
        type: "text",
        placeholder: "e.g. Get a Bulk Quote",
      },
      {
        name: "form_subtitle",
        label: "Lead Form Subtitle",
        type: "text",
        placeholder: "e.g. Direct wholesale rates & sample kit for your site",
      },
      {
        name: "button_text",
        label: "Form Submit Button Text",
        type: "text",
        placeholder: "e.g. Request Callback",
      },
      {
        name: "whatsapp_number",
        label: "WhatsApp Number for Quick Callback",
        type: "text",
        placeholder: "e.g. 917217644573",
      },
      {
        name: "bg_theme",
        label: "Background Theme & Accent",
        type: "theme_select",
      },
    ],
    defaults: {
      badge_text: "FOR BUSINESS AND PROJECTS",
      heading: "Flooring for Big Projects",
      subheading: "For architects, builders, designers and contractors.",
      benefit_1: "Bulk Pricing",
      benefit_2: "Project Supply",
      benefit_3: "Delhi NCR Delivery",
      card_1_title: "Offices",
      card_1_image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
      card_2_title: "Restaurants",
      card_2_image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
      card_3_title: "Hotels",
      card_3_image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      card_4_title: "Retail Stores",
      card_4_image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
      form_title: "Get a Bulk Quote",
      form_subtitle: "Direct wholesale rates & sample kit for your site",
      button_text: "Request Callback",
      whatsapp_number: "917217644573",
      bg_theme: "midnight_navy",
    },
  },

  CustomCodeBanner: {
    id: "CustomCodeBanner",
    label: "Custom Code / HTML",
    description: "Full design freedom: write or paste custom HTML with Tailwind CSS. Single self-contained code box.",
    component: CustomCodeBanner as unknown as React.ComponentType<PromoTemplateProps>,
    fields: [
      {
        name: "custom_html",
        label: "Custom Banner Code (HTML & Tailwind CSS)",
        type: "textarea",
        required: true,
        placeholder: "Paste your custom code here...",
        helpText: "Paste self-contained HTML markup using Tailwind CSS. If custom CSS is required, include it inside <style>...</style> within this box. JavaScript is strictly prohibited.",
      },
    ],
    defaults: {
      custom_html: "",
    },
  },
};

// Backward-compatibility aliases
PROMO_TEMPLATES["SampleKitCallout"] = PROMO_TEMPLATES["FestiveOfferBanner"];
PROMO_TEMPLATES["B2BBulkStrip"] = PROMO_TEMPLATES["B2BProjectLeadBanner"];
