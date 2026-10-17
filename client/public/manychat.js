/* Shared by the React site and standalone Sunsets event guide. */
(() => {
  if (window.__monolithManychatConsent) return;
  window.__monolithManychatConsent = true;
  const consentKey = "monolith_cookie_consent";
  const loadWhenAllowed = () => {
    try {
      if (localStorage.getItem(consentKey) !== "accepted") return;
    } catch {
      return;
    }
    if (document.getElementById("monolith-manychat-config")) return;
    const script = document.createElement("script");
    script.id = "monolith-manychat-config";
    script.src = "https://widget.manychat.com/3868559_7108b.js";
    script.defer = true;
    // The account script inserts #mcwidget-core from mccdn.me itself.
    // Adding that library again would initialize it twice.
    script.onerror = () => script.remove();
    document.head.appendChild(script);
  };
  window.addEventListener("monolith:cookie-consent-resolved", loadWhenAllowed);
  window.addEventListener("storage", event => {
    if (event.key === consentKey) loadWhenAllowed();
  });
  loadWhenAllowed();
})();
