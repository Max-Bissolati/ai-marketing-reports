# UTM Builder Skill — Implementation Plan

## Context

The marketing team needs to create UTMs for campaigns, but not everyone understands UTM parameters. We're building the first "skill" in the AI Marketing UI — a UTM Builder that guides users through creating properly tagged URLs with educational explanations. This also establishes the skills architecture (card stack + single-page flows) that future skills will follow.

**The skill logic lives in N8N** (not a black box) so it's visible, editable, and extensible.

---

## Peach Payments UTM Rules (Source of Truth)

### Golden Rules of Data Hygiene
- **Lowercase only** — never capital letters (`newsletter`, not `Newsletter`)
- **Underscores** — use `_` to separate words (`merchant_gift_box`, not `merchant gift box`)
- **Exception**: HubSpot predefined campaign names (e.g., `37427640-Payouts 2026`) — keep as-is
- **Blog slug rule**: Convert URL slug hyphens → underscores + add `_article` suffix
  - URL: `.../scale/new-standard-for-sa-payouts/`
  - utm_content: `new_standard_for_sa_payouts_article`

### Parameter Logic by Channel

| Channel | utm_source | utm_medium | utm_term | utm_content | pp_sql |
|---------|-----------|------------|----------|-------------|--------|
| **Social (LinkedIn)** | `linkedin` | `social` | `social_post` | Blog slug or asset name | Auto-detected from URL |
| **Social (Facebook)** | `facebook` | `social` | `social_post` | Blog slug or asset name | Auto-detected from URL |
| **Email** | `email` | Audience/type (e.g., `partnership_launch`, `pos_merchants`) | `hero_button` / `logo` / `bottom_button` (per CTA) | Email blast name | Auto-detected from URL |
| **Print/Flyer QR** | `flyer` | `qr_code` | `qr_scan` | Physical asset name (e.g., `hostex_nebula_promo`) | Auto-detected from URL |
| **Paid (CPC)** | `google` / `facebook` | `cpc` | `ad_headline` / `ad_banner` | Ad variant | Auto-detected from URL |
| **Website** | `main_website` | `popup` / `banner` | `popup_cta` / `sidebar_banner` | Page or asset name | Auto-detected from URL |

### Custom `pp_sql` Parameter (Replaces marketing_sql Hack)
Instead of hijacking `utm_term`, we use a clean custom query parameter for SQL attribution:

| Parameter | Purpose | Example |
|-----------|---------|---------|
| `utm_term` | **Freed up** — tracks the actual element clicked | `hero_button`, `social_post`, `qr_scan` |
| `pp_sql` | Marketing SQL attribution flag with product context | `payouts`, `point_of_sale`, `apple_pay`, `shopify` |

**How it works across systems:**
- **Rybbit**: Full URL stored in ClickHouse — queryable with `WHERE url LIKE '%pp_sql%'`
- **GA4**: Register `pp_sql` as a custom dimension (one-time setup)
- **HubSpot**: Hidden form field captures `pp_sql` from URL → triggers SQL lifecycle workflow

### Peach Payments Product Catalog (for pp_sql values)

**Products** (9):
`business_funding`, `embedded_checkout`, `multi_currency_payments`, `online_payment_gateway`, `payment_links`, `payment_pages`, `payouts`, `point_of_sale`, `subscription_and_recurring_payments`

**Payment Methods** (24):
`1voucher`, `american_express`, `apple_pay`, `blink_by_emtel`, `capitec_pay`, `diners_club`, `float`, `google_pay`, `happy_pay`, `ke_mpesa`, `mastercard`, `maucas`, `mcb_juice`, `mobicred`, `moneybadger`, `nedbank_direct_eft`, `pay_by_bank`, `payflex`, `paypal`, `rcs`, `samsung_pay`, `scan_to_pay_qr_code`, `visa`, `zeropay`

**Integrations** (10):
`flowcart`, `hti`, `pol360`, `posterita`, `resrequest`, `roomraccoon`, `shiprazor`, `webbieshop`, `xero`, `yoyo_rewards`

**AI Auto-Detection**: When user enters a URL, the N8N Code node (or an AI node) can match the URL path against this catalog to auto-suggest the `pp_sql` value. E.g., URL contains `/products/payouts` → `pp_sql=payouts`.

### HubSpot Campaign Sync
Every UTM link should be associated with a HubSpot campaign. Campaign names may be:
- HubSpot-generated with ID prefix: `37427640-Payouts 2026`
- Custom: `[theme]_[year]` format (e.g., `www_research_report_2026`)

---

## UX Flow (Single Page, 4 States)

