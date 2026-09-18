/* Sunsets.vip — show-page interactions. Tracking lives in tracking.js. */
(() => {
  'use strict';
  const heroButton = document.getElementById('hero-tickets-btn');
  const dock = document.querySelector('.booking-dock');
  const closing = document.querySelector('.closing-card');

  // Keep tickets available while the main booking button is outside the viewport.
  function updateDock() {
    const heroRect = heroButton.getBoundingClientRect();
    const heroOutside = heroRect.bottom < 0 || heroRect.top >= window.innerHeight;
    const rect = closing.getBoundingClientRect();
    const closingVisible = rect.top < window.innerHeight && rect.bottom > 0;
    const visible = heroOutside && !closingVisible;
    dock.classList.toggle('is-visible', visible);
    dock.inert = !visible;
  }
  let framePending = false;
  function scheduleDockUpdate() {
    if (framePending) return;
    framePending = true;
    requestAnimationFrame(() => { updateDock(); framePending = false; });
  }
  window.addEventListener('scroll', scheduleDockUpdate, { passive: true });
  window.addEventListener('resize', scheduleDockUpdate);
  updateDock();

  const dialog = document.getElementById('privacy-dialog');
  document.getElementById('privacy-open').addEventListener('click', () => dialog.showModal());
  for (const [id, choice] of [['privacy-accept', 'accepted'], ['privacy-decline', 'declined']]) {
    document.getElementById(id).addEventListener('click', () => {
      window.sunsetsTracking?.setConsent(choice);
      dialog.close();
    });
  }
  dialog.addEventListener('click', (event) => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
})();
