# Dropshipping Warning Extension

A simple Microsoft Edge extension that warns users when visiting a Shopify website.  
It detects possible dropshipping sites by analyzing their shipping or delivery policy, written by ChatGPT in a pinch to help my elderly parents detect a dropshipping site because I got tired of the 'educate > ignore > complain' cycle

## Features
- Detects if a website is running on Shopify.  
- Displays a warning banner at the top of the page.  
- Crawls the **Shipping** or **Delivery** policy page (if available).  
- Highlights estimated delivery times:
  - ✅ **≤ 7 days** → Likely ships from **Australia** (Green banner).  
  - ⚠️ **7–20 days** → Likely dropshipped from **China** (Yellow banner).  
  - ⚠️ **Other ranges** → Treated as possible international shipping (Orange banner).  

## Installation (Edge)
1. Download this repository or ZIP file.  
2. Open Edge and go to:  
   ```
   edge://extensions/
   ```  
3. Enable **Developer mode** (bottom-left toggle).  
4. Click **Load unpacked**.  
5. Select the folder containing the extension (`manifest.json`, `content.js`, `banner.css`, `README.md`).  

## File Overview
- `manifest.json` → Extension manifest (declares permissions and content scripts).  
- `content.js` → Main logic (detects Shopify, fetches shipping/delivery policy, sets banner).  
- `banner.css` → Styling for the warning banner.  
- `README.md` → This documentation.  

## Limitations
- Not all Shopify stores are dropshippers.  
- Some sites may hide shipping times in non-standard pages (not linked with “shipping” or “delivery”).  
- Regex checks may miss unusual formats (e.g., “within two weeks”).  
