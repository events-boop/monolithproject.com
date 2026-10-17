// Applies stylesheets that prerendered pages preload without blocking first
// paint (their above-the-fold CSS is inlined). External file so no inline
// script or event-handler CSP allowance is needed.
(function () {
  var links = document.querySelectorAll('link[rel="preload"][data-async-css]');
  for (var i = 0; i < links.length; i++) {
    links[i].rel = "stylesheet";
    links[i].removeAttribute("as");
  }
})();
