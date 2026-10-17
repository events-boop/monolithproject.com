// Prerendered pages already contain their finished markup, so the app bundle
// starts loading after first paint instead of competing with it. External
// file so no inline-script CSP allowance is needed.
(function () {
  var entry = document.querySelector("script[data-app-entry]");
  if (!entry) return;
  var started = false;
  function start() {
    if (started) return;
    started = true;
    var preloads = (entry.getAttribute("data-app-preloads") || "")
      .split(",")
      .filter(Boolean);
    for (var i = 0; i < preloads.length; i++) {
      var hint = document.createElement("link");
      hint.rel = "modulepreload";
      hint.crossOrigin = "anonymous";
      hint.href = preloads[i];
      document.head.appendChild(hint);
    }
    var s = document.createElement("script");
    s.type = "module";
    s.crossOrigin = "anonymous";
    s.src = entry.getAttribute("data-app-entry");
    document.head.appendChild(s);
  }
  // Any interaction starts the app immediately.
  ["pointerdown", "keydown", "touchstart"].forEach(function (type) {
    window.addEventListener(type, start, { once: true, passive: true });
  });
  // Otherwise, start shortly after the browser reports first paint.
  function afterPaint() {
    setTimeout(start, 150);
  }
  var painted =
    window.performance &&
    performance.getEntriesByType &&
    performance.getEntriesByType("paint").length > 0;
  if (painted) {
    afterPaint();
  } else if ("PerformanceObserver" in window) {
    try {
      var observer = new PerformanceObserver(function () {
        observer.disconnect();
        afterPaint();
      });
      observer.observe({ type: "paint", buffered: true });
    } catch (error) {
      afterPaint();
    }
  } else {
    afterPaint();
  }
  // Safety net if no paint entry is ever reported.
  setTimeout(start, 1500);
})();
