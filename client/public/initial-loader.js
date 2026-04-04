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

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => setTimeout(removeLoader, 100), { once: true });
  } else {
    setTimeout(removeLoader, 100);
  }

  window.addEventListener("load", removeLoader, { once: true });
  setTimeout(removeLoader, 3000);
})();