```
[Skills Home]  →  click card  →  [UTM Builder]
                                      |
                    State 1: URL + Channel Selection
                                      |
                    State 2: Campaign & Element Details
                                      |
                    State 3: Review & QA Check
                                      |
                    State 4: Results + QR Code + Explanations
                                      |
                              "Create Another" → back to State 1
```

### State 1 — "What are you sharing?"
- URL input field (large, prominent)
- **Auto-detect blog URL**: If URL contains a slug path, auto-extract and show: "Detected blog slug: `new_standard_for_sa_payouts_article`"
- "Where will this link live?" channel selection grid:
  - **Social**: LinkedIn, Facebook, X, YouTube, Instagram
  - **Email**: Newsletter, Partnership, Product Update, Event Invite
  - **Print/Physical**: Flyer, Banner, Business Card, Sticker, Merchant Gift Box
  - **Paid**: Google Ads, Facebook Ads, LinkedIn Ads
  - **Website**: Popup, Banner, CTA Button
  - **Events**: Conference, Webinar
  - **Other**: WhatsApp, SMS, Podcast
- Each option is a small glass tile with icon + label, orange border when selected

### State 2 — "Campaign & Element Details"
- Selected channel shown as a pill/badge at top
- **HubSpot Campaign**: Select existing or create new
  - Dropdown of existing HubSpot campaigns (fetched via N8N)
  - "Create new campaign" option → text input for `[theme]_[year]` format
- **What element will they click?** — contextual based on channel:
  - Social: `social_post` (default), `bio_link`, `story_link`
  - Email: `hero_button`, `logo`, `bottom_button`, `demo_video`, `text_link`
  - Print: `qr_scan` (default)
  - Website: `hero_button`, `popup_cta`, `sidebar_banner`
- This sets `utm_term` to the element name (e.g., `hero_button`, `qr_scan`)
- **Content identifier** (auto-suggested based on channel):
  - Blog URL detected → auto-fills with slug conversion
  - Email → prompt for email blast name
  - Print → prompt for physical asset name
- Live preview of all UTM parameters being built

### State 3 — "Quality Check" (Auto-Validation)
- Animated QA checklist with pass/fail indicators:
  - All lowercase?
  - No spaces (underscores only)?
  - `pp_sql` parameter present?
  - Product/payment method auto-detected?
  - URL loads correctly? (optional — could be slow)
  - All required params filled?
- Shows the complete URL with color-coded params
- User can go back and edit, or confirm to generate

### State 4 — "Your UTM is Ready"
- Color-coded full URL (each param highlighted in a distinct color)
- Short link (from Sink/ppay.click) with copy button
- Accordion with educational explanations:
  - WHY this source, medium, term, content were chosen
  - The `pp_sql` explanation: how it triggers the HubSpot SQL workflow and carries product context
- HubSpot campaign confirmation (linked/created)
- If print/physical channel: QR code card with SVG/PNG download buttons
- QR encodes the SHORT link (cleaner scan, redirects to full UTM URL)
- "Create Another" button resets to State 1

### Container Morphing
The bento-card container uses framer-motion `layout` prop to smoothly change width between steps (narrow for input, wider for results). Beautiful spring animation as the card reshapes.

---

## Architecture

### New Files

```
services/ai-marketing-ui/src/
  app/
    skills/
      page.tsx                           # Skills home (card stack)
      utm-builder/
        page.tsx                         # UTM Builder route (renders flow)
  components/
    skills/
      skill-card-stack.tsx               # Animated card stack
      utm/
        utm-builder-flow.tsx             # State machine orchestrator
        step-url-input.tsx               # State 1
        step-campaign-details.tsx        # State 2
        step-results.tsx                 # State 3
        utm-url-display.tsx              # Color-coded URL with copy
        utm-param-explanation.tsx         # Accordion with educational content
        qr-code-card.tsx                 # QR generation + download
  lib/
    utm-constants.ts                     # Medium options, explanation templates
  types/
    utm-types.ts                         # TypeScript interfaces
```

### Modified Files

| File | Change |
|------|--------|
| `src/app/page.tsx` | Add link to `/skills` |
| `package.json` | Add `qrcode.react` dependency |

### Reusing Existing Components/Patterns

- `bento-card` CSS class (globals.css) — all cards
- `Glass`/`GlassCard`/`GlassButton` components — UI elements
- `ui/input`, `ui/button`, `ui/select`, `ui/accordion`, `ui/badge` — form controls
- Framer-motion variant pattern: `{ opacity: 0, y: 30, scale: 0.95 }` → spring stiffness 100, damping 15
- `cn()` utility from `@/lib/utils`
- Lucide icons for medium type icons

---

## N8N Workflow (6 Nodes)

```
Webhook → Code (UTM Logic + Validation) → HTTP Request (Sink Short Link) → HubSpot (Campaign Sync) → Code (Assemble Response) → Respond to Webhook
```

