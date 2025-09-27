(function () {
  function createBanner(message, color = "yellow") {
    let banner = document.getElementById("dropship-warning-banner");
    if (!banner) {
      banner = document.createElement("div");
      banner.id = "dropship-warning-banner";
      banner.style.color = "black";
      banner.style.fontWeight = "bold";
      banner.style.textAlign = "center";
      banner.style.padding = "10px";
      banner.style.position = "fixed";
      banner.style.top = "0";
      banner.style.left = "0";
      banner.style.right = "0";
      banner.style.zIndex = "999999";
      banner.style.borderBottom = "2px solid orange";
      banner.style.fontFamily = "Arial, sans-serif";
      document.body.prepend(banner);
    }
    banner.style.background = color;
    banner.textContent = message;
  }

  // Detect Shopify
  const isShopify =
    document.querySelector("meta[name='shopify-digital-wallet']") ||
    window.Shopify;

  if (!isShopify) return;

  // Default banner
  createBanner(
    "⚠️ WARNING: This may be a dropshipping site - Confirm shipping policy"
  );

  // Find "shipping" or "delivery" policy links
  const policyLink = [...document.querySelectorAll("a")]
    .map(a => a.href.toLowerCase())
    .find(href => href.includes("shipping") || href.includes("delivery"));

  if (policyLink) {
    fetch(policyLink)
      .then(res => res.text())
      .then(html => {
        const text = html.replace(/\s+/g, " ").toLowerCase();

        // 🔑 Detect any variant of 7–20 days
        if (/\b7\s*[-–]\s*20\s*(business\s*)?days/.test(text)) {
          createBanner(
            "⚠️ Shipping policy shows 7–20 days. This product is likely dropshipped from China",
            "yellow"
          );
          return;
        }

        // Fallback: generic day ranges
        const match = html.match(/(\d{1,2})\s*[-–]\s*(\d{1,2})\s*days/i);
        if (match) {
          const min = parseInt(match[1]);
          const max = parseInt(match[2]);

          if (max <= 7) {
            createBanner(
              "✅ Shipping policy shows " +
                min +
                "-" +
                max +
                " days. This product likely ships from Australia.",
              "lightgreen"
            );
          } else if (min >= 7 && max <= 20) {
            createBanner(
              "⚠️ Shipping policy shows " +
                min +
                "-" +
                max +
                " days. This product likely ships from China",
              "yellow"
            );
          } else {
            createBanner(
              "⚠️ Shipping policy shows " +
                min +
                "-" +
                max +
                " days. Delivery may be international.",
              "orange"
            );
          }
        }
      })
      .catch(err => console.debug("Could not fetch shipping policy:", err));
  }
})();