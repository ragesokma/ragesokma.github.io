/* RAGE SOKMA v2.6.x
 * Base-path normalizer
 *
 * When the site is served from a subfolder (e.g. http://127.0.0.1:5500/rage_v26/)
 * absolute internal links like /faq.html point to the server root and break.
 * GitHub Pages project sites also use a subpath (/{repo}/).
 */

(function () {
  "use strict";

  // If user explicitly set a base path, respect it.
  const explicit = document.documentElement.getAttribute("data-basepath");

  // Compute base path from current URL.
  // Examples:
  //  - /index.html                -> ""
  //  - /rage_v26/index.html       -> "/rage_v26"
  //  - /rage_v26/artikel/x.html   -> "/rage_v26"
  const path = window.location.pathname || "/";
  const parts = path.split("/").filter(Boolean);

  // Find the project root by searching for a known marker file in the path.
  // We assume the project root contains 'assets/'.
  // In static hosting, the safest is: take first segment if we are inside a folder.
  let basePath = "";
  if (explicit) {
    basePath = explicit.replace(/\/$/, "");
  } else if (parts.length > 1) {
    // If served from /{folder}/..., use the first folder as base.
    basePath = "/" + parts[0];
  }

  // Expose for debugging.
  window.__RAGE_BASEPATH__ = basePath;

  const isSameOrigin = (url) => {
    try {
      const u = new URL(url, window.location.href);
      return u.origin === window.location.origin;
    } catch {
      return false;
    }
  };

  // Rewrite anchors that start with a single leading slash.
  const rewrite = () => {
    if (!basePath) return;

    document.querySelectorAll('a[href^="/"]').forEach((a) => {
      const href = a.getAttribute("href");
      if (!href) return;
      // Skip protocol-relative (//example.com)
      if (href.startsWith("//")) return;
      // Skip if already includes basePath
      if (href.startsWith(basePath + "/")) return;
      // Only rewrite same-origin paths
      const abs = new URL(href, window.location.origin).toString();
      if (!isSameOrigin(abs)) return;
      a.setAttribute("href", basePath + href);
    });
  };

  // Run after DOM is ready (works with partial/JS-injected nav too).
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", rewrite);
  } else {
    rewrite();
  }

  // If nav/drawer is injected later, rewrite again.
  const mo = new MutationObserver(() => rewrite());
  mo.observe(document.documentElement, { subtree: true, childList: true });
})();