### Node 1: Webhook
- POST `/webhook/utm-builder`
- Response mode: `responseNode`

### Node 2: Code (UTM Logic + Validation)
- Receives: `{ url, channel, campaignId?, campaignName?, element, contentId?, emailAudience? }`
- Enforces all Peach golden rules:
  - Lowercase everything
  - Replace spaces with underscores
  - Set `utm_term` to the element clicked (e.g., `hero_button`, `qr_scan`)
  - Auto-detect blog slug → convert to content identifier
  - Contextual `utm_medium` based on channel type (email gets audience type, not "email")
  - Auto-detect product/payment method/integration from URL path → set `pp_sql` value
- Generates educational explanations for each parameter
- Validates: no uppercase, no spaces, pp_sql present, all required fields
- Constructs full URL with query string + pp_sql parameter

### Node 3: HTTP Request (Sink Short Link)
- POST `https://ppay.click/api/link/create`
- Bearer token auth (N8N credential)
- Body: `{ "url": fullUrl, "comment": campaignName }`
- Returns: `{ link, shortLink }`

### Node 4: HubSpot (Campaign Sync)
- If existing campaign: Associate link with campaign
- If new campaign: Create campaign via HubSpot API, return campaign ID
- Uses N8N HubSpot node or HTTP Request with HubSpot API

### Node 5: Code (Assemble Response)
- Merges UTM data + Sink short link + HubSpot campaign info

### Node 6: Respond to Webhook
- Returns:
```json
{
  "fullUrl": "https://peachpayments.com/scale/new-standard-for-sa-payouts/?utm_source=linkedin&utm_medium=social&utm_campaign=37427640-Payouts+2026&utm_term=social_post&utm_content=new_standard_for_sa_payouts_article&pp_sql=payouts",
  "shortLink": "https://ppay.click/abc123",
  "params": [
    {
      "key": "utm_source",
      "value": "linkedin",
      "explanation": "This identifies WHERE your traffic comes from. Set to 'linkedin' because the link will live on LinkedIn.",
      "color": "#FF6600"
    },
    {
      "key": "utm_term",
      "value": "social_post",
      "explanation": "Tracks the specific element that was clicked. 'social_post' means this link appeared as a social media post.",
      "color": "#A855F7"
    },
    {
      "key": "pp_sql",
      "value": "payouts",
      "explanation": "Custom Peach parameter for Marketing SQL attribution. Auto-detected 'payouts' from the URL path. This triggers a HubSpot workflow to flag form submitters as Sales Qualified Leads for the Payouts product.",
      "color": "#22D3EE"
    }
  ],
  "requiresQR": false,
  "hubspotCampaign": { "id": "37427640", "name": "Payouts 2026" },
  "qaChecks": { "lowercase": true, "noSpaces": true, "hasPpSql": true }
}
```

---

## QR Code

- **Library**: `qrcode.react` (React-native, TypeScript, SSR-safe)
- **Encodes**: Short link (not full URL — shorter = cleaner QR, same analytics tracking)
- **Style**: Transparent bg, #FF6600 foreground (brand orange)
- **Downloads**:
  - SVG: XMLSerializer → Blob → download
  - PNG: Canvas at 4x resolution → toDataURL → download

---

## Educational Explanations

Each UTM parameter gets a Peach-specific explanation of WHY it was set to that value:

| Param | Explanation Template |
|-------|---------------------|
| `utm_source` | "WHERE the traffic comes from. Set to '{value}' because the link lives on {channel_label}. This is the specific platform — not the type of delivery." |
| `utm_medium` | **Social/Print/Paid**: "HOW the traffic arrives. '{value}' categorizes the delivery mechanism (social post, QR scan, paid click)." **Email**: "For email, source is already 'email', so medium describes the AUDIENCE or email type instead: '{value}'." |
| `utm_campaign` | "WHICH campaign this belongs to. '{value}' groups all links for this initiative. Every click with this campaign value can be measured as one effort in GA4 and HubSpot." |
| `utm_term` | "Tracks the specific element that was clicked. '{value}' tells us exactly which clickable element drove this visit (e.g., hero_button, qr_scan, social_post)." |
| `pp_sql` | "Custom Peach parameter for Marketing SQL attribution. '{value}' was auto-detected from the URL — it identifies the product/payment method/integration this link promotes. When someone submits a form after clicking this link, HubSpot auto-flags them as a Sales Qualified Lead for {value}." |
| `utm_content` | "Differentiates THIS specific link from others in the same campaign. For blogs, it's the slug converted to underscores + '_article'. For emails, it's the blast name. For print, it's the physical asset." |

