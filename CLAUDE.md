# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Microsoft Edge browser extension (Manifest V3) that detects Shopify-based dropshipping sites by analyzing their shipping policies. It displays warning banners to users based on estimated delivery times.

## Architecture

### Core Files

- **[manifest.json](manifest.json)** - Extension manifest defining permissions (`scripting`, `activeTab`) and content scripts that run on all URLs
- **[content.js](content.js)** - Main detection logic that runs as a content script on every page
- **[banner.css](banner.css)** - Styles for the fixed-position warning banner

### Detection Flow

1. **Shopify Detection** ([content.js:25-28](content.js#L25-L28))
   - Checks for `meta[name='shopify-digital-wallet']` or `window.Shopify`
   - Exits early if not a Shopify site

2. **Initial Warning** ([content.js:32-34](content.js#L32-L34))
   - Displays default yellow warning banner immediately on Shopify sites

3. **Shipping Policy Analysis** ([content.js:37-92](content.js#L37-L92))
   - Searches all `<a>` tags for links containing "shipping" or "delivery"
   - Fetches the policy page via `fetch()`
   - Parses HTML content for day ranges using regex patterns

4. **Banner Updates** ([content.js:2-22](content.js#L2-L22))
   - Green banner (≤7 days) = likely Australia-based shipping
   - Yellow banner (7-20 days) = likely China dropshipping
   - Orange banner (other ranges) = international shipping

### Key Patterns

- **7-20 Day Detection** ([content.js:48](content.js#L48)): Uses regex `/\b7\s*[-–]\s*20\s*(business\s*)?days/`
- **Generic Day Range** ([content.js:57](content.js#L57)): Fallback pattern `(\d{1,2})\s*[-–]\s*(\d{1,2})\s*days`
- **Banner Singleton** ([content.js:3](content.js#L3)): Uses `getElementById` to prevent duplicate banners

## Development

### Testing

Load the extension in Edge:
1. Navigate to `edge://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select this directory

Test on Shopify sites with known shipping policies to verify banner colors and messages.

### Key Constraints

- Content scripts run at `document_idle` to ensure DOM is ready
- Banner uses `z-index: 999999` and `position: fixed` to overlay all content
- Body gets `margin-top: 50px !important` to prevent content overlap
- Fetch requests may fail due to CORS - errors are caught and logged to console

## Limitations

- Regex patterns may not catch all shipping time formats (e.g., "within two weeks")
- Some sites hide shipping info on non-standard pages without "shipping" or "delivery" in the URL
- Extension displays warnings on ALL Shopify sites, not just dropshippers