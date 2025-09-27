# Dropshipping Warning Extension

A simple Microsoft Edge extension that warns users when visiting a Shopify website.  
It detects possible dropshipping sites by analyzing their shipping or delivery policy, written by ChatGPT in a pinch to help my elderly parents detect a dropshipping site because I got tired of the 'educate > ignore > complain' cycle

## Features
- Detects if a website is running on Shopify.  
- Displays a warning banner at the top of the page.  
- Crawls the **Shipping** or **Delivery** policy page (if available).  
- Highlights estimated delivery times:
  - ✅ **≤ 7 days** → Likely ships from **Australia** (Green banner). 
  ![alt text](https://github.com/dylangits/dropship-warning-extension/blob/main/examples/example2.png "Example of a likely AU based shipper")
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

## Contributing

This project is very much vibecoded — I’m an amateur developer hacking things together to make life easier.
If you spot bugs, have ideas for improvements, or want to make the code cleaner, please feel free to:
-	Fork the repo and submit a pull request
- Raise an issue with suggestions or problems you find

I’m happy to review and merge changes, and I genuinely welcome feedback from anyone more experienced (or equally vibecoded).