Displayed as an Accordion — each item shows param name, its value (color-coded), and expands to show the full explanation. The `pp_sql` explanation gets a special callout badge highlighting its importance for lead attribution.

---

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Single page with state machine | User requested smooth "change shape" transitions. Route changes would cause full re-renders and lose layout animations. |
| N8N for UTM logic | User wants visible/editable workflow. Also future-proofs for logging, campaign validation, AI suggestions. |
| `qrcode.react` over `qr-code-styling` | `qr-code-styling` is vanilla JS for Vue. `qrcode.react` is purpose-built for React with TypeScript support. |
| Short link in QR (not full URL) | QR density increases with URL length. A 200+ char UTM URL makes a dense QR. Short link (~20 chars) scans cleanly. |
| Client-side QR generation | No server-side QR endpoint exists in Sink. Client-side is instant with no API call needed. |

---

## Implementation Order

1. **Foundation** — Types, constants, install `qrcode.react`
2. **N8N Workflow** — Create via MCP, test with curl
3. **Results Components** — utm-url-display, utm-param-explanation, qr-code-card, step-results
4. **Form Steps** — step-url-input, step-campaign-details
5. **State Machine** — utm-builder-flow orchestrator + route page
6. **Skills Home** — Card stack + skills page + update home page
7. **Polish** — Animations, responsive, error handling

---

## Open Questions (Remaining)

1. **HubSpot API access** — Do we have HubSpot API credentials configured in N8N already? Which API for campaign management?
2. **Interface reference** — You mentioned a link to an interface you like. Want to share that before we start?
3. **QR Code Builder platform** — Is this the Sink dashboard at ppay.click, or a separate tool?
4. **Sink API token in N8N** — Is the ppay.click Bearer token already saved as an N8N credential?

### Resolved: marketing_sql → pp_sql
The original `marketing_sql` hack was never implemented — it was planned but limited by HubSpot's UTM builder only allowing 2 custom fields. Since we're building our own system, we've upgraded to:
- **`pp_sql`** — a clean custom parameter carrying product/payment method/integration context
- **`utm_term`** — freed up for actual element tracking (no more hijacking)
- **Product auto-detection** from URL path against the full Peach catalog (9 products, 24 payment methods, 10 integrations)
- **HubSpot integration** via hidden form field that captures `pp_sql` → triggers SQL lifecycle workflow

### Prerequisites — Credential Setup Guide

#### 1. Sink API Token (ppay.click)
The Sink link shortener uses a site token for API authentication.

1. Go to `ppay.click` admin dashboard and log in
2. Find the site token in your Cloudflare Workers environment variables (it's the `NUXT_SITE_TOKEN` value)
3. In N8N (`automations.thingymajigs.app`):
   - Go to **Credentials** → **Add Credential**
   - Select **Header Auth**
   - Name: `Sink API Token`
   - Header Name: `Authorization`
   - Header Value: `Bearer YOUR_SITE_TOKEN`
   - Save

#### 2. HubSpot Private App Token
HubSpot uses Private App tokens for API access (replaces legacy API keys).

1. Go to HubSpot → **Settings** (gear icon) → **Integrations** → **Private Apps**
2. Click **Create a private app**
3. Name: `AI Marketing Engine`
4. Under **Scopes**, enable:
   - `crm.objects.marketing_events.read` + `write` (for campaigns)
   - `crm.objects.contacts.read` (for lead lookup)
   - `crm.schemas.contacts.read` (for custom properties)
5. Click **Create App** → Copy the **Access Token**
6. In N8N:
   - Go to **Credentials** → **Add Credential**
   - Select **HubSpot App Token** (or **Header Auth** if using HTTP Request node)
   - Paste the access token
   - Save

#### 3. GA4 Custom Dimension (can be done later)
1. Go to GA4 → **Admin** → **Custom definitions** → **Custom dimensions**
2. Click **Create custom dimension**
3. Dimension name: `Marketing SQL Product`
4. Scope: **Event**
5. Event parameter: `pp_sql`
6. Save — it'll start collecting data from new hits

**Note:** We'll build the UI and N8N workflow first. Credentials can be added when we're ready to test end-to-end.

---

## Verification

1. Run `npm run dev` in ai-marketing-ui
2. Navigate to `/skills` — card stack renders with "Create a UTM" card
3. Click card → navigates to `/skills/utm-builder`
4. Enter a URL, select a medium (e.g., "QR Code on Flyer"), click Next
5. Enter campaign name, click "Generate UTM"
6. Verify N8N webhook is called (check N8N executions)
7. Results show: color-coded URL, short link, educational explanations, QR code
8. Download QR as SVG and PNG — verify they render correctly
9. Click "Create Another" — resets to State 1
10. Test with a non-QR medium (e.g., LinkedIn) — verify no QR card shown
