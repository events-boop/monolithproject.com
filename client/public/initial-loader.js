(function () {
  const loader = document.getElementById("initial-loader");
  if (!loader) return;

  let removed = false;
  let removing = false;
  const startedAt = performance.now();
  const MIN_VISIBLE_MS = 420;
  const FADE_MS = 280;

  const removeLoader = () => {
    if (removed || removing) return;
    removing = true;

    const elapsed = performance.now() - startedAt;
    const wait = Math.max(0, MIN_VISIBLE_MS - elapsed);

    setTimeout(() => {
      if (removed) return;
      removed = true;
      window.dispatchEvent(new Event("monolith:loader-exit"));
      loader.classList.add("is-exiting");
      setTimeout(() => {
        loader.remove();
        window.dispatchEvent(new Event("monolith:loader-removed"));
      }, FADE_MS);
    }, wait);
  };

  window.addEventListener("monolith:app-ready", removeLoader, { once: true });
  window.addEventListener("load", removeLoader, { once: true });
  setTimeout(removeLoader, 2500);
})();
