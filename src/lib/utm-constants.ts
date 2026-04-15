import type { ChannelOption, ChannelCategory } from "@/types/utm-types";

// ---------------------------------------------------------------------------
// Channel Options — grouped by category
// ---------------------------------------------------------------------------

export const CHANNEL_OPTIONS: ChannelOption[] = [
  // Social
  {
    id: "linkedin",
    label: "LinkedIn",
    category: "social",
    utmSource: "linkedin",
    utmMedium: "social",
    icon: "Linkedin",
    requiresQR: false,
    defaultElement: "social_post",
    elements: ["social_post", "bio_link", "story_link"],
  },
  {
    id: "facebook",
    label: "Facebook",
    category: "social",
    utmSource: "facebook",
    utmMedium: "social",
    icon: "Facebook",
    requiresQR: false,
    defaultElement: "social_post",
    elements: ["social_post", "bio_link", "story_link"],
  },
  {
    id: "x",
    label: "X (Twitter)",
    category: "social",
    utmSource: "x",
    utmMedium: "social",
    icon: "Twitter",
    requiresQR: false,
    defaultElement: "social_post",
    elements: ["social_post", "bio_link"],
  },
  {
    id: "youtube",
    label: "YouTube",
    category: "social",
    utmSource: "youtube",
    utmMedium: "social",
    icon: "Youtube",
    requiresQR: false,
    defaultElement: "social_post",
    elements: ["social_post", "video_description", "bio_link"],
  },
  {
    id: "instagram",
    label: "Instagram",
    category: "social",
    utmSource: "instagram",
    utmMedium: "social",
    icon: "Instagram",
    requiresQR: false,
    defaultElement: "social_post",
    elements: ["social_post", "bio_link", "story_link"],
  },

  // Email
  {
    id: "email_newsletter",
    label: "Newsletter",
    category: "email",
    utmSource: "email",
    utmMedium: "newsletter_database",
    icon: "Mail",
    requiresQR: false,
    defaultElement: "hero_button",
    elements: ["hero_button", "logo", "bottom_button", "text_link", "demo_video"],
  },
  {
    id: "email_partnership",
    label: "Partnership",
    category: "email",
    utmSource: "email",
    utmMedium: "partnership_launch",
    icon: "Handshake",
    requiresQR: false,
    defaultElement: "hero_button",
    elements: ["hero_button", "logo", "bottom_button", "text_link", "demo_video"],
  },
  {
    id: "email_product",
    label: "Product Update",
    category: "email",
    utmSource: "email",
    utmMedium: "product_update",
    icon: "Package",
    requiresQR: false,
    defaultElement: "hero_button",
    elements: ["hero_button", "logo", "bottom_button", "text_link", "demo_video"],
  },
  {
    id: "email_event",
    label: "Event Invite",
    category: "email",
    utmSource: "email",
    utmMedium: "event_invite",
    icon: "CalendarDays",
    requiresQR: false,
    defaultElement: "hero_button",
    elements: ["hero_button", "logo", "bottom_button", "text_link"],
  },

  // Print / Physical
  {
    id: "flyer",
    label: "Flyer",
    category: "print",
    utmSource: "flyer",
    utmMedium: "qr_code",
    icon: "FileText",
    requiresQR: true,
    defaultElement: "qr_scan",
    elements: ["qr_scan"],
  },
  {
    id: "banner",
    label: "Banner",
    category: "print",
    utmSource: "banner",
    utmMedium: "qr_code",
    icon: "PanelTop",
    requiresQR: true,
    defaultElement: "qr_scan",
    elements: ["qr_scan"],
  },
  {
    id: "business_card",
    label: "Business Card",
    category: "print",
    utmSource: "business_card",
    utmMedium: "qr_code",
    icon: "CreditCard",
    requiresQR: true,
    defaultElement: "qr_scan",
    elements: ["qr_scan"],
  },
  {
    id: "sticker",
    label: "Sticker",
    category: "print",
    utmSource: "sticker",
    utmMedium: "qr_code",
    icon: "Sticker",
    requiresQR: true,
    defaultElement: "qr_scan",
    elements: ["qr_scan"],
  },
  {
    id: "merchant_gift_box",
    label: "Merchant Gift Box",
    category: "print",
    utmSource: "merchant_gift_box",
    utmMedium: "qr_code",
    icon: "Gift",
    requiresQR: true,
    defaultElement: "qr_scan",
    elements: ["qr_scan"],
  },

  // Paid
  {
    id: "google_ads",
    label: "Google Ads",
    category: "paid",
    utmSource: "google",
    utmMedium: "cpc",
    icon: "Search",
    requiresQR: false,
    defaultElement: "ad_headline",
    elements: ["ad_headline", "ad_banner", "ad_sitelink"],
  },
  {
    id: "facebook_ads",
    label: "Facebook Ads",
    category: "paid",
    utmSource: "facebook",
    utmMedium: "cpc",
    icon: "Facebook",
    requiresQR: false,
    defaultElement: "ad_headline",
    elements: ["ad_headline", "ad_banner", "ad_carousel"],
  },
  {
    id: "linkedin_ads",
    label: "LinkedIn Ads",
    category: "paid",
    utmSource: "linkedin",
    utmMedium: "cpc",
    icon: "Linkedin",
    requiresQR: false,
    defaultElement: "ad_headline",
    elements: ["ad_headline", "ad_banner", "ad_carousel", "ad_message"],
  },

  // Website
  {
    id: "website_popup",
    label: "Popup",
    category: "website",
    utmSource: "main_website",
    utmMedium: "popup",
    icon: "MessageSquare",
    requiresQR: false,
    defaultElement: "popup_cta",
    elements: ["popup_cta", "popup_close"],
  },
  {
    id: "website_banner",
    label: "Banner",
    category: "website",
    utmSource: "main_website",
    utmMedium: "banner",
    icon: "PanelTop",
    requiresQR: false,
    defaultElement: "banner_cta",
    elements: ["banner_cta", "sidebar_banner"],
  },
  {
    id: "website_cta",
    label: "CTA Button",
    category: "website",
    utmSource: "main_website",
    utmMedium: "cta",
    icon: "MousePointerClick",
    requiresQR: false,
    defaultElement: "hero_button",
    elements: ["hero_button", "sidebar_cta", "footer_cta"],
  },

  // Events
  {
    id: "conference",
    label: "Conference",
    category: "events",
    utmSource: "conference",
    utmMedium: "qr_code",
    icon: "Users",
    requiresQR: true,
    defaultElement: "qr_scan",
    elements: ["qr_scan", "booth_handout"],
  },
  {
    id: "webinar",
    label: "Webinar",
    category: "events",
    utmSource: "webinar",
    utmMedium: "social",
    icon: "Video",
    requiresQR: false,
    defaultElement: "registration_link",
    elements: ["registration_link", "follow_up_link"],
  },

  // Other
  {
    id: "whatsapp",
    label: "WhatsApp",
    category: "other",
    utmSource: "whatsapp",
    utmMedium: "messaging",
    icon: "MessageCircle",
    requiresQR: false,
    defaultElement: "message_link",
    elements: ["message_link"],
  },
  {
    id: "sms",
    label: "SMS",
    category: "other",
    utmSource: "sms",
    utmMedium: "messaging",
    icon: "Smartphone",
    requiresQR: false,
    defaultElement: "message_link",
    elements: ["message_link"],
  },
  {
    id: "podcast",
    label: "Podcast",
    category: "other",
    utmSource: "podcast",
    utmMedium: "audio",
    icon: "Mic",
    requiresQR: false,
    defaultElement: "show_notes_link",
    elements: ["show_notes_link", "bio_link"],
  },
];

