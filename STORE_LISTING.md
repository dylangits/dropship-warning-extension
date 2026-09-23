# Edge Add-ons Store Submission — Dropshipping Site Warning

Use this as the copy/paste source when filling out Partner Center. Distribution: **Unlisted**.

## Basic info

**Extension name:** Dropshipping Site Warning

**Version:** 1.1 (see [manifest.json](manifest.json))

**Category:** Shopping

**Short description** (≤132 chars):
> Flags Shopify stores whose shipping policy suggests slow overseas dropshipping, with an explanation of the evidence.

## Detailed description

> Dropshipping Site Warning looks at the shipping/delivery policy of Shopify-powered stores and shows a color-coded
> banner when the estimated delivery time or wording is commonly associated with overseas dropshipping (for example,
> "ships from China," "ePacket," or delivery windows of 1–3+ weeks) versus locally-held stock.
>
> This is a heuristic tool, not a verified fact-check — it highlights patterns worth double-checking before you buy,
> and always shows you the exact matched text via the "Tell me why" button so you can judge for yourself.
>
> - Green banner: shipping details suggest local stock (fast delivery, local courier)
> - Yellow banner: shipping details are commonly seen with dropshipping from overseas suppliers
> - Orange banner: very long or vague delivery windows, consistent with international shipping
>
> The extension only activates on Shopify sites, does not collect or transmit any personal data, and makes network
> requests only to fetch the shipping policy page of the site you're already visiting (to read its text — nothing is
> sent anywhere).

## Single purpose description (required by Edge review)

> The extension's single purpose is to read a Shopify store's own shipping/delivery policy text and show the
> shopper an on-page warning banner summarizing what that text suggests about delivery origin and speed.

## Permissions justification

- `activeTab` — used to read the shipping policy text of the tab the user is currently viewing.
- `scripting` — used to inject the content script that renders the banner and evidence modal.
- Content script `matches: <all_urls>` — required because the extension must run on every Shopify storefront domain
  (there's no way to know in advance which domains are Shopify stores); the script itself exits immediately on any
  non-Shopify page ([content.js](content.js) — Shopify detection check near the top of the IIFE).

## Privacy tab answers

- **Does this extension collect user data?** No.
- **Does it use remote code?** No — all JS ships in the package, nothing is `eval`'d or loaded from a remote host.
- **Network requests:** Only a same-origin-context `fetch()` of the current site's own shipping/delivery policy page,
  to read its text client-side. No data is sent to any third party or to the developer.
- **Data sold or shared with third parties?** No.

## Screenshots

Use the mockups in [store-assets/](store-assets/) (1280×800, meets Edge's screenshot size requirement):
- `screenshot-1-dropship-warning.png` — yellow banner example
- `screenshot-2-local-stock.png` — green/local-stock example
- `screenshot-3-international.png` — orange/international example

## Store icon

Use [icons/icon300-store-listing.png](icons/icon300-store-listing.png) for the listing icon field.
The manifest itself references icons/icon16, 32, 48, 128.

## Notes on wording changes made before submission

Earlier banner copy stated things like "This product **is likely** dropshipped from China" as a flat claim about a
specific seller. That phrasing risked tripping Edge's policy against deceptive or unsubstantiated claims about a
third party. All banner strings were reworded in [content.js](content.js) to frame matches as patterns worth
checking ("shipping details commonly seen with...", "worth double-checking") rather than assertions of fact. No
detection logic changed — only the displayed wording.
