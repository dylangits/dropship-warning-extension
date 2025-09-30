(function () {
  let detectionEvidence = null; // Store evidence for "Tell me why" button

  function createBanner(message, color = "yellow", evidence = null) {
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
    banner.innerHTML = ""; // Clear existing content

    // Add message text
    const messageSpan = document.createElement("span");
    messageSpan.textContent = message;
    banner.appendChild(messageSpan);

    // Add "Tell me why" button if evidence exists
    if (evidence) {
      detectionEvidence = evidence;
      const button = document.createElement("button");
      button.textContent = "Tell me why";
      button.style.cssText = "margin-left: 15px; padding: 5px 12px; background: #fff; border: 2px solid #333; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 12px; font-family: Arial, sans-serif; color: #000; line-height: normal; text-transform: none; letter-spacing: normal; box-sizing: border-box;";

      button.onclick = () => showEvidence(evidence);
      banner.appendChild(button);
    }

    // Add hide button
    const hideButton = document.createElement("button");
    hideButton.textContent = "✕";
    hideButton.style.cssText = "margin-left: 15px; padding: 5px 10px; background: transparent; border: 2px solid #333; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 16px; font-family: Arial, sans-serif; color: #000; line-height: normal; text-transform: none; letter-spacing: normal; box-sizing: border-box;";
    hideButton.onclick = () => {
      banner.style.display = "none";
      // Also reset body margin
      document.body.style.marginTop = "";
    };
    banner.appendChild(hideButton);
  }

  function showEvidence(evidence) {
    // Create modal overlay
    let modal = document.getElementById("dropship-evidence-modal");
    if (modal) modal.remove();

    modal = document.createElement("div");
    modal.id = "dropship-evidence-modal";
    modal.style.cssText = "position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.7); z-index: 9999999; display: flex; align-items: center; justify-content: center; padding: 20px; font-family: Arial, sans-serif; box-sizing: border-box;";

    // Create modal content
    const content = document.createElement("div");
    content.style.cssText = "background: white; padding: 25px; border-radius: 8px; max-width: 600px; max-height: 80vh; overflow: auto; position: relative; color: black; font-family: Arial, sans-serif; box-sizing: border-box; line-height: 1.6;";

    // Close button
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "✕";
    closeBtn.style.cssText = "position: absolute; top: 10px; right: 10px; border: none; background: transparent; font-size: 24px; cursor: pointer; color: #666; font-family: Arial, sans-serif; line-height: 1; padding: 0; margin: 0; width: auto; height: auto; box-sizing: border-box;";
    closeBtn.onclick = () => modal.remove();

    // Title
    const title = document.createElement("h2");
    title.textContent = "Detection Evidence";
    title.style.cssText = "margin-top: 0; margin-bottom: 15px; font-family: Arial, sans-serif; font-size: 24px; font-weight: bold; color: black; line-height: 1.2;";

    // Evidence details
    const details = document.createElement("div");
    details.style.cssText = "line-height: 1.6; font-family: Arial, sans-serif;";

    const reason = document.createElement("p");
    reason.innerHTML = "<strong>Found:</strong> " + evidence.found;
    reason.style.cssText = "margin-bottom: 10px; font-family: Arial, sans-serif; font-size: 14px; color: black; line-height: 1.6;";

    const explanation = document.createElement("p");
    explanation.innerHTML = "<strong>Why this matters:</strong> " + evidence.explanation;
    explanation.style.cssText = "margin-bottom: 15px; font-family: Arial, sans-serif; font-size: 14px; color: black; line-height: 1.6;";

    details.appendChild(reason);
    details.appendChild(explanation);

    // Add link if available
    if (evidence.url) {
      const link = document.createElement("a");
      link.href = evidence.url;
      link.textContent = "View shipping policy →";
      link.style.cssText = "color: #0066cc; text-decoration: none; font-weight: bold; font-family: Arial, sans-serif; font-size: 14px;";
      link.target = "_blank";
      details.appendChild(link);
    }

    content.appendChild(closeBtn);
    content.appendChild(title);
    content.appendChild(details);
    modal.appendChild(content);
    document.body.appendChild(modal);

    // Close on outside click
    modal.onclick = (e) => {
      if (e.target === modal) modal.remove();
    };
  }

  // Detect Shopify
  const isShopify =
    document.querySelector("meta[name='shopify-digital-wallet']") ||
    window.Shopify;

  if (!isShopify) return;

  // Check if we're already on a shipping/delivery policy page
  const currentUrl = window.location.href.toLowerCase();
  const isShippingPage =
    currentUrl.includes("shipping") ||
    currentUrl.includes("delivery") ||
    currentUrl.includes("ship");

  function analyzeShippingText(text, sourceUrl = null) {
    // Normalize whitespace for better matching
    const normalized = text.replace(/\s+/g, " ").toLowerCase();

    // 🚨 High-confidence dropshipping indicators (check first)
    const dropshippingPhrases = [
      {
        regex: /ships?\s+from\s+(china|guangzhou|shenzhen|overseas)/,
        explanation: "Products shipping directly from China typically take 2-4 weeks and indicate dropshipping from Chinese suppliers like AliExpress or Alibaba."
      },
      {
        regex: /china\s+post/,
        explanation: "China Post is a Chinese postal service commonly used by dropshippers. Packages often take 15-30 days to arrive."
      },
      {
        regex: /epacket\s+shipping/,
        explanation: "ePacket is a shipping method specifically for packages from China to other countries, commonly used by dropshippers."
      },
      {
        regex: /\byanwen\b/,
        explanation: "Yanwen is a Chinese logistics company frequently used by dropshipping operations."
      },
      {
        regex: /international\s+warehouse/,
        explanation: "References to 'international warehouse' often mean the product ships from overseas, typically China."
      },
      {
        regex: /fulfillment\s+partner|third[-\s]party\s+fulfillment/,
        explanation: "Third-party fulfillment often indicates dropshipping where the seller doesn't hold inventory."
      },
      {
        regex: /processing\s+time:\s*\d+[-–]\d+\s*days/,
        explanation: "Separate 'processing time' (before shipping) is common with dropshippers who must order from suppliers before shipping to you."
      },
      {
        regex: /please\s+allow\s+2[-–]4\s+weeks/,
        explanation: "2-4 week delivery times are typical for dropshipped products coming from China."
      },
      {
        regex: /delivery\s+may\s+take\s+longer\s+during\s+peak\s+season/,
        explanation: "This vague disclaimer is often used by dropshippers to manage expectations for long shipping times."
      },
      {
        regex: /not\s+responsible\s+for\s+customs\s+delays/,
        explanation: "This indicates international shipping, often from China, where customs can add significant delays."
      },
      {
        regex: /tracking\s+may\s+not\s+update\s+for/,
        explanation: "Tracking gaps are common with Chinese shipping methods where packages leave China before tracking activates."
      },
    ];

    for (const phrase of dropshippingPhrases) {
      const match = normalized.match(phrase.regex);
      if (match) {
        createBanner(
          "⚠️ WARNING: Strong indicators this is dropshipped from China",
          "yellow",
          {
            found: match[0],
            explanation: phrase.explanation,
            url: sourceUrl
          }
        );
        return true;
      }
    }

    // ✅ Australian/local shipping indicators (check second)
    const australianPhrases = [
      {
        regex: /ships?\s+from\s+(sydney|melbourne|brisbane|perth|adelaide|australia)/,
        explanation: "Products shipping from Australian cities typically arrive within 3-7 days and indicate local stock."
      },
      {
        regex: /australia\s+post/,
        explanation: "Australia Post is the national postal service. Using AusPost indicates the seller has local Australian stock."
      },
      {
        regex: /\bauspost\b/,
        explanation: "AusPost (Australia Post) indicates local Australian shipping with typical delivery times of 2-5 business days."
      },
      {
        regex: /australian\s+stock|local\s+stock/,
        explanation: "Local or Australian stock means the seller has inventory in Australia, ensuring faster delivery and easier returns."
      },
      {
        regex: /same\s+day\s+(dispatch|shipping)/,
        explanation: "Same-day dispatch indicates the seller has immediate access to inventory, which is rare with dropshipping."
      },
      {
        regex: /express\s+post\s+available/,
        explanation: "Express Post is an Australia Post service offering next-day delivery, only possible with local stock."
      },
    ];

    for (const phrase of australianPhrases) {
      const match = normalized.match(phrase.regex);
      if (match) {
        createBanner(
          "✅ Ships from Australia - Local stock detected",
          "lightgreen",
          {
            found: match[0],
            explanation: phrase.explanation,
            url: sourceUrl
          }
        );
        return true;
      }
    }

    // 🔑 Detect any variant of 7–20 days (original pattern)
    const sevenToTwentyMatch = normalized.match(/\b7\s*[-–]\s*20\s*(business\s*)?days/);
    if (sevenToTwentyMatch) {
      createBanner(
        "⚠️ Shipping policy shows 7–20 days. This product is likely dropshipped from China",
        "yellow",
        {
          found: sevenToTwentyMatch[0],
          explanation: "Delivery times of 7-20 days are typical for products dropshipped from China. Australian businesses typically deliver within 3-7 days.",
          url: sourceUrl
        }
      );
      return true;
    }

    // Additional pattern: "7 to 20 days"
    const sevenToTwentyAltMatch = normalized.match(/\b7\s+to\s+20\s*(business\s*)?days/);
    if (sevenToTwentyAltMatch) {
      createBanner(
        "⚠️ Shipping policy shows 7 to 20 days. This product is likely dropshipped from China",
        "yellow",
        {
          found: sevenToTwentyAltMatch[0],
          explanation: "Delivery times of 7-20 days are typical for products dropshipped from China. Australian businesses typically deliver within 3-7 days.",
          url: sourceUrl
        }
      );
      return true;
    }

    // Check for week-based patterns (e.g., 1-2 weeks, 2-3 weeks)
    const weekMatch = normalized.match(/\b(\d{1})\s*[-–]\s*(\d{1})\s*weeks?\b/);
    if (weekMatch) {
      const minWeeks = parseInt(weekMatch[1]);
      const maxWeeks = parseInt(weekMatch[2]);
      const minDays = minWeeks * 7;
      const maxDays = maxWeeks * 7;

      if (maxDays <= 7) {
        createBanner(
          "✅ Shipping policy shows " +
            minWeeks +
            "-" +
            maxWeeks +
            " weeks (" +
            minDays +
            "-" +
            maxDays +
            " days). This product likely ships from Australia.",
          "lightgreen",
          {
            found: weekMatch[0],
            explanation: "Short delivery times (≤7 days) typically indicate local Australian stock.",
            url: sourceUrl
          }
        );
      } else {
        createBanner(
          "⚠️ Shipping policy shows " +
            minWeeks +
            "-" +
            maxWeeks +
            " weeks (" +
            minDays +
            "-" +
            maxDays +
            " days). This product likely ships from China",
          "yellow",
          {
            found: weekMatch[0],
            explanation: "Delivery times over 1 week are typical for dropshipped products from China.",
            url: sourceUrl
          }
        );
      }
      return true;
    }

    // Check for "up to X days"
    const upToMatch = normalized.match(/up\s*to\s*(\d{1,2})\s*(?:business\s*)?days?\b/);
    if (upToMatch) {
      const days = parseInt(upToMatch[1]);
      if (days <= 7) {
        createBanner(
          "✅ Shipping policy shows up to " +
            days +
            " days. This product likely ships from Australia.",
          "lightgreen",
          {
            found: upToMatch[0],
            explanation: "Delivery within 7 days typically indicates local Australian stock.",
            url: sourceUrl
          }
        );
      } else if (days <= 20) {
        createBanner(
          "⚠️ Shipping policy shows up to " +
            days +
            " days. This product may be dropshipped from China",
          "yellow",
          {
            found: upToMatch[0],
            explanation: "Extended delivery times (8-20 days) often indicate dropshipping from overseas suppliers.",
            url: sourceUrl
          }
        );
      } else {
        createBanner(
          "⚠️ Shipping policy shows up to " +
            days +
            " days. Delivery may be international.",
          "orange",
          {
            found: upToMatch[0],
            explanation: "Very long delivery times (>20 days) typically indicate international shipping, often from China.",
            url: sourceUrl
          }
        );
      }
      return true;
    }

    // Check for "between X and Y days"
    const betweenMatch = normalized.match(/between\s*(\d{1,2})\s*and\s*(\d{1,2})\s*(?:business\s*)?days?\b/);
    if (betweenMatch) {
      const min = parseInt(betweenMatch[1]);
      const max = parseInt(betweenMatch[2]);

      if (max <= 7) {
        createBanner(
          "✅ Shipping policy shows " +
            min +
            "-" +
            max +
            " days. This product likely ships from Australia.",
          "lightgreen",
          {
            found: betweenMatch[0],
            explanation: "Delivery within 7 days typically indicates local Australian stock.",
            url: sourceUrl
          }
        );
      } else if (min >= 7 && max <= 20) {
        createBanner(
          "⚠️ Shipping policy shows " +
            min +
            "-" +
            max +
            " days. This product likely ships from China",
          "yellow",
          {
            found: betweenMatch[0],
            explanation: "Delivery times of 7-20 days are typical for dropshipped products from China.",
            url: sourceUrl
          }
        );
      } else {
        createBanner(
          "⚠️ Shipping policy shows " +
            min +
            "-" +
            max +
            " days. Delivery may be international.",
          "orange",
          {
            found: betweenMatch[0],
            explanation: "Extended international delivery times may indicate dropshipping from overseas.",
            url: sourceUrl
          }
        );
      }
      return true;
    }

    // Fallback: generic day ranges (original pattern - case insensitive)
    const dayMatch = normalized.match(/(\d{1,2})\s*[-–]\s*(\d{1,2})\s*days/i);
    if (dayMatch) {
      const min = parseInt(dayMatch[1]);
      const max = parseInt(dayMatch[2]);

      if (max <= 7) {
        createBanner(
          "✅ Shipping policy shows " +
            min +
            "-" +
            max +
            " days. This product likely ships from Australia.",
          "lightgreen",
          {
            found: dayMatch[0],
            explanation: "Delivery within 7 days typically indicates local Australian stock.",
            url: sourceUrl
          }
        );
      } else if (min >= 7 && max <= 20) {
        createBanner(
          "⚠️ Shipping policy shows " +
            min +
            "-" +
            max +
            " days. This product likely ships from China",
          "yellow",
          {
            found: dayMatch[0],
            explanation: "Delivery times of 7-20 days are typical for dropshipped products from China.",
            url: sourceUrl
          }
        );
      } else {
        createBanner(
          "⚠️ Shipping policy shows " +
            min +
            "-" +
            max +
            " days. Delivery may be international.",
          "orange",
          {
            found: dayMatch[0],
            explanation: "Extended international delivery times may indicate dropshipping from overseas.",
            url: sourceUrl
          }
        );
      }
      return true;
    }

    return false;
  }

  // Strategy 1: If we're already on a shipping page, analyze it directly
  if (isShippingPage) {
    const pageText = document.body.innerText;
    if (analyzeShippingText(pageText, window.location.href)) {
      return; // Successfully analyzed current page
    }
  }

  // Default banner (shown on product pages)
  createBanner(
    "⚠️ WARNING: This may be a dropshipping site - Confirm shipping policy"
  );

  // Strategy 2: Find and fetch shipping/delivery policy links
  const policyLink = [...document.querySelectorAll("a")]
    .map(a => a.href)
    .find(href => href.toLowerCase().includes("shipping") || href.toLowerCase().includes("delivery"));

  if (policyLink) {
    fetch(policyLink)
      .then(res => res.text())
      .then(html => {
        // Try to analyze the fetched HTML
        if (analyzeShippingText(html, policyLink)) {
          return; // Successfully analyzed fetched content
        }
      })
      .catch(err => console.debug("Could not fetch shipping policy:", err));
  }
})();