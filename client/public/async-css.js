// Applies the full stylesheets of prerendered pages after first paint (their
// above-the-fold CSS is inlined). The list comes from this script's
// data-css attribute. External file so no inline-script CSP allowance is
// needed; a <noscript> fallback in the page covers no-JS visitors.
(function () {
  var self = document.currentScript;
  var hrefs = ((self && self.getAttribute("data-css")) || "")
    .split(",")
    .filter(Boolean);
  if (!hrefs.length) return;
  var applied = false;
  function apply() {
    if (applied) return;
    applied = true;
    for (var i = 0; i < hrefs.length; i++) {
      var link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = hrefs[i];
      link.crossOrigin = "anonymous";
      document.head.appendChild(link);
    }
  }
  ["pointerdown", "keydown", "touchstart", "scroll"].forEach(function (type) {
    window.addEventListener(type, apply, { once: true, passive: true });
  });
  // Otherwise apply right after the browser reports first paint.
  var painted =
    window.performance &&
    performance.getEntriesByType &&
    performance.getEntriesByType("paint").length > 0;
  if (painted) {
    setTimeout(apply, 0);
  } else if ("PerformanceObserver" in window) {
    try {
      var observer = new PerformanceObserver(function () {
        observer.disconnect();
        setTimeout(apply, 0);
      });
      observer.observe({ type: "paint", buffered: true });
    } catch (error) {
      setTimeout(apply, 0);
    }
  } else {
    setTimeout(apply, 0);
  }
  // Safety net if no paint entry is ever reported.
  setTimeout(apply, 1000);
})();