// ---------------------------------------------------------------------------
// Category labels & display order
// ---------------------------------------------------------------------------

export const CATEGORY_LABELS: Record<ChannelCategory, string> = {
  social: "Social Media",
  email: "Email",
  print: "Print / Physical",
  paid: "Paid Advertising",
  website: "Website",
  events: "Events",
  other: "Other",
};

export const CATEGORY_ORDER: ChannelCategory[] = [
  "social",
  "email",
  "print",
  "paid",
  "website",
  "events",
  "other",
];

// ---------------------------------------------------------------------------
// Product catalog for pp_sql auto-detection
// ---------------------------------------------------------------------------

export const PRODUCT_CATALOG = {
  products: [
    { slug: "business-funding", ppSql: "business_funding", label: "Business Funding" },
    { slug: "embedded-checkout", ppSql: "embedded_checkout", label: "Embedded Checkout" },
    { slug: "multi-currency-payments", ppSql: "multi_currency_payments", label: "Multi-Currency Payments" },
    { slug: "online-payment-gateway", ppSql: "online_payment_gateway", label: "Online Payment Gateway" },
    { slug: "payment-links", ppSql: "payment_links", label: "Payment Links" },
    { slug: "payment-pages", ppSql: "payment_pages", label: "Payment Pages" },
    { slug: "payouts", ppSql: "payouts", label: "Payouts" },
    { slug: "point-of-sale", ppSql: "point_of_sale", label: "Point of Sale" },
    { slug: "subscription-and-recurring-payments", ppSql: "subscription_and_recurring_payments", label: "Subscriptions" },
  ],
  paymentMethods: [
    { slug: "1voucher", ppSql: "1voucher", label: "1Voucher" },
    { slug: "american-express", ppSql: "american_express", label: "American Express" },
    { slug: "apple-pay", ppSql: "apple_pay", label: "Apple Pay" },
    { slug: "blink-by-emtel", ppSql: "blink_by_emtel", label: "Blink by Emtel" },
    { slug: "capitec-pay", ppSql: "capitec_pay", label: "Capitec Pay" },
    { slug: "diners-club", ppSql: "diners_club", label: "Diners Club" },
    { slug: "float", ppSql: "float", label: "Float" },
    { slug: "google_pay", ppSql: "google_pay", label: "Google Pay" },
    { slug: "happy-pay", ppSql: "happy_pay", label: "Happy Pay" },
    { slug: "ke_mpesa", ppSql: "ke_mpesa", label: "M-Pesa" },
    { slug: "mastercard", ppSql: "mastercard", label: "Mastercard" },
    { slug: "maucas", ppSql: "maucas", label: "MauCAS" },
    { slug: "mcb-juice", ppSql: "mcb_juice", label: "MCB Juice" },
    { slug: "mobicred", ppSql: "mobicred", label: "Mobicred" },
    { slug: "moneybadger", ppSql: "moneybadger", label: "MoneyBadger" },
    { slug: "nedbank-direct-eft", ppSql: "nedbank_direct_eft", label: "Nedbank Direct EFT" },
    { slug: "pay-by-bank", ppSql: "pay_by_bank", label: "Pay by Bank" },
    { slug: "payflex", ppSql: "payflex", label: "PayFlex" },
    { slug: "paypal", ppSql: "paypal", label: "PayPal" },
    { slug: "rcs", ppSql: "rcs", label: "RCS" },
    { slug: "samsung-pay", ppSql: "samsung_pay", label: "Samsung Pay" },
    { slug: "scan-to-pay-qr-code", ppSql: "scan_to_pay_qr_code", label: "Scan to Pay QR" },
    { slug: "visa", ppSql: "visa", label: "Visa" },
    { slug: "zeropay", ppSql: "zeropay", label: "ZeroPay" },
  ],
  integrations: [
    { slug: "flowcart", ppSql: "flowcart", label: "Flowcart" },
    { slug: "hti", ppSql: "hti", label: "HTI" },
    { slug: "pol360", ppSql: "pol360", label: "POL360" },
    { slug: "posterita", ppSql: "posterita", label: "Posterita" },
    { slug: "resrequest", ppSql: "resrequest", label: "ResRequest" },
    { slug: "roomraccoon", ppSql: "roomraccoon", label: "RoomRaccoon" },
    { slug: "shiprazor", ppSql: "shiprazor", label: "ShipRazor" },
    { slug: "webbieshop", ppSql: "webbieshop", label: "WebbieShop" },
    { slug: "xero", ppSql: "xero", label: "Xero" },
    { slug: "yoyo-rewards", ppSql: "yoyo_rewards", label: "Yoyo Rewards" },
  ],
};

