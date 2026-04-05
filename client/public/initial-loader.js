(function () {
  const loader = document.getElementById("initial-loader");
  if (!loader) return;

  let removed = false;
  const removeLoader = () => {
    if (removed) return;
    removed = true;
    loader.style.opacity = "0";
    setTimeout(() => loader.remove(), 500);
  };

  window.addEventListener("monolith:app-ready", removeLoader, { once: true });
  window.addEventListener("load", () => setTimeout(removeLoader, 150), { once: true });
  setTimeout(removeLoader, 6000);
})();
