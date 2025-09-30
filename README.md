# Dropshipping Warning Extension

A Microsoft Edge browser extension that helps users identify dropshipping sites on Shopify by analyzing shipping policies and delivery indicators. Originally created to help my elderly parents avoid the 'educate > ignore > complain' cycle with dropshipped products.

## Features

### Smart Detection
- **Shopify Site Detection** - Automatically identifies Shopify-powered stores
- **Phrase-Based Detection** - Identifies high-confidence dropshipping indicators:
  - "Ships from China/Guangzhou/Shenzhen"
  - Chinese couriers (China Post, ePacket, Yanwen)
  - "International warehouse" or "fulfillment partner"
  - Processing time disclaimers
  - Customs delay warnings
- **Australian Stock Detection** - Identifies local businesses:
  - "Ships from Sydney/Melbourne/Brisbane" etc.
  - Australia Post / AusPost mentions
  - "Local stock" or "same-day dispatch"
- **Time-Based Analysis** - Analyzes delivery estimates:
  - ✅ **≤ 7 days** → Likely ships from **Australia** (Green banner)
  - ⚠️ **7–20 days** → Likely dropshipped from **China** (Yellow banner)
  - ⚠️ **>20 days** → International shipping (Orange banner)
  - Supports multiple formats: "7-20 days", "1-2 weeks", "up to 14 days", "between 5 and 10 days"

### Interactive UI
- **Warning Banner** - Fixed top banner with color-coded alerts
![alt text](https://github.com/dylangits/dropship-warning-extension/blob/main/examples/example3.png "Example of default banner")


### Example Detections
- **"Tell Me Why" Button** - Click to see detailed evidence:
  - Exact phrase/pattern detected
  - Explanation of why it's a dropshipping indicator
  - Link to the shipping policy page
- **Hide Button (×)** - Dismiss the banner if desired

**Australian Stock Detection (Green):**
![alt text](https://github.com/dylangits/dropship-warning-extension/blob/main/examples/example2.png "Example of a likely AU based shipper")

![alt text](https://github.com/dylangits/dropship-warning-extension/blob/main/examples/example2a.png "Example of detection method")

**Dropshipping Detection (Yellow):**
![alt text](https://github.com/dylangits/dropship-warning-extension/blob/main/examples/example1.png "Example of a likely CN based shipper")  
![alt text](https://github.com/dylangits/dropship-warning-extension/blob/main/examples/example1a.png "Example of detection method")  

## Installation (Edge)
1. Download this repository or ZIP file.  
2. Open Edge and go to:  
   ```
   edge://extensions/
   ```  
3. Enable **Developer mode** (bottom-left toggle).  
4. Click **Load unpacked**.  
5. Select the folder containing the extension (`manifest.json`, `content.js`, `banner.css`, `README.md`).  

## How It Works

The extension uses a hybrid detection strategy:

1. **Current Page Analysis** - If you're already on a shipping/delivery policy page, it analyzes the visible text immediately
2. **Fetch & Analyze** - On product pages, it finds and fetches the shipping policy page to analyze
3. **Priority Detection** - Checks in order:
   - High-confidence dropshipping phrases (e.g., "ships from China")
   - Australian/local stock indicators (e.g., "Australia Post")
   - Time-based patterns (e.g., "7-20 days")

All styling is isolated using inline CSS to ensure the banner looks consistent across all websites.

## File Overview
- `manifest.json` → Extension manifest (declares permissions and content scripts)
- `content.js` → Main detection logic with phrase/pattern matching
- `banner.css` → Base styling for the warning banner
- `CLAUDE.md` → Technical documentation for developers

## Limitations
- **Not all Shopify stores are dropshippers** - The extension shows warnings on all Shopify sites to encourage checking
- **False positives possible** - Local businesses may have longer shipping times
- **CORS restrictions** - Some sites block cross-origin fetching of shipping policies (mitigated by current-page analysis)
- **Regex limitations** - May miss unusual phrasing like "within a fortnight"  

## Contributing

This project is very much vibecoded — I’m an amateur developer hacking things together to make life easier.
If you spot bugs, have ideas for improvements, or want to make the code cleaner, please feel free to:
-	Fork the repo and submit a pull request
- Raise an issue with suggestions or problems you find

I’m happy to review and merge changes, and I genuinely welcome feedback from anyone more experienced (or equally vibecoded).

Based on the Chrome Web Store Program Policies, I don't think this would ever be allowed to be published (at least in it's current state) because it could 'decieve or mislead users'