// ---------------------------------------------------------------------------
// Utility: auto-detect pp_sql from a URL
// ---------------------------------------------------------------------------

export function detectPpSql(url: string): { ppSql: string; label: string; type: string } | null {
  try {
    const parsed = new URL(url);
    const path = parsed.pathname.toLowerCase();

    for (const product of PRODUCT_CATALOG.products) {
      if (path.includes(`/products/${product.slug}`)) {
        return { ppSql: product.ppSql, label: product.label, type: "product" };
      }
    }
    for (const method of PRODUCT_CATALOG.paymentMethods) {
      if (path.includes(`/pay-with/${method.slug}`)) {
        return { ppSql: method.ppSql, label: method.label, type: "payment_method" };
      }
    }
    for (const integration of PRODUCT_CATALOG.integrations) {
      if (path.includes(`/integrations/${integration.slug}`)) {
        return { ppSql: integration.ppSql, label: integration.label, type: "integration" };
      }
    }

    // Fallback: check if any product slug appears anywhere in the path
    for (const product of PRODUCT_CATALOG.products) {
      if (path.includes(product.slug)) {
        return { ppSql: product.ppSql, label: product.label, type: "product" };
      }
    }

    return null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Utility: extract blog slug → utm_content format
// ---------------------------------------------------------------------------

export function extractBlogContent(url: string): string | null {
  try {
    const parsed = new URL(url);
    const path = parsed.pathname.replace(/^\/|\/$/g, "");
    const segments = path.split("/");
    const slug = segments[segments.length - 1];

    if (!slug || slug === "" || segments.length < 2) return null;

    // Skip known non-blog paths
    const skipPrefixes = ["products", "pay-with", "integrations", "industry", "directory", "forms"];
    if (skipPrefixes.includes(segments[0])) return null;

    // Convert hyphens to underscores, add _article suffix
    return slug.replace(/-/g, "_") + "_article";
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Utility: slugify campaign name
// ---------------------------------------------------------------------------

export function slugifyCampaign(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_-]/g, "");
}

// ---------------------------------------------------------------------------
// UTM parameter colors for syntax highlighting
// ---------------------------------------------------------------------------

export const PARAM_COLORS: Record<string, string> = {
  utm_source: "#FF6600",   // Orange (primary)
  utm_medium: "#3B82F6",   // Blue
  utm_campaign: "#22C55E", // Green
  utm_term: "#A855F7",     // Purple
  utm_content: "#EC4899",  // Pink
  pp_sql: "#22D3EE",       // Cyan
};

// ---------------------------------------------------------------------------
// Educational explanation templates
// ---------------------------------------------------------------------------

export function getParamExplanation(
  key: string,
  value: string,
  channel: { label: string; category: string } | null
): string {
  switch (key) {
    case "utm_source":
      return `WHERE the traffic comes from. Set to '${value}' because the link lives on ${channel?.label ?? "this platform"}. This is the specific platform — not the type of delivery.`;
    case "utm_medium":
      if (channel?.category === "email") {
        return `For email, source is already 'email', so medium describes the AUDIENCE or email type instead. '${value}' categorises who is receiving this email.`;
      }
      return `HOW the traffic arrives. '${value}' categorises the delivery mechanism — whether it's a social post, QR scan, paid click, or something else.`;
    case "utm_campaign":
      return `WHICH campaign this belongs to. '${value}' groups all links for this initiative so every click can be measured as one effort in GA4 and HubSpot.`;
    case "utm_term":
      return `Tracks the specific element that was clicked. '${value}' tells us exactly which clickable element drove this visit — for example, a hero button, QR scan, or social post.`;
    case "utm_content":
      return `Differentiates THIS specific link from others in the same campaign. For blogs, it's the slug converted to underscores + '_article'. For emails, it's the blast name. For print, it's the physical asset.`;
    case "pp_sql":
      return `Custom Peach parameter for Marketing SQL attribution. '${value}' was auto-detected from the URL — it identifies the product, payment method, or integration this link promotes. When someone submits a form after clicking this link, HubSpot auto-flags them as a Sales Qualified Lead.`;
    default:
      return "";
  }
}
