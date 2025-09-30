# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Microsoft Edge browser extension (Manifest V3) that detects Shopify-based dropshipping sites by analyzing their shipping policies. It displays interactive warning banners to users based on phrase detection and estimated delivery times, with detailed explanations available on demand.

## Architecture

### Core Files

- **[manifest.json](manifest.json)** - Extension manifest defining permissions (`scripting`, `activeTab`) and content scripts that run on all URLs
- **[content.js](content.js)** - Main detection logic that runs as a content script on every page
- **[banner.css](banner.css)** - Styles for the fixed-position warning banner

### Detection Flow (Hybrid Strategy)

1. **Shopify Detection** ([content.js:138-141](content.js#L138-L141))
   - Checks for `meta[name='shopify-digital-wallet']` or `window.Shopify`
   - Exits early if not a Shopify site

2. **Strategy 1: Current Page Analysis** ([content.js:493-499](content.js#L493-L499))
   - If already on a shipping/delivery policy page (URL contains "shipping", "delivery", or "ship")
   - Immediately analyzes visible page text via `document.body.innerText`
   - Avoids CORS issues by not fetching external content

3. **Strategy 2: Fetch & Analyze** ([content.js:506-521](content.js#L506-L521))
   - Shows default warning banner on product pages
   - Finds shipping/delivery policy links
   - Fetches policy page via `fetch()` (may fail due to CORS)
   - Analyzes fetched HTML content

### Detection Methods (Priority Order)

The `analyzeShippingText()` function ([content.js:152-491](content.js#L152-L491)) checks in this order:

1. **High-Confidence Dropshipping Phrases** ([content.js:157-218](content.js#L157-L218))
   - Ships from China/Guangzhou/Shenzhen/overseas
   - China Post, ePacket, Yanwen
   - International warehouse
   - Fulfillment partner / third-party fulfillment
   - Processing time disclaimers
   - "Please allow 2-4 weeks"
   - Customs delay disclaimers
   - Tracking update warnings

2. **Australian/Local Shipping Indicators** ([content.js:221-262](content.js#L221-L262))
   - Ships from Sydney/Melbourne/Brisbane/Perth/Adelaide/Australia
   - Australia Post / AusPost
   - Australian stock / local stock
   - Same-day dispatch
   - Express post available

3. **Time-Based Patterns** ([content.js:264-489](content.js#L264-L489))
   - 7-20 days (specific pattern)
   - "7 to 20 days" variant
   - Week ranges (converted to days)
   - "Up to X days"
   - "Between X and Y days"
   - Generic day ranges (fallback)

### Banner Colors & Meanings

- **Green** (`lightgreen`) - Local Australian stock detected (≤7 days or AU indicators)
- **Yellow** (`yellow`) - Likely dropshipped from China (7-20 days or China indicators)
- **Orange** (`orange`) - International shipping (>20 days)

### User Interface

**Banner Components** ([content.js:4-51](content.js#L4-L51)):
- Message text
- "Tell me why" button (appears when evidence is available)
- "✕" hide/dismiss button (always visible)

**Evidence Modal** ([content.js:53-105](content.js#L53-L105)):
- Shows exact matched text (e.g., "ships from china")
- Explains why it's an indicator
- Links to source URL (shipping policy page)
- Click outside or ✕ to close

### CSS Isolation

All UI elements use `cssText` with explicit styles ([content.js:35](content.js#L35), [content.js:44](content.js#L44), [content.js:49](content.js#L49)) to prevent CSS inheritance from host websites. This ensures consistent appearance across all sites.

## Development

### Testing

Load the extension in Edge:
1. Navigate to `edge://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select this directory

**Test scenarios:**
- Product pages with shipping links (tests fetch strategy)
- Direct shipping policy pages (tests current-page strategy)
- Sites with phrase indicators (e.g., "ships from China", "Australia Post")
- Various time formats ("7-20 days", "1-2 weeks", "up to 14 days")

### Key Constraints

- Content scripts run at `document_idle` to ensure DOM is ready
- Banner uses `z-index: 999999` (modal: `9999999`) to overlay all content
- Body gets `margin-top: 50px !important` to prevent content overlap
- Fetch requests may fail due to CORS - errors are caught and logged to console
- All UI elements use isolated CSS to prevent inheritance

### Known Limitations

- **False positives:** Removed 4PX detection (matched CSS "4px" instead of courier)
- **CORS blocking:** Fetch strategy fails on some sites - current-page strategy mitigates this
- **Regex limitations:** May miss unusual phrasing (e.g., "within a fortnight")
- **All Shopify sites:** Extension shows warnings on ALL Shopify sites, not just dropshippers

## Code Patterns to Follow

When adding new detection patterns:
1. Add regex + explanation to appropriate array in `analyzeShippingText()`
2. Use `normalized.match()` to capture matched text for evidence
3. Pass evidence object to `createBanner()`: `{found: string, explanation: string, url: string}`
4. Test for false positives on normal e-commerce sites
5. Place high-confidence patterns earlier in detection order